/**
 * Deploy Escrow Smart Contract to TON Network
 * 
 * This script helps deploy the escrow contract.
 * Make sure you have the contract compiled first.
 */

require('dotenv').config();

async function deployContract() {
  console.log('Escrow Contract Deployment Script');
  console.log('==================================\n');

  console.log('Prerequisites:');
  console.log('1. Compile the contract: contracts/escrow.fc');
  console.log('2. Have a TON wallet with funds for deployment');
  console.log('3. Set TON_NETWORK in .env (testnet or mainnet)\n');

  console.log('Deployment Steps:');
  console.log('1. Use TON compiler (func) to compile escrow.fc');
  console.log('2. Use TON CLI or SDK to deploy the compiled contract');
  console.log('3. Save the deployed contract address to .env as ESCROW_CONTRACT_ADDRESS\n');

  console.log('Example using ton-compiler:');
  console.log('  npm install -g ton-compiler');
  console.log('  func -o escrow.fif -SPA contracts/escrow.fc');
  console.log('  fift -s build-and-deploy.fif\n');

  console.log('For detailed instructions, see: docs/DEPLOYMENT.md');
}

deployContract().catch(console.error);
