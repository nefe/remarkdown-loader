import loaderUtils from 'loader-utils';
import fs from 'fs';
import path from 'path';

const template = fs.readFileSync(path.join(__dirname, '..', 'Remarkdown.js'));
const templateStr = template.toString();

const expRegExp = /\$={((.|\n)+?)}/g;
const precodeRegExp = /\`\`\`js-precode\n((.|\n)+?)\n\`\`\`/g;

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

const compRegExp = /\${(\w+)}/g;
const compNGroupRegExp = /\${\w+}/g;

// 把 markdown 转化为 React ，属于宏。
function getViewCode(markdown, Demo) {
  // 对 React 组件语法代码单独处理
  const compCodes = markdown.match(compRegExp)
    .map(compExp => {
      return compExp.replace(compRegExp, Demo ? '<Demo demo={$1} />' : '<$1 />');
    });

  // 对 markdown 代码单独处理
  const markedCodes = markdown
    .split(compNGroupRegExp)
    .map(markdownCode => {
      return `<Markdown md={\`${markdownCode.replace(/\`/g, '\\`')}\`} />`;
    });

  return markedCodes.join(compCodes);
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

  let precode = code.match(precodeRegExp).map(precode => {
    return precode.replace(precodeRegExp, '$1');
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
