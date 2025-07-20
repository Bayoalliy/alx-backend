const {createClient, print} = require('redis')
const client = createClient();

client
  .on('connect', () => {
    console.log("Redis client connected to the server")
  })
  .on("error", (err) => {
    console.log('Redis client not connected to the server:', err);
  })

const dic = {
   Portland: '50',
   Seattle: '80',
   'New York': '20',
   Bogota: '20',
   Cali: '40',
   Paris: '2'
  }

for(const [key, val] of Object.entries(dic)) {
  client.hset('HolbertonSchools', key, val, print);
}

client.hgetall('HolbertonSchools', (err, val) => {
  if (val) {
	  console.log(val)
  }
})
