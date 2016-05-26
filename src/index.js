import loaderUtils from 'loader-utils';
import { transform } from 'babel-core';
import marked from 'marked';
import H from 'highlight.js';

const highlight = (code, lang) => {
  if (lang) {
    return H.highlightAuto(code, [lang]).value;
  }
  return H.highlightAuto(code).value;
};

const opts = {
  presets: [
    require('babel-preset-react'),
    require('babel-preset-es2015'),
    require('babel-preset-stage-0'),
  ],
};

// default option
let options = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
};

let id = 0;

const getResult = docs => {
  return `
import React, { Component, PropTypes } from 'react';

class Markdown extends Component {
  static propTypes = {
    ctx: PropTypes.object,
  };

  componentWillMount() {
    this.id = 0;
    this.fns = [];
  }

  componentDidMount() {
    this.fns.map(item => {
      const [fn, errorId] = item;
      
      try {
        fn();
      } catch (e) {
        this.props.ctx.ReactDOM.render(<span className="error-info">{e.toString()}</span>, document.getElementById(errorId));
      }
    })
  }

  renderCode(doc, text) {
    const { ctx } = this.props;
    const ctxKeys = Object.keys(ctx);
    const ctxVals = ctxKeys.map(key => ctx[key]);
    let errorMsg = '';

    try {
      this.fns.push([
        new Function(...ctxKeys, 'id', text)
          .bind(this, ...ctxVals, 'preview${id}-' + this.id),
        'preview-error${id}-' + this.id,
      ]);
    } catch (e) {
      errorMsg = e.toString();
    }

    return \`
      <div>
        <div class="hljs">\${doc}</div>
        <div id="\${'preview-error${id}-' + this.id}">
          \${ errorMsg && errorMsg }
        </div>
        preview: <div id="\${'preview${id++}-' + this.id++}"></div>
      </div>
    \`;
  }

  render() {
    const __html = ${docs.map(doc => {
      if (Array.isArray(doc)) {
        return 'this.renderCode(`' + doc[0] + '`, `' + transform(doc[1], opts).code + '`)';
      }

      return '`' + doc + '`';
    }).join(' + ')};

    return (
      <div className="remarkdown-container"
        dangerouslySetInnerHTML={{ __html }}
      >
      </div>
    );
  }
}

export default Markdown;
  `;
}

const getDocs = (tokens) => {
  const docs = [];
  let doc = [];
  doc.links = tokens.links;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'code' && token.lang === 'js-react') {
      token.lang = 'js';
      docs.push(doc);
      doc = [token];
      doc.links = tokens.links;

      docs.push([doc, token.text]);
      doc = [];
      doc.links = tokens.links;
    } else {
      doc.push(token);
    }
  }

  if (doc.length) {
    docs.push(doc);
  }

  return docs;
}

module.exports = function(markdown) {
  const query = loaderUtils.parseQuery(this.query);
  const configKey = query.config || "markdownLoader";

  options = {
    ...options,
    ...query,
    ...this.options[configKey],
    highlight,
  };

  this.cacheable();

  marked.setOptions(options);

  const tokens = marked.lexer(markdown, options);

  const docs = getDocs(tokens).map(doc => {
    if (Array.isArray(doc[0])) {
      const [ tokens, text ] = doc;

      return [marked.parser(tokens), text];
    }

    return marked.parser(doc);
  });

  return transform(getResult(docs), opts).code;
};
