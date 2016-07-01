import React from 'react';
import classNames from 'classnames';
import './style.less';

export default (props) => (
  <span
    className={classNames({
      'text-holder-wrapper': !props.children,
      center: props.center,
    })}
    style={!props.children ? {
      width: props.width,
      height: props.height,
    } : {}}
  >
    {props.children || <div className="text-holder"></div>}
  </span>
);
