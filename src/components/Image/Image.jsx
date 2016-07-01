import React from 'react';
import classNames from 'classnames';
import './style.less';

export default class Image extends React.Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
    };
    this.img = new window.Image();
    this.onImageLoad = this.onImageLoad.bind(this);
  }

  componentDidMount() {
    this.img.onload = this.onImageLoad;
    this.img.src = this.props.src;
  }

  componentWillUnmount() {
    this.img.onload = () => {};
  }

  onImageLoad() {
    this.setState({ loaded: true });
  }

  render() {
    return (
      <div
        className={classNames(this.props.className, ' image-fade')}
        style={this.state.loaded ? {
          backgroundImage: `url('${this.props.src}')`,
          opacity: 1,
        } : {}}
      >
      </div>
    );
  }

}
