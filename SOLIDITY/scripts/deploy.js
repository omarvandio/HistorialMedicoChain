import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🚀 Desplegando el contrato HistoChain...");

  const HistoChain = await ethers.getContractFactory("HistoChain");
  const histoChain = await HistoChain.deploy();

  await histoChain.waitForDeployment();

  console.log(`✅ Contrato desplegado en: ${await histoChain.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
