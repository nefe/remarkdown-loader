```js-precode
import { Demo1, Demo2 } from './Demos';

const title = {
  en: 'this is a test',
  cn: '这是测试',
};

const codeTitle = {
  en: 'It\'s a code',
  cn: '这是代码',
};

const footerTitle = {
  en: 'It\'s a footer',
  cn: '这是底边栏',
};
```

# $={title[props.lang]}

## $={codeTitle[props.lang]}
```js

const data = [{
  a: 'b',
}];

```

## demo1
${Demo1}

## demo2
${Demo2}

## $={footerTitle[props.lang]}
