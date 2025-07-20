const {createClient, print} = require('redis')
const client = createClient();

client
  .on('connect', () => {
    console.log("Redis client connected to the server")
  })
  .on("error", (err) => {
    console.log('Redis client not connected to the server:', err);
  })

const qName = "holberton school channel";

function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    client.publish(qName, message);
  }, time);
}

client.on('ready', () => {
  publishMessage("Holberton Student #1 starts course", 100);
  publishMessage("Holberton Student #2 starts course", 200);
  publishMessage("KILL_SERVER", 300);
  publishMessage("Holberton Student #3 starts course", 400);
  publishMessage("Holberton Student #4 starts course", 500);
})
