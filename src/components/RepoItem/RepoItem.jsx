import React from 'react';
import { Link } from 'react-router';
import RepoContent from '../RepoContent/RepoContent.jsx';
import './style.less';

export default () => (
  <Link to="/user/abc/repos/test" className="repo-item">
    <RepoContent />
  </Link>
);
