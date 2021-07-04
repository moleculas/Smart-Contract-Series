// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

import "./HomeTransaction.sol";

contract Factory {
    HomeTransaction[] contracts;
    string public name;

    event ContracteCreat(string content_contracte, address address_contracte);

    constructor() public {
        name = "Creation of real estate contracts SMART CONTRACTS BARCELONA";
    }

    function create(
        string memory _address,
        string memory _zip,
        string memory _city,
        string memory _observacions,
        uint256 _realtorFee,
        uint256 _price,
        uint256 _conversor,
        address payable _realtor,
        address payable _seller,
        address payable _buyer
    ) public returns (HomeTransaction homeTransaction) {
        homeTransaction = new HomeTransaction(
            _address,
            _zip,
            _city,
            _observacions,
            _realtorFee,
            _price,
            _conversor,
            _realtor,
            _seller,
            _buyer
        );
        contracts.push(homeTransaction);
        address _address_contracte = address(homeTransaction);
        string memory _content_contracte =
            "Contracte creat per la immobiliaria";
        emit ContracteCreat(_content_contracte, _address_contracte);        
    }

    function getInstance(uint256 index)
        public
        view
        returns (HomeTransaction instance)
    {
        require(index < contracts.length, "index out of range");

        instance = contracts[index];
    }

    function getInstances()
        public
        view
        returns (HomeTransaction[] memory instances)
    {
        instances = contracts;
    }

    function getInstanceCount() public view returns (uint256 count) {
        count = contracts.length;
    }
}
