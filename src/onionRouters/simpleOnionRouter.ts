import express from "express";
import axios from "axios";
import { BASE_ONION_ROUTER_PORT, BASE_USER_PORT } from "../config";

export async function simpleOnionRouter(nodeId: number) {
  const app = express();
  app.use(express.json());

  let lastReceivedEncryptedMessage: string | null = null;
  let lastReceivedDecryptedMessage: string | null = null;
  let lastMessageDestination: number | null = null;

  app.get("/status", (req, res) => {
    res.send("live");
  });

  app.get("/getLastReceivedEncryptedMessage", (req, res) => {
    res.json({ result: lastReceivedEncryptedMessage });
  });

  app.get("/getLastReceivedDecryptedMessage", (req, res) => {
    res.json({ result: lastReceivedDecryptedMessage });
  });

  app.get("/getLastMessageDestination", (req, res) => {
    res.json({ result: lastMessageDestination });
  });

  app.post("/message", async (req, res) => {
    const { message } = req.body;
    lastReceivedEncryptedMessage = message;

    const decryptedLayer = JSON.parse(message);
    const { nextHop, nextMessage } = decryptedLayer;

    if (nextHop) {
      lastMessageDestination = nextHop;
      await axios.post(`http://localhost:${nextHop}/message`, { message: nextMessage });
    } else {
      lastMessageDestination = null;
      await axios.post(`http://localhost:${BASE_USER_PORT}/message`, { message: nextMessage });
    }

    res.status(200).send("Message forwarded.");
  });

  return new Promise((resolve, reject) => {
    const server = app.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
      console.log(`Node ${nodeId} is running on port ${BASE_ONION_ROUTER_PORT + nodeId}`);
      resolve(server);
    });

    server.on("error", (error) => {
      console.error(`Failed to start node ${nodeId}:`, error);
      reject(error);
    });
  });
}