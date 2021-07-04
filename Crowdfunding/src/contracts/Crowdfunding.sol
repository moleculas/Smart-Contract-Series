// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Crowdfunding {
    string public name;
    string public nombre;
    string public apellido;
    uint256 public objetivo = 200 ether;
    uint256 public balance;
    uint256 totalRecaudado;
    uint256 public aportacion;
    address payable public artista = 0xF2BbD81008BEd9Ff93f8BF5db81A0525E5DDb769;
    address public elMecenas;

    constructor() public{
        name = "Pasarela de pago Crowdfunding";
        elMecenas = msg.sender;
    }

    function setMecenas(string memory _nombre_mecenas,string memory _apellido_mecenas, uint256 _aportacion_mecenas) public payable {        
        nombre = _nombre_mecenas;
        apellido = _apellido_mecenas;
        aportacion= _aportacion_mecenas;
        // require(msg.value > 1 ether);       
        balance = balance + msg.value;
        // = balance + aportacion;
        //balance = balance + 1 ether;
        
        //if (balance >= objetivo) {
            //payOut();
            totalRecaudado = balance;
            balance = 0;
            artista.transfer(totalRecaudado);
        //}
    }

    function getMecenas() public view returns (string memory, string memory) {
        return (nombre, apellido);
    }

    function payOut() private {
        totalRecaudado = balance;
        balance = 0;
        artista.transfer(totalRecaudado);
    }
}
