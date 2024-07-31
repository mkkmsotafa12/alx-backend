import { createClient, print } from "redis";
/* module to connect */

/* connecting to server and listen to connection */
const client = createClient();
client.on("connect", () => {
  console.log("Redis client connected to the server");
});

/* handling errors while connecting */
client.on("error", (err) => {
  console.log(`Redis client not connected to the server: ${err.toString()}`);
});

/* channel to subscribe to */
const channel = "holberton school channel";
client.subscribe(channel);

/* handling receiving a message */
client.on("message", (channel, message) => {
  if (message === "KILL_SERVER") {
    client.unsubscribe(channel);
    client.quit();
  } else {
    console.log(message);
  }
});
