const { API_KEY, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

// Our contract ABI (Application Binary Interface) is the interface to interact with our smart contract.
// Hardhat automatically generates an ABI for us and saves it in the HelloWorld.json file.
const contract = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");

// In order to interact with our contract we need to create an instance of it in our code. 
// To do so with Ethers.js, we'll need to work with three concepts:
//   1. Provider - this is a node provider that gives you read and write access to the blockchain.
//   2. Signer - this represents an Ethereum account that has the ability to sign transactions.
//   3. Contract - this is an Ethers.js object that represents a specific contract deployed on-chain.

// Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", API_KEY);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// Contract
const helloWorldContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
  // It should be 'Hello World!' since in the deploy.js file we did: 
  //   await HelloWorld.deploy("Hello World!");
  const message = await helloWorldContract.message();
  console.log("The message is: " + message);

  console.log("Updating the message...");
  const tx = await helloWorldContract.update("This is the new message.");
  // Note that we make a call to .wait() on the returned transaction object. 
  // This ensures that our script waits for the transaction to be mined on the blockchain before proceeding onwards.
  // If you were to leave this line out, your script may not be able to see the updated message value in your contract.
  await tx.wait();

  const newMessage = await helloWorldContract.message();
  console.log("The new message is: " + newMessage);
}

main();