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
        ZERO
        }    
    constructor(){
        contractOwner = payable(msg.sender);
        cryptoSalt = 0xAAAA; // Default salt
    }

    event playLog(address player, 
                  uint number, 
                  direction _direction, 
                  uint value,
                  result _result
                 );
    function setSalt(uint _salt) public returns (result){
        cryptoSalt = _salt;
        return result.OK;
    }
    function getRandomNumber() view internal returns (uint) {
        return uint(keccak256(abi.encodePacked((block.difficulty ^ cryptoSalt), block.timestamp)));
    }

    function playDice(direction _direction, uint _amount) public payable {
        require(_direction == direction.UP || 
                _direction == direction.DOWN || 
                _direction == direction.ZERO, 'Wrong value');
        require(_amount > 0, 'Wrong value');

        uint8 randomNumber = uint8(getRandomNumber() % 101);
        result _result;        
         cryptoSalt++;

        if(_direction == direction.UP){
            if(randomNumber > 50){

                _mint(msg.sender, _amount);
                _result = result.WIN;
            }else{               
                _burn(msg.sender, _amount);
                _result = result.LOSE;
            }
        }else if(_direction == direction.DOWN){
            if(randomNumber < 49){
                _mint(msg.sender, _amount);
                _result = result.WIN;
            }else{
                _burn(msg.sender, _amount);
                _result = result.LOSE;
            }
        }else if(_direction == direction.ZERO){
            if(randomNumber == 49 || randomNumber == 50 ){
                _mint(msg.sender, _amount * 10);
                _result = result.WIN;
            }else{
                _burn(msg.sender, _amount);
                _result = result.LOSE;
            }
        }    
        emit playLog(msg.sender,
            randomNumber, 
            _direction, 
            _amount,
            _result
            );           
    }
}
