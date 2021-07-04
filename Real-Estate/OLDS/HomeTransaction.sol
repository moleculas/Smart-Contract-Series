// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

contract HomeTransaction {
    // Constants
    uint256 constant timeBetweenDepositAndFinalization = 5 minutes;
    uint256 constant depositPercentage = 10;

    event ContracteSignatVenedor(
        string content_contracte, 
        address address_contracte
        );

    enum ContractState {
        WaitingSellerSignature,
        WaitingBuyerSignature,
        WaitingRealtorReview,
        WaitingFinalization,
        Finalized,
        Rejected
    }
    ContractState public contractState = ContractState.WaitingSellerSignature;

    // Roles acting on contract
    address payable public realtor;
    address payable public seller;
    address payable public buyer;

    // Contract details
    string public homeAddress;
    string public zip;
    string public city;
    string public observacions;
    uint256 public realtorFee;
    uint256 public price;
    uint256 public conversor;

    // Set when buyer signs and pays deposit
    uint256 public deposit;
    uint256 public finalizeDeadline;

    // Set when realtor reviews closing conditions
    enum ClosingConditionsReview {Pending, Accepted, Rejected}
    ClosingConditionsReview closingConditionsReview =
        ClosingConditionsReview.Pending;

    constructor(
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
    ) {
        require(
            _price >= _realtorFee,
            "Price needs to be more than realtor fee!"
        );

        realtor = _realtor;
        seller = _seller;
        buyer = _buyer;
        homeAddress = _address;
        zip = _zip;
        city = _city;
        observacions = _observacions;
        price = _price;
        realtorFee = _realtorFee;
        conversor = _conversor;
    }

    function sellerSignContract() public payable {
        // require(seller == msg.sender, "Only seller can sign contract");

        require(
            contractState == ContractState.WaitingSellerSignature,
            "Wrong contract state"
        );

        contractState = ContractState.WaitingBuyerSignature;
        address _address_contracte= address(this);
        string memory _content_contracte="Contracte signat pel venedor";
        emit ContracteSignatVenedor(_content_contracte, _address_contracte);        
    }

    function buyerSignContractAndPayDeposit() public payable {
        //  require(buyer == msg.sender, "Only buyer can sign contract");

        require(
            contractState == ContractState.WaitingBuyerSignature,
            "Wrong contract state"
        );

        //  require(msg.value >= price*depositPercentage/100 && msg.value <= price, "Buyer needs to deposit between 10% and 100% to sign contract");

        contractState = ContractState.WaitingRealtorReview;

        deposit = msg.value;
        finalizeDeadline = block.timestamp + timeBetweenDepositAndFinalization;
    }

    function realtorReviewedClosingConditions(bool accepted) public {
        //  require(realtor == msg.sender, "Only realtor can review closing conditions");

        require(
            contractState == ContractState.WaitingRealtorReview,
            "Wrong contract state"
        );

        if (accepted) {
            closingConditionsReview = ClosingConditionsReview.Accepted;
            contractState = ContractState.WaitingFinalization;
        } else {
            closingConditionsReview = ClosingConditionsReview.Rejected;
            contractState = ContractState.Rejected;

            buyer.transfer(deposit);
        }
    }

    function buyerFinalizeTransaction() public payable {
        //   require(buyer == msg.sender, "Only buyer can finalize transaction");

        require(
            contractState == ContractState.WaitingFinalization,
            "Wrong contract state"
        );

         //require(msg.value + deposit == price, "Buyer needs to pay the rest of the cost to finalize transaction");

        contractState = ContractState.Finalized;

        seller.transfer(price - realtorFee);
       realtor.transfer(realtorFee);
        // seller.transfer(price);
    }

    function anyWithdrawFromTransaction() public {
        require(
            buyer == msg.sender || finalizeDeadline <= block.timestamp,
            "Only buyer can withdraw before transaction deadline"
        );

        require(
            contractState == ContractState.WaitingFinalization,
            "Wrong contract state"
        );

        contractState = ContractState.Rejected;

        seller.transfer(deposit - realtorFee);
        realtor.transfer(realtorFee);
    }
}
