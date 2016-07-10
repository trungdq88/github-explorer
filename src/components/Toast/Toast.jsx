import React from 'react';
import './style.less';

export default (props) => (
  <div className="toast">
    {props.toast.message}
    {props.toast.button}
  </div>
);
