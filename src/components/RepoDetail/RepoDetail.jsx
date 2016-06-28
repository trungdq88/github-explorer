import React from 'react';
import atob from 'atob';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import RepoContent from '../RepoContent/RepoContent.jsx';
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
    };
  }

  render() {
    const input = atob("IyAzOSBSaWRpY3Vsb3VzIEJveCBTaGFkb3dzCgpEZWxpY2lvdXMsIGp1aWN5 IENTUzMuICAKClJpcGUgZm9yIHRoZSB0YWtpbmcuCgpPaCwgdGhlIGdsb3J5 LgoKCiMjIEFib3V0Ckluc3BpcmVkIGJ5IFtEb3VnIEF2ZXJ54oCZcyBwb3N0 XShodHRwOi8vd3d3LnZpZ2V0LmNvbS91cGxvYWRzL2ZpbGUvYm94c2hhZG93 cy8pLCB0aGlzIApoYW5keSBsaXR0bGUgU3R5bHVzL0NTUyBMaWJyYXJ5IGlz IGp1c3Qgd2FpdGluZyBmb3IgeW91IHRvIHNoYXJlIHRoZSBzaGFkb3d5IGdv b2RuZXNzIApvbiB0aGUgV2ViLgoKCiMjIEZpbGUgTGF5b3V0CgogKiBFYWNo IGJveCBzaGFkb3cgaXMgc2VwYXJhdGVkIGludG8gaXRzIG93biBmaWxlLCBz byB5b3UgY2FuIGBAaW1wb3J0YCBvbmx5IHRoZSBzaGFkb3dzIHlvdSBuZWVk LiAgCiAqIFRoZSBgc3R5bHVzYCBkaXJlY3RvcnkgaXMgdGhlIOKAnHRydWXi gJ0gc291cmNlIGNvZGUuICBJdCBnZW5lcmF0ZXMgZXZlcnl0aGluZyB5b3Ug c2VlIGluIGBjc3NgIGFuZCBgY3NzLW1pbmAuCiAqIElmIHlvdSBkb27igJl0 IHVzZSBTdHlsdXMgKHlvdSB0b3RhbGx5IHNob3VsZCwgdGhvdWdoKSwgdGhl cmXigJlzIHByZS1jb21waWxlZCBDU1MgcmVhZHkgZm9yIHlvdSB0byB1c2Ug b3V0IG9mIHRoZSBib3guICBUaGVyZeKAmXMgZXZlbiBwcmUtKm1pbmlmaWVk KiBDU1MgaWYgeW91IHByZWZlci4gIEFyZW7igJl0IEkgdGhvdWdodGZ1bD8g Oi0pIAogKiBUaGUgZmlsZW5hbWVzIGFyZSBzaWxseSwgSSBrbm934oCmICBU aGV54oCZcmUgbmFtZWQgYWZ0ZXIgdGhlIENTUyBjbGFzcyBuYW1lcyBvZiB0 aGUgb3JpZ2luYWwgYXV0aG9yLiAgSeKAmWQgbGlrZSB0byBkbyBzb21ldGhp bmcgdG8gaW1wcm92ZSB0aGUgc2l0dWF0aW9uIHdpdGhvdXQgY29tcGxldGVs eSBsb3NpbmcgdGhlIHdoaW1zeSwgdGhvdWdoLiAgKE1heWJlIHN5bWxpbmtz 4oCmPyk= ".replace(/\s/g, ''));
    return (
      <div id="repo-detail">
        <RepoContent />
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i =>
              <div key={i} className="file-item">
                <div className="file-icon">
                  {i % 2 ?
                    <i className="fa fa-folder"></i> :
                    <i className="fa fa-file-text-o"></i>}
                </div>
                <div className="file-info">
                  <div className="file-name">.openshift</div>
                  <div className="file-date">about 1 year ago</div>
                </div>
              </div>
            )}
          </div>

          <div
            className={classNames('repo-tab-item',
                                  { show: this.state.activeTab === 'contributors' })}
            id="contributors"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i =>
              <div key={i} className="contrib-item">
                <div
                  className="contrib-avatar"
                  style={{ backgroundImage: `url('/assets/thumbnail-small-${i}.png')` }}
                ></div>
                <div className="contrib-info">
                  <div className="contrib-name">HaiNNT</div>
                  <div className="contrib-value">690 contributions</div>
                </div>
              </div>
            )}
          </div>

          <div
            className={classNames('repo-tab-item', { show: this.state.activeTab === 'languages' })}
            id="languages"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i =>
              <div key={i} className="lang-item">
                <div
                  className="lang-color"
                  style={{ backgroundColor: '#b17300' }}
                ></div>
                <div className="lang-info">
                  <div className="lang-name">JavaScript</div>
                  <div className="lang-value">89.9%</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }
}
