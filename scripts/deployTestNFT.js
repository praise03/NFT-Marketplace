const { run, network } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const TestNft = await ethers.getContractFactory("TestNft");
    const testNft = await TestNft.deploy();
    await testNft.deployed();
    await testNft.deployTransaction.wait(6)

  
    console.log("TestNFT Contract deployed at: ", testNft.address);

    if(!["hardhat", "localhost"].includes(network.name) && (process.env.ETHERSCAN_API_KEY)){
        console.log("Verifying contract.....")
        try{
            await run("verify:verify", {
                address: testNft.address,
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

