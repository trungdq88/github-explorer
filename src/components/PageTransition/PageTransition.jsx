import React from 'react';
import ReactDom from 'react-dom';
import './style.less';

export default class PageTransition extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      child1: this.props.children,
      child2: null,
      nextChild: 2,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.children !== nextProps.children) {
      const previousPathname = this.props.children.props.location.pathname;
      this.state[`child${this.state.nextChild}`] = nextProps.children;
      this.forceUpdate(() => {
        const child = this.refs[`child${this.state.nextChild}`];
        const dom = ReactDom.findDOMNode(child);
        let timeout = 0;
        const att = dom.getAttribute('data-from-path');

        child.onTransitionData && child.onTransitionData(this.props.data);

        if (dom.classList.contains('transition-item') &&
            (att === null || att === previousPathname)) {
          dom.classList.add('transition-appear');
          setTimeout(() => dom.classList.add('transition-appear-active'), 17);
          timeout = this.props.timeout || 500;
        }

        setTimeout(() => {
          this.state.nextChild = this.state.nextChild === 1 ? 2 : 1;
          this.state[`child${this.state.nextChild}`] = null;
          this.forceUpdate(() => {
            if (dom.classList.contains('transition-item')) {
              dom.classList.remove('transition-appear');
              dom.classList.remove('transition-appear-active');
              dom.classList.remove('transition-item');
            }
            this.props.onLoad();
            child.onTransitionDone && child.onTransitionDone(this.props.data);
          });
        }, timeout);
      });
    }
  }

  componentDidMount() {
    const child = this.refs.child1;
    child.onTransitionDone && child.onTransitionDone(this.props.data);
  }

  render() {
    return (
      <div className="trasition-wrapper">
        {React.Children.map(this.state.child1, element =>
          React.cloneElement(element, { ref: 'child1' })
        )}
        {React.Children.map(this.state.child2, element =>
          React.cloneElement(element, { ref: 'child2' })
        )}
      </div>
    );
  }
}
