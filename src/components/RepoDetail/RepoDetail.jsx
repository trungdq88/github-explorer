import React from 'react';
import atob from 'atob';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import RepoContent from '../RepoContent/RepoContent.jsx';
import action, { ACTIONS, actionFactory } from '../../action/action.js';
import languageColor from '../../utils/lanugage-color.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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
      activeTab: '',
      repo: {},
      readme: '',
      contribs: [],
      contents: [],
      languages: [],
      doTransform: false,
      offsetTop: 0,
      startPosition: {
        top: 0,
        left: 0,
        right: 0,
      },
    };

    this.switchTab = this.switchTab.bind(this);
    this.refreshContentHeight = this.refreshContentHeight.bind(this);
  }

  componentDidMount() {
    this.obsRepoDetailReceived = action
    .filter(a => a.name === ACTIONS.REPO_DETAIL_RECEIVED)
    .map(a => a.data)
    .subscribe(repo => this.setState({ repo }));

    this.obsRepoReadmeReceived = action
    .filter(a => a.name === ACTIONS.REPO_README_RECEIVED)
    .map(a => a.data.content)
    .subscribe(readme => {
      this.setState({
        readme,
        activeTab: 'readme',
      }, () => {
        this.refreshContentHeight(TABS[0]);
      });
    });

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

      let total = 0;
      if (newLanguages.length === 0) {
        total = 0;
      } else if (newLanguages.length === 1) {
        total = newLanguages[0].value;
      } else {
        total = newLanguages.reduce((a, b) => ({ value: a.value + b.value })).value;
      }

      return newLanguages.map(a => ({
        name: a.name,
        value: Math.round(1000 * a.value / total) / 10,
      }));
    })
    .subscribe(languages => this.setState({ languages }));

  }

  componentWillUnmount() {
    this.obsRepoDetailReceived.dispose();
    this.obsRepoReadmeReceived.dispose();
    this.obsRepoContribsReceived.dispose();
    this.obsRepoContentsReceived.dispose();
    this.obsRepoLanguagesReceived.dispose();
  }

  onTransitionWillStart(data) {
    this.setState({
      startPosition: data.detailPageData.startPosition,
      repoDetailData: data.detailPageData.repoData,
      offsetTop: data.scrollTop,
      doTransform: true,
    });
  }

  onTransitionDidEnd() {
    // Get user profile
    actionFactory.getRepoDetail(this.props.params.username, this.props.params.repoName);
    actionFactory.getRepoReadme(this.props.params.username, this.props.params.repoName);
    actionFactory.getRepoContents(this.props.params.username, this.props.params.repoName);
    actionFactory.getRepoContribs(this.props.params.username, this.props.params.repoName);
    actionFactory.getRepoLanguages(this.props.params.username, this.props.params.repoName);
  }

  transitionManuallyStart(data) {
    console.log('start');
    this.setState({
      startPosition: {
        top: 60,
      },
      doTransform: true,
    });
  }

  transitionManuallyStop(data) {
    console.log('stop');
    this.setState({
      doTransform: false,
    });
  }

  switchTab(tab) {
    this.setState({
      activeTab: tab.key,
    }, () => {
      this.refreshContentHeight(tab);
    });
  }

  refreshContentHeight(tab) {
    const selectedTab = document.getElementById(tab.key);
    this.refs.tabContent.style.height = `${selectedTab.offsetHeight + 30}px`;
  }

  render() {
    const input = this.state.readme ? atob(this.state.readme.replace(/\s/g, '')) : '';
    return (
      <div
        id="repo-detail"
        className="transition-item"
        style={{
          transform: this.state.doTransform ? `translate3d(0, ${this.state.startPosition.top + this.state.offsetTop - 60}px, 0)` : undefined,
        }}
      >
        <RepoContent {...(this.state.repoDetailData || this.state.repo)} />

        <ReactCSSTransitionGroup
          transitionName="list"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <div id="repo-tabs-wrapper">
            <div id="repo-tabs">
              {TABS.map(tab =>
                <div
                  key={tab.key}
                  onClick={() => this.switchTab(tab)}
                  className={classNames('repo-tab-item',
                                        { selected: this.state.activeTab === tab.key })}
                >{tab.value}</div>
              )}
            </div>
          </div>
        </ReactCSSTransitionGroup>
        <div ref="tabContent" id="repo-tab-content">
          <div
            className={classNames('repo-content-item', 'markdown-body',
                                  { show: this.state.activeTab === 'readme' })}
            id="readme"
          >
            <ReactMarkdown source={input} />
          </div>

          <div
            className={classNames('repo-content-item', { show: this.state.activeTab === 'files' })}
            id="files"
          >
            {this.state.contents.map(content =>
              <div key={content.sha + content.name} className="file-item">
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
            className={classNames('repo-content-item',
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
            className={classNames('repo-content-item',
                                  { show: this.state.activeTab === 'languages' })}
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
