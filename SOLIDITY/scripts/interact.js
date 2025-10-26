import hre from "hardhat";

async function main() {
  console.log("🧠 Interactuando con el contrato HistoChain...");

  const [owner] = await hre.ethers.getSigners();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // dirección desplegada

  const HistoChain = await hre.ethers.getContractFactory("HistoChain");
  const contract = await HistoChain.attach(contractAddress);

  console.log("📄 Creando un historial...");

  // Crear un historial
  const tx = await contract.createRecord("Qm123FakeIpfsHash");
  await tx.wait();
  console.log("✅ Historial creado con éxito!");

  // Recuperar el historial creado (tokenId = 1)
  const record = await contract.getRecord(1);

  console.log("📚 Historial recuperado:");
  console.log(`   IPFS Hash: ${record.ipfsHash}`);
  console.log(`   Paciente: ${record.patient}`);
  console.log(`   Fecha: ${new Date().toLocaleString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
