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

    it('sets total supply', async () => {
        const totalSupply = await this.itToken.totalSupply();
        assert.equal(totalSupply, 1000000000);
    });
})