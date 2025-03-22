import express from "express";
import { REGISTRY_PORT } from "../config";

export type Node = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = { nodes: Node[] };

const _registry = express();
_registry.use(express.json());

const nodes: Node[] = [];

_registry.get("/status", (req, res) => {
  res.send("live");
});

_registry.post("/registerNode", (req, res) => {
  const { nodeId, pubKey }: Node = req.body;

  if (!nodeId || !pubKey) {
    return res.status(400).send("Invalid request body");
  }

  nodes.push({ nodeId, pubKey });
  console.log(`Node ${nodeId} registered with public key: ${pubKey}`);
  return res.status(200).send("Node registered successfully.");
});

_registry.get("/getNodeRegistry", (req, res) => {
  res.json({ nodes });
});

export async function launchRegistry() {
  return new Promise((resolve, reject) => {
    const server = _registry.listen(REGISTRY_PORT, () => {
      console.log(`Registry is listening on port ${REGISTRY_PORT}`);
      resolve(server);
    });

    server.on("error", (error) => {
      console.error(`Failed to start registry:`, error);
      reject(error);
    });
  });
}