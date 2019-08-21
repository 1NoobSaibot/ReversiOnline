'use strict'

class BugCatcher {
  async handle ({ request }, next) {
    console.log('BugCatcher.handle()');
    try {
        await next();
    }
    catch(err){
        console.log(err.message);
        console.dir(err);
    }
  }
}

module.exports = BugCatcher