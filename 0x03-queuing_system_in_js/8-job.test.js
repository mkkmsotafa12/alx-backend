#!/usr/bin/node

import kue from "kue";
import chai from "chai";
import { createPushNotificationsJobs } from "./8-job";

const expect = chai.expect;

describe("createPushNotificationsJobs", function () {
  let queue;

  before(function () {
    // Create a queue and enable test mode
    queue = kue.createQueue();
    queue.testMode.enter();
  });

  after(function () {
    // Exit test mode and clear the queue
    queue.testMode.exit();
    queue.testMode.clear();
  });

  it("should throw an error if jobs is not an array", function (done) {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw(
      Error,
      "Jobs is not an array"
    );
    done();
  });

  it("should create and process jobs", function (done) {
    const jobs = [
      { id: 1, title: "Job 1", message: "First job" },
      { id: 2, title: "Job 2", message: "Second job" },
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].type).to.equal("push_notification_code_3");
    expect(queue.testMode.jobs[0].data).to.deep.equal(jobs[0]);
    expect(queue.testMode.jobs[1].type).to.equal("push_notification_code_3");
    expect(queue.testMode.jobs[1].data).to.deep.equal(jobs[1]);

    done();
  });
});
