import { ethers } from "ethers";
import { L3Config } from "./l3ConfigType";
import dotenv from 'dotenv';

dotenv.config();
import fs from 'fs';

async function main() {
    // Read the environment variables
    const privateKey = process.env.PRIVATE_KEY;
    const L2_RPC_URL = process.env.L2_RPC_URL;
    const L3_RPC_URL = process.env.L3_RPC_URL;

    if (!privateKey || !L2_RPC_URL || !L3_RPC_URL) {
        throw new Error('Required environment variable not found');
    }

    // Read the JSON configuration
    const configRaw = fs.readFileSync('./config/config.json', 'utf-8');
    const config: L3Config = JSON.parse(configRaw);

    // Generating providers from RPCs
    const L2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL);
    const L3Provider = new ethers.providers.JsonRpcProvider(L3_RPC_URL);
   
    // Creating the signer
    const signer = new ethers.Wallet(privateKey).connect(L2Provider);
    
    // Funding staker and batch-poster wallets:
    // Transfer 1 Ether to the batchPoster address
    const tx1 = await signer.sendTransaction({
        to: config.batchPoster,
        value: ethers.utils.parseEther("0.01")
    });

    console.log(`Transaction hash: ${tx1.hash}`);
    const receipt1 = await tx1.wait();
    console.log(`Transaction was mined in block ${receipt1.blockNumber}`);

    // Transfer 1 Ether to the staker address
    const tx2 = await signer.sendTransaction({
        to: config.staker,
        value: ethers.utils.parseEther("0.01")
    });

    console.log(`Transaction hash: ${tx2.hash}`);
    const receipt2 = await tx2.wait();
    console.log(`Transaction was mined in block ${receipt2.blockNumber}`);

    ////////////////////////////////
    /// Token Bridge Deployment ///
    //////////////////////////////


    ////////////////////////////////
    /// L3 Chain Configuration ///
    //////////////////////////////

    }

// Run the script
main().catch((error) => {
    console.error(error);
    process.exit(1);
});