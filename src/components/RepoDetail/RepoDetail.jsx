import React from 'react';
import atob from 'atob';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import RepoContent from '../RepoContent/RepoContent.jsx';
import action, { ACTIONS, actionFactory } from '../../action/action.js';
import languageColor from '../../utils/lanugage-color.js';
import './style.less';

const TABS = [
  { key: 'readme', value: 'README' },
  { key: 'files', value: 'FILES & DIRECTORIES' },
  { key: 'contributors', value: 'CONTRIBUTORS' },
  { key: 'languages', value: 'LANGUAGES' },
];

export default class RepoDetail extends React.Component {

  constructor() {
    super();
    this.state = {
      activeTab: 'readme',
      repo: {},
      readme: '',
      contribs: [],
      contents: [],
      languages: [],
    };
  }

  componentDidMount() {
    this.obsRepoDetailReceived = action
    .filter(a => a.name === ACTIONS.REPO_DETAIL_RECEIVED)
    .map(a => a.data)
    .subscribe(repo => this.setState({ repo }));

    this.obsRepoReadmeReceived = action
    .filter(a => a.name === ACTIONS.REPO_README_RECEIVED)
    .map(a => a.data.content)
    .subscribe(readme => this.setState({ readme }));

    this.obsRepoContribsReceived = action
    .filter(a => a.name === ACTIONS.REPO_CONTRIS_RECEIVED)
    .map(a => a.data)
    .subscribe(contribs => this.setState({ contribs }));

    this.obsRepoContentsReceived = action
    .filter(a => a.name === ACTIONS.REPO_CONTENTS_RECEIVED)
    .map(a => a.data)
    .map(contents => {
      contents.sort((a, b) => a.type.localeCompare(b.type));
      return contents;
    })
    .subscribe(contents => this.setState({ contents }));

    this.obsRepoLanguagesReceived = action
    .filter(a => a.name === ACTIONS.REPO_LANGUAGES_RECEIVED)
    .map(a => a.data)
    .map(languages => {
      const newLanguages = Object.keys(languages)
      .map(key => ({ name: key, value: languages[key] }));
      const total = newLanguages.length === 1 ?
        newLanguages[0].value : newLanguages.reduce((a, b) => ({ value: a.value + b.value })).value;
      return newLanguages.map(a => ({
        name: a.name,
        value: Math.round(1000 * a.value / total) / 10,
      }));
    })
    .subscribe(languages => this.setState({ languages }));

    // Get user profile
    actionFactory.getRepoDetail(this.props.params.username, this.props.params.repoName);
    actionFactory.getRepoReadme(this.props.params.username, this.props.params.repoName);
    actionFactory.getRepoContents(this.props.params.username, this.props.params.repoName);
    actionFactory.getRepoContribs(this.props.params.username, this.props.params.repoName);
    actionFactory.getRepoLanguages(this.props.params.username, this.props.params.repoName);
  }

  componentWillUnmount() {
    this.obsRepoDetailReceived.dispose();
    this.obsRepoReadmeReceived.dispose();
    this.obsRepoContribsReceived.dispose();
    this.obsRepoContentsReceived.dispose();
    this.obsRepoLanguagesReceived.dispose();
  }

  render() {
    const input = this.state.readme ? atob(this.state.readme.replace(/\s/g, '')) : '';
    return (
      <div id="repo-detail">
        <RepoContent {...this.state.repo} />
        <div id="repo-tabs-wrapper">
          <div id="repo-tabs">
            {TABS.map(tab =>
              <div
                key={tab.key}
                onClick={() => this.setState({ activeTab: tab.key })}
                className={classNames('repo-tab-item',
                                      { selected: this.state.activeTab === tab.key })}
              >{tab.value}</div>
            )}
          </div>
        </div>
        <div id="repo-tab-content">
          <div
            className={classNames('repo-tab-item', 'markdown-body',
                                  { show: this.state.activeTab === 'readme' })}
            id="readme-content"
          >
            <ReactMarkdown source={input} />
          </div>

          <div
            className={classNames('repo-tab-item', { show: this.state.activeTab === 'files' })}
            id="files"
          >
            {this.state.contents.map(content =>
              <div key={content.sha} className="file-item">
                <div className="file-icon">
                  {content.type === 'file' ?
                    <i className="fa fa-file-text-o"></i> :
                    <i className="fa fa-folder"></i>}
                </div>
                <div className="file-info">
                  <div className="file-name">{content.name}</div>
                  <div className="file-date">{content.size}</div>
                </div>
              </div>
            )}
          </div>

          <div
            className={classNames('repo-tab-item',
                                  { show: this.state.activeTab === 'contributors' })}
            id="contributors"
          >
            {this.state.contribs.map(contrib =>
              <div key={contrib.id} className="contrib-item">
                <div
                  className="contrib-avatar"
                  style={{ backgroundImage: `url('${contrib.avatar_url}')` }}
                ></div>
                <div className="contrib-info">
                  <div className="contrib-name">{contrib.login}</div>
                  <div className="contrib-value">{contrib.contributions} {' '}
                    contribution{contrib.contributions === 1 ? '' : 's'}</div>
                </div>
              </div>
            )}
          </div>

          <div
            className={classNames('repo-tab-item', { show: this.state.activeTab === 'languages' })}
            id="languages"
          >
            {this.state.languages.map(language =>
              <div key={language.name} className="lang-item">
                <div
                  className="lang-color"
                  style={{ backgroundColor: languageColor[language.name] }}
                ></div>
                <div className="lang-info">
                  <div className="lang-name">{language.name}</div>
                  <div className="lang-value">{language.value}%</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }
}
