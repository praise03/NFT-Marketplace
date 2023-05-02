const { run, network } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const _NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const NFTMarketplace = await _NFTMarketplace.deploy();
    await NFTMarketplace.deployed();
    await NFTMarketplace.deployTransaction.wait(6)

  
    console.log("NFTMarketplace Contract deployed at: ", NFTMarketplace.address);

    if(!["hardhat", "localhost"].includes(network.name) && (process.env.ETHERSCAN_API_KEY)){
        console.log("Verifying contract.....")
        try{
            await run("verify:verify", {
                address: NFTMarketplace.address,
            })
        }catch (e) {
        if (e.message.toLowerCase().includes("already verified")){
            console.log("Contract Already Verified")
        }else{ console.log(e) }
        }
    }
}
  
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

