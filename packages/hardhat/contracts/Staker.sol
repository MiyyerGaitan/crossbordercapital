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
  uint256 public constant threshold = 1 ether;
  uint256 public deadline = block.timestamp + 30 seconds;
  bool public openForWithdraw = true;
  bool public openForStake = true;

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

    require(block.timestamp >= deadline, "La vaca sigue abierta");
    if(address(this).balance >= threshold) {
      exampleExternalContract.complete{value: address(this).balance}();
      openForWithdraw = false;
      openForStake = false;
    }
  }

  // If the `threshold` was not met, allow everyone to call a `withdraw()` function to withdraw their balance

  function withdraw () public {
    require(balances[msg.sender] > 0, "No hay fondos");
    require(address(this).balance < threshold, "No puedes retirar");
    require(openForWithdraw, "La vaca ya se fue");
    (bool response, /*bytes data*/) = msg.sender.call{value: balances[msg.sender]}("");
    require(response, "La transaccion no fue exitosa");
    balances[msg.sender] = 0;
  }

  // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend

  function timeLeft() public view returns(uint256) {
    if(block.timestamp < deadline) {
      return deadline - block.timestamp;
    }

    return 0;
  }

  // Add the `receive()` special function that receives eth and calls stake()

  function receive () public {

    stake();

  }

}
