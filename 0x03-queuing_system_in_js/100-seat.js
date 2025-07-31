const kue = require('kue');
const { createClient } = require('redis');
const express = require('express');
const { promisify } = require('util');
const app = express();
const port = 1245;

const client = createClient();
client
  .on('connect', () => {
    console.log("Redis client connected to the server");
    client.set('available_seats', 5, (err, val) => {
      if (err) {
        console.error("Cannot set value:", err);
      }
    });
  })
  .on("error", (err) => {
    console.log('Redis client not connected to the server:', err);
  });
const get = promisify(client.get).bind(client);

let reservationEnabled = true;
const queue = kue.createQueue();

function reserveSeat(number) {
  client.set('available_seats', number, (err, val) => {
    if (err) {
      console.error("Cannot set value:", err);
    }
  });
}

async function getCurrentAvailableSeats() {
  try {
    const res = await get('available_seats');
    return(res);
  } catch (err) {
    throw new Error("there is an error:", err);
  }
}
  

app.get('/available_seats', async (req, res) => {
  try {
    const resp = await getCurrentAvailableSeats();
    res.json({"numberOfAvailableSeats":resp});
  } catch (err) {
    console.error("there is an error", err);
  }
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ "status": "Reservation are blocked" });
  } else {
    const job = queue.create('reserve_seat');
    job
      .save((error) => {
        if (!error) {
          res.json({ "status": "Reservation in process" });
        } else {
          res.json( { "status": "Reservation failed" });
	}
      })
      .on("complete", () => {
        console.log(`Seat reservation job ${job.id} completed`)
      })
      .on("failed", (error) => {
        console.log(` Seat reservation job ${job.id} failed: ${error}`)
      })
  }
});

app.get('/process', async (req, res) => {
  res.json({"status":"Queue processing"});
  queue.process('reserve_seat', 1, async (job, done) => {
    const availableSeat = await getCurrentAvailableSeats();
    console.log(availableSeat)
    if (availableSeat > 0) {
      reserveSeat(availableSeat - 1);
      done();
    } else {
      reservationEnabled = false;
      return(done(new Error('Not enough seats available')));
    }
  });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
