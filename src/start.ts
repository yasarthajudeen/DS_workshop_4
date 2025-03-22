import { launchNetwork } from ".";

async function main() {
  try {
    const nbNodes = parseInt(process.env.NB_NODES || "10", 10);
    const nbUsers = parseInt(process.env.NB_USERS || "2", 10);

    if (isNaN(nbNodes) || isNaN(nbUsers)) {
      throw new Error("Invalid number of nodes or users. Please check your configuration.");
    }

    console.log(`Launching network with ${nbNodes} node(s) and ${nbUsers} user(s)...`);
    await launchNetwork(nbNodes, nbUsers);
  } catch (error) {
    console.error("Failed to start the onion routing network:", error);
    process.exit(1);
  }
}

main();