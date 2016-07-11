import React from 'react';
import Rx from 'rx';
import atob from 'atob';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import RepoContent from '../RepoContent/RepoContent.jsx';
import action, { ACTIONS, actionFactory } from '../../action/action.js';
import languageColor from '../../utils/language-color.js';
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
    this.wait = false;

    this.switchTab = this.switchTab.bind(this);
    this.refreshContentHeight = this.refreshContentHeight.bind(this);
  }

  componentDidMount() {
    this.scrollDom = document.getElementById('scroll-section');

    const repoDetail = action.filter(a => a.name === ACTIONS.REPO_DETAIL_RECEIVED);
    const repoReadme = action.filter(a => a.name === ACTIONS.REPO_README_RECEIVED);
    const repoContribs = action.filter(a => a.name === ACTIONS.REPO_CONTRIS_RECEIVED);
    const repoContents = action.filter(a => a.name === ACTIONS.REPO_CONTENTS_RECEIVED);
    const repoLanguages = action.filter(a => a.name === ACTIONS.REPO_LANGUAGES_RECEIVED);

    this.obsRepoDetailReceived = repoDetail.map(a => a.data)
    .subscribe(repo => this.setState({ repo }));

    this.obsRepoReadmeReceived = repoReadme
    .map(a => a.data.content)
    .subscribe(readme => {
      this.setState({
        readme,
        activeTab: 'readme',
      }, () => {
        this.refreshContentHeight(TABS[0]);
      });
    });

    this.obsRepoContribsReceived = repoContribs
    .map(a => a.data)
    .subscribe(contribs => this.setState({ contribs }));

    this.obsRepoContentsReceived = repoContents
    .map(a => a.data)
    .map(contents => {
      contents.sort((a, b) => a.type.localeCompare(b.type));
      return contents;
    })
    .subscribe(contents => this.setState({ contents }));

    this.obsRepoLanguagesReceived = repoLanguages
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

    this.obsLoadDone = Rx.Observable.zip(
      repoDetail,
      repoReadme,
      repoContribs,
      repoContents,
      repoLanguages
    ).subscribe(() => action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION_DONE }));

    // Track the tab wrapper
    this.obsTabWrapper = Rx.Observable
    .fromEvent(this.scrollDom, 'scroll')
    .subscribe(() => {
      this.lastOffsetTop = this.refs.tabWrapper.parentElement.getBoundingClientRect().top;
      if (this.wait === false) {
        window.requestAnimationFrame(() => {
          if (this.lastOffsetTop < 60) {
            this.refs.tabWrapper.classList.add('fixed');
          } else {
            this.refs.tabWrapper.classList.remove('fixed');
          }
          this.wait = false;
        });
        this.wait = true;
      }
    });


    action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION });
  }

  componentWillUnmount() {
    this.obsRepoDetailReceived.dispose();
    this.obsRepoReadmeReceived.dispose();
    this.obsRepoContribsReceived.dispose();
    this.obsRepoContentsReceived.dispose();
    this.obsRepoLanguagesReceived.dispose();
    this.obsLoadDone.dispose();
    this.obsTabWrapper.dispose();
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

  transitionManuallyStart() {
    this.setState({
      startPosition: {
        top: 60,
      },
      doTransform: true,
    });
  }

  transitionManuallyStop() {
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
    const input = this.state.readme ? atob(this.state.readme.replace(/\s/g, '')) : null;
    return (
      <div
        id="repo-detail"
        className="transition-item"
        style={{
          transform: this.state.doTransform ?
            `translate3d(0, ${this.state.startPosition.top + this.state.offsetTop - 60}px, 0)` :
              undefined,
        }}
      >
        <RepoContent {...(this.state.repoDetailData || this.state.repo)} />

        <ReactCSSTransitionGroup
          className="tab-wrapper-transition-group"
          transitionName="list"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <div
            id="repo-tabs-wrapper"
            ref="tabWrapper"
          >
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
            {input ?
              <ReactMarkdown source={input} /> : <div className="empty-data">No data</div>}
          </div>

          <div
            className={classNames('repo-content-item', { show: this.state.activeTab === 'files' })}
            id="files"
          >
            {this.state.contents.length ? this.state.contents.map(content =>
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
            ) : <div className="empty-data">No data</div>}
          </div>

          <div
            className={classNames('repo-content-item',
                                  { show: this.state.activeTab === 'contributors' })}
            id="contributors"
          >
            {this.state.contribs.length ? this.state.contribs.map(contrib =>
              <div key={contrib.id + contrib.login} className="contrib-item">
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
            ) : <div className="empty-data">No data</div>}
          </div>

          <div
            className={classNames('repo-content-item',
                                  { show: this.state.activeTab === 'languages' })}
            id="languages"
          >
            {this.state.languages.length ? this.state.languages.map(language =>
              <div key={language.name} className="lang-item">
                <div
                  className="lang-color"
                  style={{ backgroundColor: languageColor(language.name) }}
                ></div>
                <div className="lang-info">
                  <div className="lang-name">{language.name}</div>
                  <div className="lang-value">{language.value}%</div>
                </div>
              </div>
              ) : <div className="empty-data">No data</div>}
          </div>

        </div>
      </div>
    );
  }
}
