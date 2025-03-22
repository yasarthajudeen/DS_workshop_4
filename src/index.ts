import { launchOnionRouters } from "./onionRouters/launchOnionRouters";
import { launchRegistry } from "./registry/registry";
import { launchUsers } from "./users/launchUsers";
import { Server } from "http";

export async function launchNetwork(
  nbNodes: number,
  nbUsers: number
): Promise<Server[]> {
  try {
    console.log("Launching the onion routing network...");

    // Launch the registry
    const registry = await launchRegistry();
    console.log("Registry launched successfully.");

    // Launch onion routers
    const onionServers = await launchOnionRouters(nbNodes);
    console.log(`${nbNodes} onion router(s) launched successfully.`);

    // Launch users
    const userServers = await launchUsers(nbUsers);
    console.log(`${nbUsers} user(s) launched successfully.`);

    console.log("Onion routing network launched successfully.");

    // Ensure all elements are of type `Server`
    return [registry as Server, ...onionServers, ...userServers];
  } catch (error) {
    console.error("Failed to launch the onion routing network:", error);
    throw error;
  }
}