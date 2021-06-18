# env-hot-reload

### This small lib offers you the ability to edit your .env files without the need to restart the process.

## env-hot-reload is watching your .env for you!
   `process.env.YourVars will auto updated every time you save .env file.`
## QuickStart

- `npm install env-hot-reload` or `yarn add env-hot-reload`
- Include it in your project :
```js
const  envHotReloader = require('env-hot-reload');
new envHotReloader({
    onEnvChange: myFunctToCall, // optionall
    watchInterval: 1500  // optionall default 3500
   }).watch()
```

 ## oR

```js
  const config = {
        onEnvChange: myFunctToCall, // optionall
        watchInterval: 1500  // optionall default 3500
  }
  const monitor = new env-hot-reload(config) 
  monitor.watch();
// user callback function  
function myFunctToCall() {
    // your code to run on .env is updated...
  }
```