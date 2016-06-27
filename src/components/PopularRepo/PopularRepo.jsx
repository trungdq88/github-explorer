import React from 'react';
import './style.less';

export default () => (
  <div className="repo-list">
    <div className="repo-list-header">POPULAR REPOSITORIES</div>
    <div>
      {[1, 2, 3, 4, 5, 6].map(i => {
        return (
          <div className="repo-item">
            <div className="repo-pretitle">react-admin-framework/</div>
            <div className="repo-title">ChordDroid</div>
            <div className="repo-desc">Android library to render Guitar Chord.</div>
            <div className="repo-date">Updated on Sep 26, 2015</div>
            <div className="repo-info">
              <div className="repo-language">Java</div>
              <div className="repo-stats">
                <i className="fa fa-eye"></i> 1
                <i className="fa fa-star"></i> 6
                <i className="fa fa-code-fork"></i> 0
              </div>
            </div>
          </div>
        );
    })}
    </div>
  </div>
);
