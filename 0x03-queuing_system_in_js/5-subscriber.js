const {createClient, print} = require('redis')
const client = createClient();

const qName = "holberton school channel";
client
  .on('connect', () => {
    console.log("Redis client connected to the server")
    client.subscribe(qName)
  })
  .on("error", (err) => {
    console.log('Redis client not connected to the server:', err);
  })
  .on("message", (channel, message) => {
    console.log(message);
    if (message === 'KILL_SERVER') {
      client.unsubscribe(qName);
      client.quit();
    }
  })
