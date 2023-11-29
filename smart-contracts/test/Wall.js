const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Wall", function () {
  async function deployWallContract() {
    const wallContractFactory = await ethers.getContractFactory("Wall");
    const wallContract = await (await wallContractFactory.deploy()).waitForDeployment();
    return wallContract;
  }

  it("Posting message should work", async function () {
    const wallContract = await deployWallContract();

    const messageToPost = "Hello from the otter side!";
    const tx = await wallContract.postMessage(messageToPost);
    const rcpt = await tx.wait();

    expect(rcpt?.logs[0]?.args[0][0]).eq(messageToPost);
  });

  it("Retrieving messages should work", async function() {
    const wallContract = await deployWallContract();

    await (await wallContract.postMessage("Never gonna give you up")).wait();
    await (await wallContract.postMessage("Never gonna let you down")).wait();
    await (await wallContract.postMessage("Never gonna run around and desert you")).wait();

    const messagesPosted = await wallContract.getAllPostedMessages();
    expect(messagesPosted.length).eq(3);
  });
});
