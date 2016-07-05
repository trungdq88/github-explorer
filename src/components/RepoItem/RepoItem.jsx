import React from 'react';
import { Link } from 'react-router';
import RepoContent from '../RepoContent/RepoContent.jsx';
import ReactDom from 'react-dom';
import './style.less';

import action, { ACTIONS } from '../../action/action.js';

export default class RepoItem extends React.Component {
  constructor(...args) {
    super(...args);
    this.click = this.click.bind(this);
  }

  click() {
    const dom = ReactDom.findDOMNode(this.refs.link);
    action.onNext({
      name: ACTIONS.DETAIL_TRANSITION_DATA,
      data: {
        startPosition: dom.getBoundingClientRect(),
        repoData: this.props,
      },
    });
  }

  render() {
    return (
      <Link
        ref="link"
        to={`/user/${this.props.owner.login}/repos/${this.props.name}`}
        className="repo-item"
        onClick={this.click}
      >
        <RepoContent {...this.props} />
      </Link>
    );
  }
}
