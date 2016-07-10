import React from 'react';
import './style.less';

export default () => (
  <div className="footer original">
    <div id="footer-logo">
      <a href="https://github.com/trungdq88/github-explorer" target="_blank">
        <i className="fa fa-github"></i>
        <span id="version">
          {window.VERSION}
        </span>
      </a>
    </div>
    <div id="footer-credit">
      GitHub concept by<br />
      Quan &amp; Bang
    </div>
  </div>
);
