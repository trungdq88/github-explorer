/**
 * Created by dinhquangtrung on 11/10/15.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import App from '../App.jsx';
import { expect } from 'chai';

describe('App', () => {
  it('Should have the bootstrap button', () => {
    // We need an extra <div> to wrap the stateless component
    const app = TestUtils.renderIntoDocument(
      <div>
        <App />
      </div>
    );
    const appElement = ReactDOM.findDOMNode(app);
    expect(appElement.querySelectorAll('#the-bootstrap-btn').length).to.equal(1);
  });
});
