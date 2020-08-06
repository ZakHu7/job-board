const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");
// const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
var fetch = require('node-fetch');



const baseURL = "https://jobs.github.com/positions.json"

async function fetchGithub() {
  let resultCount = 1, onPage = 0;
  const allJobs = [];

  //fetch all jobs
  while (resultCount > 0) {
    const res = await fetch(`${baseURL}?page=${onPage}`);
    const jobs = await res.json();
    resultCount = jobs.length;
    allJobs.push(...jobs);
    console.log(`got ${jobs.length} jobs`);
    onPage++;
  }

  //filter jobs
  const jrJobs = allJobs.filter(job => {
    const jobTitle = job.title.toLowerCase();

    if (jobTitle.includes("senior") || jobTitle.includes("sr.")) {
      return false;
    }

    return true;
  })

  console.log(`got ${allJobs.length} jobs`);
  console.log(`number of junior jobs: ${jrJobs.length}`);

  const success = await setAsync('github', JSON.stringify(jrJobs)); // Save to redis

  console.log(success);
}

//fetchGithub();

module.exports = fetchGithub;