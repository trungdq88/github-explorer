import React from 'react';
import classNames from 'classnames';
import './style.less';

export default class Image extends React.Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const img = new window.Image();
    img.onload = this.onImageLoad.bind(this);
    img.src = this.props.src;
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
