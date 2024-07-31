#!/usr/bin/node

import kue from "kue";

/**
 * createPushNotificationsJobs - Create a queue and push a job to it
 * @param {Array<Object>} jobs - Number of jobs
 * @param {Function} queue - Queue
 */
const createPushNotificationsJobs = (jobs, queue) => {
  if (!Array.isArray(jobs)) throw new Error("Jobs is not an array");
  for (const jobData of jobs) {
    const job = queue
      .create("push_notification_code_3", jobData)
      .save((err) => {
        if (err) {
          console.log(`Failed to create notification job: ${err}`);
        } else {
          // Move the logging inside the callback
          console.log(`Notification job created: ${job.id}`);

          job.on("complete", () => {
            console.log(`Notification job ${job.id} completed`);
          });

          job.on("failed", () => {
            console.log(`Notification job ${job.id} failed`);
          });

          job.on("progress", (progress) => {
            console.log(`Notification job ${job.id} ${progress}% complete`);
          });
        }
      });
  }
};

export { createPushNotificationsJobs };
