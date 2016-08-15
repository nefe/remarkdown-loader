# remarkdown-loader

[![npm version](https://badge.fury.io/js/remarkdown-loader.png)](https://badge.fury.io/js/remarkdown-loader)
[![build status](https://travis-ci.org/recharts/remarkdown-loader.svg)](https://travis-ci.org/jasonHzq/remarkdown-loader)
[![npm downloads](https://img.shields.io/npm/dt/remarkdown-loader.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-recharts)

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

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2015-2016 Recharts Group
