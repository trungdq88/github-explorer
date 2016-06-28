import React from 'react';
import './style.less';

export default () => (
  <div id="footer">
    <div id="footer-logo">
      <i className="fa fa-github"></i>
      <span id="version">
        {window.VERSION}
      </span>
    </div>
    <div id="footer-credit">
      GitHub concept by<br />
      Quan &amp; Bang
    </div>
  </div>
);
