import loaderUtils from 'loader-utils';
import marked from 'marked';
import H from 'highlight.js';
import fs from 'fs';
import path from 'path';

const template = fs.readFileSync(path.join(__dirname, '..', 'ReMarkdown.template'));
const templateStr = template.toString();

const highlight = (code, lang) => {
  if (lang) {
    return H.highlightAuto(code, [lang]).value;
  }
  return H.highlightAuto(code).value;
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

const getPrecode = (tokens) => {
  return tokens.filter(token => {
    const { type, lang } = token;

    return type === 'code' && lang === 'js-precode';
  }).map(token => {
    const { text } = token;

    return text;
  }).join('\n');
}

function pushLastItem(arr, tk) {
  const length = arr.length;

  if (!length) {
    return [[tk]];
  }

  const lastItem = arr[length -1];

  if (typeof lastItem === 'string') {
    return [...arr, [tk]];
  }

  return [...arr.slice(0, length -1), [...lastItem, tk]];
}

const getRestTokens = (tokens) => {
  const links = tokens.links;

  const restTokens = tokens.filter(token => {
    const { type, lang } = token;

    if (!type) {
      return false;
    }

    if (type === 'code' && lang === 'js-precode') {
      return false;
    }

    return true;
  }).map(token => {
    const { type, text } = token;
    const reactRegexp = /\${(\w+)}/;

    if (reactRegexp.test(text)) {
      // react type token return a string
      return text.replace(reactRegexp, '$1');
    }

    return token;
  });

  return restTokens.reduce((result, token) => {
    if (typeof token !== 'string') {
      return pushLastItem(result, token);
    }

    return [...result, token];
  }, []);
}

module.exports = function(markdown) {
  const query = loaderUtils.parseQuery(this.query);
  const { Demo } = query;

  options = {
    ...options,
    ...query,
    highlight,
  };

  this.cacheable && this.cacheable();

  marked.setOptions(options);

  const tokens = marked.lexer(markdown, options);
  const preCode = getPrecode(tokens);
  const restTokens = getRestTokens(tokens);

  const markdowns = restTokens.map(token => {
    if (Array.isArray(token)) {
      token.links = tokens.links;

      return `<div className="remarkdown-container" dangerouslySetInnerHTML={{ __html: \`${marked.parser(token)}\` }}></div>`;
    }

    if (typeof token === 'string') {
      // react type token, token is the react class
      if (Demo) {
        // return custom type
        return `<Demo demo={${token}} />`;
      }

      return `<${token} />`;
    }

    return '';
  });

  const parsedMarkdown = markdowns.join('\n');
  let currTemplateStr = templateStr;

  if (Demo) {
    currTemplateStr = `import Demo from '${Demo}';\n${currTemplateStr}`;
  }

  const result = currTemplateStr
    .replace(/\${(preCode)}/g, preCode)
    .replace(/\${(markdown)}/g, parsedMarkdown);
  console.log(result);
  return result;
};
