const {expect} = require("chai");
const {ethers} = require("hardhat");
const hre = require("hardhat");

describe("OrbsToken", function () {
    let token;
    let owner;
    let addr1;
    let addr2;
    beforeEach(async function () {
        const Orbs = await hre.ethers.getContractFactory("OrbsToken");
        token = await Orbs.deploy();
        await token.deployed();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("Should successfully deploy", async function () {
        console.log('Success');
    });

    it("Should deploy with 1m of supply for the owner of the contract", async function () {
        const balance = await token.balanceOf(owner.address);
        expect(ethers.utils.formatEther(balance) === 1000000);
    });

    it("Should let you send tokens to another address", async function () {
        await token.transfer(addr1.address, ethers.utils.parseEther('100'));
        const addr1Balance = ethers.utils.formatEther(await token.balanceOf(addr1.address));
        expect(addr1Balance).to.equal('100.0');
    });

    it("Should let you approve another address to send on your behalf", async function () {
        await token.transfer(addr1.address, ethers.utils.parseEther('1000'));
        await token.connect(addr1).approve(owner.address, ethers.utils.parseEther('1000'));
        await token.transferFrom(addr1.address, addr2.address, ethers.utils.parseEther('1000'));
        const addr2Balance = ethers.utils.formatEther(await token.balanceOf(addr2.address));
        expect(addr2Balance).to.equal('1000.0');
    });
});