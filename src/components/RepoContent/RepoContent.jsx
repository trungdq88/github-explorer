import React from 'react';
import './style.less';

export default (props) => (
  <div className="repo-content">
    {/* <div className="repo-pretitle">react-admin-framework/</div> */}
    <div className="repo-title">{props.name}</div>
    <div className="repo-desc">{props.description}</div>
    <div className="repo-date">{props.updated_at}</div>
    <div className="repo-info">
      <div className="repo-language">{props.language}</div>
      <div className="repo-stats">
        <i className="fa fa-eye"></i> {props.watchers_count}
        <i className="fa fa-star"></i> {props.stargazers_count}
        <i className="fa fa-code-fork"></i> {props.forks}
      </div>
    </div>
  </div>
);
