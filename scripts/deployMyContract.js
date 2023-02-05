async function main() {
    const MyContract = await ethers.getContractFactory("digestHash");
    const myContract = await MyContract.deploy("");
  
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });