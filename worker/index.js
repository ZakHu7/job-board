var CronJob = require('cron').CronJob;
const fetchGithub = require('./tasks/fetch-github');
const 

var job = new CronJob('*/1 * * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');


job.start();