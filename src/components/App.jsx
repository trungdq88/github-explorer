import React from 'react';
import './App.less';
import MainContent from './MainContent/MainContent.jsx';
import NavMenu from './NavMenu/NavMenu.jsx';

export default () => (
  <div>
    <NavMenu />
    <MainContent />
  </div>
);
