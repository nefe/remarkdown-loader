# remarkdown-loader

With remarkdown-loader, you can render react element in markdown convenient!

[![npm version](https://badge.fury.io/js/remarkdown-loader.png)](https://badge.fury.io/js/remarkdown-loader)
[![build status](https://travis-ci.org/jasonHzq/remarkdown-loader.svg)](https://travis-ci.org/jasonHzq/remarkdown-loader)
[![npm downloads](https://img.shields.io/npm/dt/remarkdown-loader.svg?style=flat-square)](https://www.npmjs.com/package/remarkdown-loader)

## install

```sh
$ npm i -D remarkdown-loader
```

## Usage

### webpack.config.js

```js
'module': {
  'loaders': [{
    'loaders': ['babel', 'remarkdown'],
    'test': /\.md$/,
  }]
}
```

So you can render react element in markdown like this:

<pre>
```js-precode
import Demo from './Demo';
```

current language: $={props.language}

## code:

```js
class Demo extends Component {
  xxx
}
```

## sample

${Demo}
</pre>

### support [babel-plugin-code](https://github.com/jasonHzq/babel-plugin-code)

With babel-plugin-code, you can render the demo and demo source code toghether.

```
'module': {
  'loaders': [{
    // using remarkdown-doc to render react element
    'test': /\.md$/,
    'loader': 'babel!remarkdown?Demo=remarkdown-doc',
  }, {
    // using babel-plugin-code
    test: /\.js$/,
    loader: 'babel',
    query: {
      plugins: [['code']],
    },
  }],
}
```

You can set param Demo to remarkdown-laoder. In this example, it use [remarkdown-doc](https://github.com/jasonHzq/remarkdown-doc) as custom Demo renderer. The result is as below.

![img](https://img.alicdn.com/tps/TB1_QmYLpXXXXbyXpXXXXXXXXXX-1008-504.png)

![img](https://img.alicdn.com/tps/TB15lyFLpXXXXauaXXXXXXXXXXX-592-216.png)


## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2015-2016 Recharts Group
