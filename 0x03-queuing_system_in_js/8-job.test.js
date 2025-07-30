import kue from 'kue';
import { expect } from 'chai';
import createPushNotificationsJobs from './8-job.js';

let queue = kue.createQueue();

describe("createPushNotificationsJobs", () => {
  before(() => {
    queue.testMode.enter(true);
  });

  afterEach(() => {
    queue.testMode.clear();
  });

  after(() => {
    queue.testMode.exit();
  });

  it('should throw an error if jobs is not a list', () => {
    expect(() => createPushNotificationsJobs(null, queue)).to.throw('Jobs is not an array');
  });


  it('should create a push_notification_code_3 job with correct data', (done) => {
    const jobs = [
      {'phoneNumber': '1234567', 'message': 'Hello world'},
      {'phoneNumber': '9876543', 'message': 'Hello world'}
    ];
    createPushNotificationsJobs(jobs, queue);
    expect(queue.testMode.jobs.length).to.equal(2);
    const createdJob = queue.testMode.jobs[0];
    expect(createdJob.type).to.equal('push_notification_code_3');
    expect(createdJob.data).to.equal(jobs[0]);
    done();
  });

});
