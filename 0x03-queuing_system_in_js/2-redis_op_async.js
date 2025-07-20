const {createClient, print} = require('redis')
const {promisify} = require('util')

const client = createClient();

client
  .on('connect', () => {
    console.log("Redis client connected to the server")
  })
  .on("error", (err) => {
    console.log('Redis client not connected to the server:', err);
  })

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

const get = promisify(client.get).bind(client);

async function displaySchoolValue(schoolName) {
  try {
    const res = await get(schoolName)
    console.log(res);
  } catch(err) {
      console.error(err);
      return;
   }
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
