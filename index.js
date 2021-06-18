const dotenv = require('dotenv');
const fs = require('fs');
const watchFile = fs.watchFile

class envHotReloader {
    constructor({ onEnvChange  , watchInterval }){
        this.watchInterval = watchInterval || 3500; //3.5 sec
        this.userExtraCB = onEnvChange || null
        this.onChange = this.onChange.bind(this)
        dotenv.config()

    }

    watch() {
      this.AppendWarning()
      watchFile(process.cwd()+ '/.env',{interval:this.watchInterval},   this.onChange );
     }

    onChange(curr , prev){
    const result = dotenv.config()
    if (result.error) {
        throw result.error
    }
    const keys = Object.keys(result.parsed)
           keys.forEach(x => {
            let val = result.parsed[x]
            console.log(`${x}:\x1b[32m${result.parsed[x]}\x1b[0m`)
            process.env[x] = val
        });
      console.log('.env reloaded!')
      if (typeof this.userExtraCB === 'function'){
          this.userExtraCB.call(this)
      }
    }

    AppendWarning(){
        fs.readFile( __dirname+ '/warn.txt' , 'utf-8' , function(err,warnMesg){
        fs.readFile(process.cwd() +'/.env' , 'utf-8' , function(err2,userEnv){
        const Env = warnMesg + '\r\n' + userEnv;
        const warnMesglines = warnMesg.split(/\r?\n/) 
        const userEnvlines = userEnv.split(/\r?\n/) 
        if (warnMesglines[0] === userEnvlines[0]) return
        console.warn(warnMesg);
        fs.writeFile(process.cwd() +'/.env' , Env , function(){});        
       })
   })
    }

}
module.exports = envHotReloader



























// const onChange = (curr, prev) => {
//     // console.log(`the current mtime is: ${curr.mtime}`);
//     // console.log(`the previous mtime was: ${prev.mtime}`);
//     result = dotenv.config()
//     if (result.error) {
//         throw result.error
//     }
//     // console.log(result)
//     const keys = Object.keys(result.parsed)
//     // const values = Object.values(result.parsed)
//         keys.forEach(x => {
//             let val = result.parsed[x]
//             console.log(`${x}:${result.parsed[x]}`)
//             process.env[x] = val
//         });
//         // console.log('chaned var: ',process.env.var1)
// }


// function watch({ interv = 5000}) {
//     watchFile(process.cwd()+ '/.env',{interval:interv},   onChange.bind(this) );
    
//     return onChange
// }
// // console.log(process.env.var1)



// module.exports.watch =   watch 