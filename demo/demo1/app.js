import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Test from './test.md';

class Demo extends Component {
  render() {
    return (
      <div>
        <div className="header">example</div>
        <Test className="test" />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('app'));
