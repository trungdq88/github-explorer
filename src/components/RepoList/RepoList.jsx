import React from 'react';
import RepoItem from '../RepoItem/RepoItem.jsx';
import SearchInput from '../SearchInput/SearchInput.jsx';
import './style.less';

export default () => (
  <div id="repo-list-page">
    <SearchInput
      placeholder="Find a repository..."
      buttonText="SEARCH"
    />
    <div id="repo-list">
      {[1, 2, 3, 4, 5, 6].map(i => <RepoItem key={i} />)}
    </div>

    <div id="load-more">LOAD MORE</div>
  </div>
);
