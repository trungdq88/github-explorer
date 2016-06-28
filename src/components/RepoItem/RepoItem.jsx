import React from 'react';
import { Link } from 'react-router';
import RepoContent from '../RepoContent/RepoContent.jsx';
import './style.less';

export default (props) => (
  <Link to={`/user/${props.owner.login}/repos/${props.name}`} className="repo-item">
    <RepoContent {...props} />
  </Link>
);
