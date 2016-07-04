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
      console.log('[PageTransition]', nextProps);
      this.state[`child${this.state.nextChild}`] = nextProps.children;
      this.forceUpdate(() => {
        const newDom = ReactDom
        .findDOMNode(this.refs[`child${this.state.nextChild}`]);
        if (newDom.classList.contains('transition-item')) {
          newDom.classList.add('transition-appear');
          setTimeout(() => newDom.classList.add('transition-appear-active'), 17);
        }
      });
      setTimeout(() => {
        const previousChild = this.state.nextChild;
        this.state.nextChild = this.state.nextChild === 1 ? 2 : 1;
        this.state[`child${this.state.nextChild}`] = null;
        this.forceUpdate(() => {
          const newDom = ReactDom
          .findDOMNode(this.refs[`child${previousChild}`]);
          if (newDom.classList.contains('transition-item')) {
            newDom.classList.remove('transition-appear');
            newDom.classList.remove('transition-appear-active');
          }
        });
      }, 500);
    }
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
