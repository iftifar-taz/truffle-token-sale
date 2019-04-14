const ItToken = artifacts.require('ItToken')

contract('ItToken', (accounts) => {
    before(async () => {
        this.itToken = await ItToken.deployed()
    });

    it('deploys successfully', async () => {
        const address = await this.itToken.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    });

    it('initializes contract with correct values', async () => {
        const name = await this.itToken.name();
        const symble = await this.itToken.symble();
        assert.equal(name, 'It Token');
        assert.equal(symble, 'ITT');
    });

    it('sets total supply', async () => {
        const totalSupply = await this.itToken.totalSupply();
        assert.equal(totalSupply.toNumber(), 1000000000);
    });

    it('sets admin balance', async () => {
        const balanceOfAdmin = await this.itToken.balanceOf(accounts[0]);
        assert.equal(balanceOfAdmin.toNumber(), 1000000000);
    });

    it('transfer token', async () => {
        try {
            await this.itToken.transfer.call(accounts[1], 10000000000);
            // .call will not create a transection and return the specified return values
        } catch (err) {
            assert(err.message.indexOf('revert') >= 0);
        }
        await this.itToken.transfer(accounts[1], 100, {from: accounts[0]});
        // not using .call will create a transaction and return the receipt hash
        const balance0 = await this.itToken.balanceOf(accounts[0]);
        assert.equal(balance0.toNumber(), 999999900);
        const balance1 = await this.itToken.balanceOf(accounts[1]);
        assert.equal(balance1.toNumber(), 100);
    });

    it('transfer token event', async () => {
        let receipt = await this.itToken.transfer(accounts[1], 100, {from: accounts[0]});
        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, 'Transfer');
        assert.equal(receipt.logs[0].args._from, accounts[0]);
        assert.equal(receipt.logs[0].args._to, accounts[1]);
        assert.equal(receipt.logs[0].args._value, 100);
    });

    it('transfer token return value', async () => {
        let returnValue = await this.itToken.transfer.call(accounts[1], 100);
        assert.equal(returnValue, true);
    });
})