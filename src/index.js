import loaderUtils from 'loader-utils';
import fs from 'fs';
import path from 'path';

const template = fs.readFileSync(path.join(__dirname, '..', 'Remarkdown.js'));
const templateStr = template.toString();

const expRegExp = /\$={([\S\s]+?)}/g;
const precodeRegExp = /\`\`\`js-precode[\S\s]+?\`\`\`/g;
const precodeGroupRegExp = /\`\`\`js-precode([\S\s]+?)\`\`\`/g;

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

function parseRemarkSyntax(markdown) {
  return markdown
    .replace(/\${\w+}/g, '<$1 />')
    .replace(/\$={}/g, '$1');
}

const compRegExp = /\${(\w+?)}/g;
const compNGroupRegExp = /\${\w+?}/g;

function combine(rests, inner) {
  let result = rests[0];

  inner.forEach((innerText, i) => {
    result = result + innerText + rests[i + 1];
  });

  return result;
}

// 把 markdown 转化为 React ，属于宏。
function getViewCode(markdown, Demo) {
  // 预处理
  const codeRex = /\`\`\`[\S\s]+?\`\`\`/g;
  const pretreatedCode = markdown.replace(codeRex, match => {
    return match.replace(compRegExp, '$\\{$1}');
  });

  // 对 React 组件语法代码单独处理
  const compCodes = (pretreatedCode.match(compRegExp) || [])
    .map(compExp => {
      return compExp.replace(compRegExp, Demo ? '<Demo demo={$1} />' : '<$1 />\n');
    });

  // 对 markdown 代码单独处理
  const markedCodes = pretreatedCode
    .split(compNGroupRegExp)
    .map(markdownCode => {
      return `<Markdown md={\`${markdownCode.replace(/\`/g, '\\`')}\`} />\n`;
    });

  return combine(markedCodes, compCodes);
}

module.exports = function(markdown) {
  const query = loaderUtils.parseQuery(this.query);
  const { Demo } = query;

  options = {
    ...options,
    ...query,
  };

  this.cacheable && this.cacheable();
  const code = markdown.replace(expRegExp, '${$1}');

  let precode = (code.match(precodeRegExp) || [])
    .map(precode => {
      return precode.replace(precodeGroupRegExp, '$1');
    }).join('\n');

  if (Demo) {
    precode = precode + '\n' + `import Demo from '${Demo}';`;
  }

  const clearedCode = code.replace(precodeRegExp, () => '');
  const viewCode = getViewCode(clearedCode, Demo);

  return templateStr
    .replace(/\${precode}/, precode)
    .replace(/\${viewCode}/, viewCode);
};
