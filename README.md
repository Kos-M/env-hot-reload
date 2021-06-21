# env-hot-reload

[![npm version](https://img.shields.io/npm/v/env-hot-reload.svg?style=flat)](https://www.npmjs.com/package/env-hot-reload)
[![npm downloads](https://img.shields.io/npm/dm/env-hot-reload.svg?style=flat)](https://www.npmjs.com/package/env-hot-reload)
[![GitHub issues](https://img.shields.io/github/issues/Kos-M/env-hot-reload.svg?style=flat)](https://github.com/Kos-M/env-hot-reload/issues)

### This small lib offers you the ability to edit your .env files without the need to restart the process.

## env-hot-reload is watching your .env for you!
   `process.env.YourVars will auto updated every time you save .env file.`

<img src="https://raw.githubusercontent.com/Kos-M/env-hot-reload/master/examples/demo.svg">

## QuickStart

- `npm install env-hot-reload` or `yarn add env-hot-reload`
- Include it in your project :
```js
const  envHotReloader = require('env-hot-reload');
new envHotReloader({
    onEnvChange: myFunctToCall, // optionall callback function runs on every .env update
    watchInterval: 1500  // optionall default 3500
   }).watch()

function myFunctToCall() {
    // your code to run on .env is updated...
  }
```

 ## oR

```js
const  envHotReloader = require('env-hot-reload');
  const config = {
        onEnvChange: myFunctToCall, // optionall callback Function runs on every .env update
        watchInterval: 1500  // optionall default 3500
  }
  const monitor = new envHotReloader(config) 
  monitor.watch();

function myFunctToCall() {
    // your code to run when .env is updated...
  }
```