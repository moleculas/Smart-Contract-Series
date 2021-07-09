// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UsersContract {
    struct User {
        string name;
        string surName;
    }

    mapping(address => User) private users;
    mapping(address => bool) private joinedUsers;
    address[] total;
    event onUserJoined(address, string);

    string public nameContract;

    constructor() {
        nameContract = "Registro de Usuarios";
    }

    function join(string memory _name, string memory _surName) public {
        require(!userJoined(msg.sender));
        User storage user = users[msg.sender];
        user.name = _name;
        user.surName = _surName;
        joinedUsers[msg.sender] = true;
        total.push(msg.sender);
        emit onUserJoined(
            msg.sender,
            string(abi.encodePacked(_name, " ", _surName))
        );
    }

    function getUser(address _address)
        public
        view
        returns (string memory, string memory)
    {
        require(userJoined(msg.sender));
        User memory user = users[_address];
        return (user.name, user.surName);
    }

    function userJoined(address _address) private view returns (bool) {
        return joinedUsers[_address];
    }

    function totalUsers() public view returns (uint256) {
        return total.length;
    }
}
