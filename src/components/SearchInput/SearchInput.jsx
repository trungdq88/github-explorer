import React from 'react';
import './style.less';

export default (props) => (
  <div id="search-input">
    <button
      className={!props.buttonText ? 'icon' : null}
      onClick={props.onSearch}
    >
      {props.buttonText ?
        props.buttonText :
        <i className="fa fa-search"></i>
      }
    </button>
    <input
      aria-label="Search"
      onFocus={props.onFocus}
      onChange={props.onChange}
      value={props.value}
      placeholder={props.placeholder}
      type="search"
    />
  </div>
);
