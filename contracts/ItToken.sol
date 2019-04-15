pragma solidity ^0.5.7;

contract ItToken {
    string public name;
    string public symble;
    string public standard;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    event Approve(
        address indexed _owner,
        address indexed _spender,
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

    function approve(address _spender, uint256 _value) public returns(bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approve(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
