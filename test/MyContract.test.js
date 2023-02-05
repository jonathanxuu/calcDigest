const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyContract", () => {
  // https://github.com/zCloak-Network/zkid-sdk/blob/master/packages/vc/src/digest.spec.ts#L14
  it("should generate the ideal digestHash as in the sdk, without expirationDate", async () => {
  
    const MyContract = await ethers.getContractFactory("digestHash");
    const myContract = await MyContract.deploy();

    await myContract.deployed();
    expect(await myContract.calcDigestHash("did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51","0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97","0x00","0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a")).to.equal("0x358c172298da91c7736df58b30ddc87fcec1ff13f85bcfd60f0ef4d54a12c419");
  });
 
    // https://github.com/zCloak-Network/zkid-sdk/blob/master/packages/vc/src/digest.spec.ts#L28
    it("should generate the ideal digestHash as in the sdk, with the expirationDate", async () => {
  
      const MyContract = await ethers.getContractFactory("digestHash");
      const myContract = await MyContract.deploy();
  
      await myContract.deployed();
      expect(await myContract.calcDigestHash("did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51","0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97","0x018466851a65","0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a")).to.equal("0xafe8c82e9581af9917f20d72d997ece3ed6edad6fc25498c5a2f61324be79a2a");
    });
  
    it("should register the digestHash on chain", async () => {
      const [owner] = await ethers.getSigners();

      const MyContract = await ethers.getContractFactory("digestHash");
      const myContract = await MyContract.deploy();
  
      await myContract.deployed();
      expect(await myContract.checkEthereumOwner("0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a")).to.equal("0x0000000000000000000000000000000000000000")
      expect(await myContract.checkDidOwner(owner.address)).to.equal("");

      await myContract.registerDigestHash("did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51","0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97","0x018466851a65","0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a");
      expect(await myContract.checkEthereumOwner("0xafe8c82e9581af9917f20d72d997ece3ed6edad6fc25498c5a2f61324be79a2a")).to.equal(owner.address);
   
      expect(await myContract.checkDidOwner(owner.address)).to.equal("did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51");

    });

    it("should not be registered twice", async () => {
      const [owner] = await ethers.getSigners();

      const MyContract = await ethers.getContractFactory("digestHash");
      const myContract = await MyContract.deploy();
  
      await myContract.deployed();
      expect(await myContract.checkEthereumOwner("0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a")).to.equal("0x0000000000000000000000000000000000000000")
      expect(await myContract.checkDidOwner(owner.address)).to.equal("");

      await myContract.registerDigestHash("did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51","0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97","0x018466851a65","0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a");
      expect(await myContract.checkEthereumOwner("0xafe8c82e9581af9917f20d72d997ece3ed6edad6fc25498c5a2f61324be79a2a")).to.equal(owner.address);
   
      expect(await myContract.checkDidOwner(owner.address)).to.equal("did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51");

      await expect (myContract.registerDigestHash("did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51","0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97","0x018466851a65","0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a")).to.be.revertedWith("This VC has already been registered");
    });

    it("should not be registered with 2 different didAddress", async () => {
      const [owner] = await ethers.getSigners();

      const MyContract = await ethers.getContractFactory("digestHash");
      const myContract = await MyContract.deploy();
  
      await myContract.deployed();
      expect(await myContract.checkEthereumOwner("0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a")).to.equal("0x0000000000000000000000000000000000000000")
      expect(await myContract.checkDidOwner(owner.address)).to.equal("");

      await myContract.registerDigestHash("did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51","0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97","0x018466851a65","0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a");
      expect(await myContract.checkEthereumOwner("0xafe8c82e9581af9917f20d72d997ece3ed6edad6fc25498c5a2f61324be79a2a")).to.equal(owner.address);
   
      expect(await myContract.checkDidOwner(owner.address)).to.equal("did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51");

      await expect (myContract.registerDigestHash("did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e52","0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97","0x018466851a65","0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a")).to.be.revertedWith("You (this etheruemAddress) cannot upload others' VC, the didAddress is not you");
    });

});
 