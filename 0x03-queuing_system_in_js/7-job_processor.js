import { createQueue } from "kue";
/* module for jobs processors */

const queue = createQueue();
const blacklisted = ["4153518780", "4153518781"];

const sendNotification = (phoneNumber, message, job, done) => {
  let progress = 0;
  if (blacklisted.includes(phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );

  function next(progress) {
    job.progress(progress, 50);
    if (progress == 25) {
      done();
    } else {
      next(progress + 25);
    }
  }
  next(progress);
};

queue.process("push_notification_code_2", 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
