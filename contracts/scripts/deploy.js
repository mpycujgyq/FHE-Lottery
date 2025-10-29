const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🎰 Deploying FHE Lottery Contract...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy FHELottery
  console.log("Deploying FHELottery...");
  const FHELottery = await hre.ethers.getContractFactory("FHELottery");
  const lottery = await FHELottery.deploy();
  await lottery.waitForDeployment();
  const lotteryAddress = await lottery.getAddress();
  console.log("✅ FHELottery deployed to:", lotteryAddress);

  // Create first round
  console.log("\n🎲 Creating first lottery round...");
  const ticketPrice = hre.ethers.parseEther("0.01"); // 0.01 ETH per ticket
  const roundName = "Grand Opening - Round 1";

  const tx = await lottery.createRound(roundName, ticketPrice);
  await tx.wait();

  const roundsCount = await lottery.roundsCount();
  console.log("✅ First round created!");
  console.log("Round ID:", Number(roundsCount) - 1);
  console.log("Round Name:", roundName);
  console.log("Ticket Price:", hre.ethers.formatEther(ticketPrice), "ETH");

  const round = await lottery.getRound(0);
  const endDate = new Date(Number(round.endTime) * 1000);
  console.log("📅 Round ends at:", endDate.toLocaleString());
  console.log("⏰ Duration: 15 days");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    FHELottery: lotteryAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    firstRound: {
      id: 0,
      name: roundName,
      ticketPrice: ticketPrice.toString(),
      startTime: Number(round.startTime),
      endTime: Number(round.endTime),
      endDate: endDate.toISOString()
    }
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `${hre.network.name}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📋 === Deployment Summary ===");
  console.log("Network:", hre.network.name);
  console.log("FHELottery:", lotteryAddress);
  console.log("Deployer:", deployer.address);
  console.log("First Round ID:", 0);
  console.log("Round Ends:", endDate.toLocaleString());
  console.log(`\n💾 Deployment saved to: deployments/${filename}`);

  console.log("\n📝 Next steps:");
  console.log(`1. Update frontend .env with:`);
  console.log(`   VITE_CONTRACT_ADDRESS=${lotteryAddress}`);
  console.log(`2. Start frontend: cd .. && npm run dev`);
  console.log(`3. Buy encrypted lottery tickets!`);
  console.log(`4. After 15 days, admin can draw winning numbers`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
