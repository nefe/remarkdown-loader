import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Markdown.scss';
import Test from './test.md';

export default class App extends React.Component {
  state = {
    lang: 'en',
  };

  handleChangeLang() {
    const { lang } = this.state;

    if (lang === 'en') {
      this.setState({
        lang: 'cn',
      });
    } else {
      this.setState({
        lang: 'en',
      });
    }
  }

  render() {
    const { lang } = this.state;

    return (
      <div>
        <button onClick={::this.handleChangeLang}>{lang}</button>
        <Test className="test" lang={lang} />
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('app'));
