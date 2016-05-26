import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Doc from './test.md';
import 'highlight.js/styles/monokai.css';

class Demo1 extends Component {
  render() {
    return (
      <div>
        <div className="header">demo1</div>
        <Doc ctx={{ React, ReactDOM }} className="demo-doc" />
      </div>
    );
  }
}

ReactDOM.render(<Demo1 />, document.getElementById('app'));
