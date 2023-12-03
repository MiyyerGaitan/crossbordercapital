// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;  //Do not change the solidity version as it negativly impacts submission grading

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {

  ExampleExternalContract public exampleExternalContract;

  constructor(address exampleExternalContractAddress) {
      exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
  }

  // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
  // (Make sure to add a `Stake(address,uint256)` event and emit it for the frontend `All Stakings` tab to display)

  mapping ( address => uint256 ) public balances;
  bool public openForWithdraw = true;
  bool public openForStake = true;
  bytes32 OTPfront = "1";
  bytes32 OTPback = "1";
  bytes32 OTPempty = "";
  uint256 public valor = 500000000000000000;
  uint256 public constant comision = 10000; 
  uint256 public monto = valor - comision;

  event Stake(address, uint256);

  function stake() public payable {
	
	// require(openForStake, "La vaca se fue");
	// require(block.timestamp < deadline, "La vaca esta cerrada");
  balances[msg.sender] += msg.value;
  emit Stake(msg.sender, msg.value);
}

  // After some `deadline` allow anyone to call an `execute()` function
  // If the deadline has passed and the threshold is met, it should call `exampleExternalContract.complete{value: address(this).balance}()`

  function execute() public {

    //require(block.timestamp >= deadline, "La vaca sigue abierta");
    require((keccak256(abi.encodePacked(OTPfront)) != keccak256(abi.encodePacked(OTPempty))), "Se requiere confirmacion OTP");
    require((keccak256(abi.encodePacked(OTPfront)) == keccak256(abi.encodePacked(OTPback))), "OTP incorrecto");
    if(address(this).balance >= monto) {
      exampleExternalContract.complete{value: address(this).balance}();
      openForWithdraw = false;
      openForStake = false;
    }
  }

  // If the `threshold` was not met, allow everyone to call a `withdraw()` function to withdraw their balance

  function withdraw () public {
    require(balances[msg.sender] > 0, "No hay transacciones pendientes");
    require(address(this).balance < monto, "No puedes retirar");
    require(openForWithdraw, "La transaccion fue recibida por el pool");
    (bool response, /*bytes data*/) = msg.sender.call{value: balances[msg.sender]}("");
    require(response, "La transaccion no fue exitosa");
    balances[msg.sender] = 0;
  }

  // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend

  // Add the `receive()` special function that receives eth and calls stake()

  function receive () public {

    stake();

  }

}
