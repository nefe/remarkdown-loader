import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Markdown.scss';
import Test from './test.md';

ReactDOM.render((
  <div>
    <div className="header">example</div>
    <Test className="test" />
  </div>
), document.getElementById('app'));
