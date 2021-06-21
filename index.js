const dotenv = require('dotenv');
const fs = require('fs');

const { watchFile } = fs;
const crypto = require('crypto');

class envHotReloader {
  constructor({ onEnvChange, watchInterval }) {
    this.watchInterval = watchInterval || 3500; // 3.5 seconds
    this.userExtraCB = onEnvChange || null;
    this.quiet = false; // TODO : give user choise to load it from config , a silent mode
    this.envContents = envHotReloader.initParseEnv(); // array of init user env variables
    this.onChange = this.onChange.bind(this);
  }

  logger(out) {
    if (!this.quiet) console.log(`[env-hot-reload] ${out}`);
  }

  static initParseEnv() {
    const UserEnv = [];
    const result = dotenv.config();
    if (result.error) {
      console.error(`env-hot-reload: ${result.error.message}`);
      return UserEnv;
    }
    const parsedKeys = Object.keys(result.parsed);
    const values = Object.values(result.parsed);
    parsedKeys.forEach((key, index) => {
      const md5sum = crypto.createHash('md5').update(`${key}::${values[index]}`).digest('hex');
      UserEnv.push({
        key, // key env var
        hash: md5sum, // hash in format variable::Value
      });
    });
    return UserEnv;
  }

  watch() {
    envHotReloader.AppendWarning();
    watchFile(`${process.cwd()}/.env`, { interval: this.watchInterval }, this.onChange);
  }

  onChange(curr, prev) {
    const result = dotenv.config();
    if (result.error) {
      console.error(`env-hot-reload: ${result.error.message}`);
      return;
    }
    const parsedKeys = Object.keys(result.parsed);
    let isNew = false;
    parsedKeys.forEach((parsedKey) => {
      const parsedVal = result.parsed[parsedKey];
      process.env[parsedKey] = parsedVal; // update process.env
      let cached = this.envContents.filter((inCache) => inCache.key === parsedKey)[0];
      const parsedMd5sum = crypto.createHash('md5').update(`${parsedKey}::${parsedVal}`).digest('hex');
      if (cached === undefined) { // we have new variable in env here
        isNew = true;
        cached = {
          key: parsedKey, // key env var
          hash: parsedMd5sum, // hash in format variable::Value
        };
        this.envContents.push(cached); // cache it
        cached.hash = null; // just to run code bellow
      }
      if (cached.hash !== parsedMd5sum) { // value of var has changed
        // update our chached values with new ones
        const changedIndex = this.envContents.findIndex((obj) => obj.key === parsedKey);
        this.envContents[changedIndex].hash = parsedMd5sum; // update new hash (only value changed)
        if (isNew) this.logger(`\x1b[32m+ \x1b[0mAdded Environment Variable \x1b[32m${parsedKey}=${parsedVal}\x1b[0m`);
        else this.logger(`\x1b[32m+\x1b[0m/\x1b[34m- \x1b[0mModified Environment Variable \x1b[33m${parsedKey}=\x1b[32m${parsedVal}\x1b[0m`);
      }
      isNew = false;
    });

    if (parsedKeys.length < this.envContents.length) { // env var removed
      const toRemove = [];
      this.envContents.forEach((cached) => {
        const ans = parsedKeys.filter((parsed) => cached.key === parsed)[0];
        if (ans === undefined) toRemove.push(cached.key);
      });
      toRemove.forEach((toRemoveKey) => {
        this.envContents = this.envContents.filter((casItem) => casItem.key !== toRemoveKey);
        delete process.env[toRemoveKey];
        this.logger(`\x1b[34m- \x1b[0mRemoved Environment Variable \x1b[34m${toRemoveKey}\x1b[0m`);
      });
    }
    if (typeof this.userExtraCB === 'function') this.userExtraCB.call(this);
  }

  static AppendWarning() {
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
          fs.writeFile(`${process.cwd()}/.env`, Env, () => {});
        });
      });
    } catch (e) {
      this.logger(e.message);
    }
  }
}
module.exports = envHotReloader;
