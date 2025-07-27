const kue = require('kue');
const queue = kue.createQueue();

const data = {
               phoneNumber: "1234567",
	       message: "Hello friend"
	     };

const job = queue.create('push_notification_code', data)
  .save((error) => {
    if (error) {
      console.log('Notification job failed');
      return;
    }
    console.log(`Notification job created: ${job.id}`);
  });
