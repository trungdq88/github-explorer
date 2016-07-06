import React from 'react';
import moment from 'moment';
import TextHolder from '../TextHolder/TextHolder.jsx';
import './style.less';

export default (props) => (
  <div className="repo-content">
    {/* <div className="repo-pretitle">react-admin-framework/</div> */}
    <div className="repo-title">
      <TextHolder width={150} height={23}>
        {props.name}
      </TextHolder>
    </div>
    <div className="repo-desc">
      <TextHolder width={260} height={21}>
        {props.description}
      </TextHolder>
    </div>
    <div className="repo-date">
      <TextHolder width={80} height={12}>
        Updated {moment(props.updated_at).fromNow()}
      </TextHolder>
    </div>
    <div className="repo-info">
      <div className="repo-language">
        <TextHolder width={100} height={15}>
          {props.language}
        </TextHolder>
      </div>
      <div className="repo-stats">
        <i className="fa fa-eye"></i> {props.watchers_count}
        <i className="fa fa-star"></i> {props.stargazers_count}
        <i className="fa fa-code-fork"></i> {props.forks}
      </div>
    </div>
  </div>
);
