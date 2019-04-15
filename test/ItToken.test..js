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
        assert.equal(name, 'It Token');
        const symble = await this.itToken.symble();
        assert.equal(symble, 'ITT');
        const totalSupply = await this.itToken.totalSupply();
        assert.equal(totalSupply.toNumber(), 1000000000);
        const balanceOfAdmin = await this.itToken.balanceOf(accounts[0]);
        assert.equal(balanceOfAdmin.toNumber(), 1000000000);
    });

    it('transfer token ownership', async () => {
        try {
            await this.itToken.transfer.call(accounts[1], 10000000000);
            // .call will not create a transection and return the specified return values
        } catch (err) {
            assert(err.message.indexOf('revert') >= 0);
        }

        let returnValue = await this.itToken.transfer.call(accounts[1], 100);
        assert.equal(returnValue, true);

        let receipt = await this.itToken.transfer(accounts[1], 100, { from: accounts[0] });
        // not using .call will create a transaction and return the receipt hash

        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, 'Transfer');
        assert.equal(receipt.logs[0].args._from, accounts[0]);
        assert.equal(receipt.logs[0].args._to, accounts[1]);
        assert.equal(receipt.logs[0].args._value, 100);

        const balance0 = await this.itToken.balanceOf(accounts[0]);
        assert.equal(balance0.toNumber(), 999999900);
        const balance1 = await this.itToken.balanceOf(accounts[1]);
        assert.equal(balance1.toNumber(), 100);
    });

    it('approves tokens for delegated transfers', async () => {
        let returnValue = await this.itToken.approve.call(accounts[1], 100);
        assert.equal(returnValue, true);

        const receipt = await this.itToken.approve(accounts[1], 100, { from: accounts[0] });
        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, 'Approve');
        assert.equal(receipt.logs[0].args._owner, accounts[0]);
        assert.equal(receipt.logs[0].args._spender, accounts[1]);
        assert.equal(receipt.logs[0].args._value, 100);

        const allowance = await this.itToken.allowance(accounts[0], accounts[1]);
        assert.equal(allowance.toNumber(), 100);
    });

    it('handles delegated token transfer', async () => {
        fromAcc = accounts[2];
        toAcc = accounts[3];
        spendingAcc = accounts[4];
        await this.itToken.transfer(fromAcc, 2000, { from: accounts[0] });
        await this.itToken.approve(spendingAcc, 100, { from: fromAcc });
        try {
            await this.itToken.transferFrom(fromAcc, toAcc, 9999, { from: spendingAcc });
        } catch (err) {
            assert(err.message.indexOf('revert') >= 0);
        }
        try {
            await this.itToken.transferFrom(fromAcc, toAcc, 999, { from: spendingAcc });
        } catch (err) {
            assert(err.message.indexOf('revert') >= 0);
        }
        const returnVal = await this.itToken.transferFrom.call(fromAcc, toAcc, 100, { from: spendingAcc });
        assert.equal(returnVal, true);

        const receipt = await this.itToken.transferFrom(fromAcc, toAcc, 100, { from: spendingAcc });
        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, 'Transfer');
        assert.equal(receipt.logs[0].args._from, fromAcc);
        assert.equal(receipt.logs[0].args._to, toAcc);
        assert.equal(receipt.logs[0].args._value, 100);

        const balance2 = await this.itToken.balanceOf(fromAcc);
        assert.equal(balance2.toNumber(), 1900);
        const balance3 = await this.itToken.balanceOf(toAcc);
        assert.equal(balance3.toNumber(), 100);
        const balance4 = await this.itToken.balanceOf(spendingAcc);
        assert.equal(balance4.toNumber(), 0);

        const allowance = await this.itToken.allowance(fromAcc, spendingAcc);
        assert.equal(allowance.toNumber(), 0);
    });
});