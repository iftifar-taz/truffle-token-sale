pragma solidity ^0.5.7;

contract ItToken {
    string public name;
    string public symble;
    string public standard;
    uint256 public totalSupply;

    mapping(address=>uint256) public balanceOf;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    constructor(uint256 _totalSupply) public {
        name = 'It Token';
        symble = 'ITT';
        standard = 'It Token v1.0';
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns(bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
