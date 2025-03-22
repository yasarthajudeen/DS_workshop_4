import express from "express";
import axios from "axios";
import { BASE_USER_PORT, BASE_ONION_ROUTER_PORT } from "../config";

export async function user(userId: number) {
  const app = express();
  app.use(express.json());

  let lastReceivedMessage: string | null = null;
  let lastSentMessage: string | null = null;

  app.get("/status", (req, res) => {
    res.send("live");
  });

  app.get("/getLastReceivedMessage", (req, res) => {
    res.json({ result: lastReceivedMessage });
  });

  app.get("/getLastSentMessage", (req, res) => {
    res.json({ result: lastSentMessage });
  });

  app.post("/message", (req, res) => {
    const { message } = req.body;
    lastReceivedMessage = message;
    res.status(200).send("success");
  });

  app.post("/sendMessage", async (req, res) => {
    const { message, destinationUserId } = req.body;
    lastSentMessage = message;

    const entryNodePort = BASE_ONION_ROUTER_PORT + 0;
    await axios.post(`http://localhost:${entryNodePort}/message`, { message });

    res.status(200).send("Message sent successfully");
  });

  return new Promise((resolve, reject) => {
    const server = app.listen(BASE_USER_PORT + userId, () => {
      console.log(`User ${userId} is running on port ${BASE_USER_PORT + userId}`);
      resolve(server);
    });

    server.on("error", (error) => {
      console.error(`Failed to start user ${userId}:`, error);
      reject(error);
    });
  });
}