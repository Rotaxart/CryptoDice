// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./DiceToken.sol";

contract Dice is DiceCoin{
    address payable public contractOwner;
    uint public cryptoSalt; 
    enum result {
        OK, 
        ERROR, 
        WIN, 
        LOSE
    }
    enum direction {
        UP, 
        DOWN, 
        ZERO}
    struct Player{
        address payable playerAddress;
        uint8[] rolls;
        direction[] directions;
        result[] results;
    }

    mapping (address => Player) public players;
    
    constructor(){
        contractOwner = payable(msg.sender);
        cryptoSalt = 0xAAAA; // Default salt
    }

    event playLog(address player, 
                  uint number, 
                  direction _direction, 
                  uint value
                 );
    //Everyone can change salt value
    function setSalt(uint _salt) public returns (result){
        cryptoSalt = _salt;
        return result.OK;
    }
    //Generate random number
    function getRandomNumber() view public returns (uint) {
        return uint(keccak256(abi.encodePacked((block.difficulty ^ cryptoSalt), block.timestamp)));
    }

    function initialisation() public {
        players[msg.sender].playerAddress = payable(msg.sender);
    }

    function getPlayerInfo() public view returns (address, uint8, direction, result){
        return (players[msg.sender].playerAddress, 
                players[msg.sender].rolls[players[msg.sender].rolls.length - 1],
                players[msg.sender].directions[players[msg.sender].directions.length - 1],
                players[msg.sender].results[players[msg.sender].results.length - 1]) ;
    }

    function playDice(direction _direction, uint _amount) public payable {
        require(_direction == direction.UP || 
                _direction == direction.DOWN || 
                _direction == direction.ZERO, 'Wrong value');

        uint8 randomNumber = uint8(getRandomNumber() % 101);
        players[msg.sender].rolls.push(randomNumber);
        players[msg.sender].directions.push(_direction);
        
        cryptoSalt++;
         emit playLog(players[msg.sender].playerAddress, 
                      randomNumber, 
                      _direction, 
                      msg.value
                     );

        if(_direction == direction.UP){
            if(randomNumber > 50){
            //    players[msg.sender].playerAddress.transfer(msg.value * 2);
                _approve(contractOwner, msg.sender, _amount);
                transferFrom(contractOwner, msg.sender, _amount);
                players[msg.sender].results.push(result.WIN);
            }else{               
                players[msg.sender].results.push(result.LOSE);
                transfer(contractOwner, _amount);
            }
        }else if(_direction == direction.DOWN){
            if(randomNumber < 49){
            //    players[msg.sender].playerAddress.transfer(msg.value * 2);
                _approve(contractOwner, msg.sender, _amount);
                transferFrom(contractOwner, msg.sender, _amount);
                players[msg.sender].results.push(result.WIN);
            }else{
                players[msg.sender].results.push(result.LOSE);
                transfer(contractOwner, _amount);
            }
        }else if(_direction == direction.ZERO){
            if(randomNumber == 49 || randomNumber == 50 ){
             //   players[msg.sender].playerAddress.transfer(msg.value * 10);
                _approve(contractOwner, msg.sender, _amount * 10);
                transferFrom(contractOwner, msg.sender, _amount * 10);
                players[msg.sender].results.push(result.WIN);
            }else{
                players[msg.sender].results.push(result.LOSE);
                transfer(contractOwner, _amount);
            }
        }
    }
}
