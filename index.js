const dotenv = require('dotenv');
const fs = require('fs');

const { watchFile } = fs;

class envHotReloader {
  constructor({ onEnvChange, watchInterval }) {
    this.watchInterval = watchInterval || 3500; // 3.5 seconds
    this.userExtraCB = onEnvChange || null;
    this.onChange = this.onChange.bind(this);
    dotenv.config()
  }

  watch() {
    this.AppendWarning();
    watchFile(`${process.cwd()}/.env`, { interval: this.watchInterval }, this.onChange);
  }

  onChange(curr, prev) {
    const result = dotenv.config();
    if (result.error) {
      console.error(`env-hot-reload: ${result.error.message}`);
      return;
    }
    const keys = Object.keys(result.parsed);
    keys.forEach((x) => {
      const val = result.parsed[x];
      console.log(`${x}:\x1b[32m${result.parsed[x]}\x1b[0m`);
      process.env[x] = val;
    });
    console.log('.env reloaded!');
    if (typeof this.userExtraCB === 'function') {
      this.userExtraCB.call(this);
    }
  }

  AppendWarning() {
    try {
      fs.readFile(`${__dirname}/warn.txt`, 'utf-8', (err, warnMesg) => {
        fs.readFile(`${process.cwd()}/.env`, 'utf-8', (err2, userEnv) => {
          const Env = `${warnMesg}\r\n${userEnv}`;
          if (err2) {
            console.error(`env-hot-reload: ${err2.message}`);
            return;
          }
          const warnMesglines = warnMesg.split(/\r?\n/);
          const userEnvlines = userEnv.split(/\r?\n/);
          if (warnMesglines[0] === userEnvlines[0]) return;
          console.warn(warnMesg);
          fs.writeFile(`${process.cwd()}/.env`, Env, () => {});
        });
      });
    } catch (e) {
      console.log(e.message);
    }
  }
}
module.exports = envHotReloader;
