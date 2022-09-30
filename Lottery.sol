// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Lottery {

    constructor(address _Dice){
        Dice = _Dice;
    }

    address immutable Dice;
    enum modes{
        LINEAR_MODE,
        UNLINEAR_MODE,
    }

    struct lotteryState {
        uint startBlock;
        uint endBlock;
        uint winners;
        uint ticketPrice;
        uint saledTickets;
        uint totalBank;
        uint[] winNumbers;
        modes mode;
    }

    lotteryState currentLottery;

    mapping (address => uint[]) players;
    mapping (address => uint) winTickets;

    address playersList[] = {0};

    uint cryptoSalt = 0xAAAA;

    function getRandomNumber() view internal returns (uint) {
        return uint(keccak256(abi.encodePacked((block.difficulty ^ cryptoSalt), block.timestamp)));
    }

    function setLottery(
        uint _startBlock, 
        uint _endBlock,
        uint _winners,
        modes _mode,
        uint _ticketPrice
        ) public {
            require(msg.sender == contractOwner, "You are not owner");
            currentLottery.startBlock = _startBlock;
            currentLottery.endBlock = _endBlock;
            currentLottery.winners = _winners;
            currentLottery.ticketPrice = _ticketPrice;
            currentLottery.mode = _mode;
        }
    function expiration() public {

        require(block.number > currentLottery.endBlock, "Lottery not finished");

        for (uint i = 0; i < currentLottery.winners; i++){
            uint _number = getRandomNumber() % (currentLottery.saledTickets + 1);
            cryptoSalt++;
            bool duplicate = false;
            for(uint j = 0; j < currentLottery.winNumbers.length; j++){
                if(currentLottery.winNumbers[j] == _number) {
                    duplicate = true;
            }
                if(!duplicate) {
                    currentLottery.winNumbers.pull(_number);
                } else {
                    i--;
                    duplicate = false;
                }
            }
        }
    }
    function getWinTickets(address _winner) internal returns(uint){
        uint _winTickets = 0;
        for (uint i = 0; i < currentLottery.winNumbers.length; i++){
            for (j = 0; j < players[_winner].length; j++){
                if(currentLottery.winNumbers[i] == players[_winner][j]) _winTickets++;
            }
        }
        return _winTickets;
    }

    function payments() public{
        for(uint i = 0; i < playersList.length; i++){
            if(getWinTickets(playersList[i]) != 0){
                DiceCoin.call(abi.encode(
                    "transfer(address, uint256)", 
                    playersList[i], 
                    (getWinTickets(playersList[i]) * (currentLottery.totalBank / currentLottery.winners))
                    ));
            }
        }
    }

    function buyTicket(_amount) public external{
        require(block.number >= currentLottery.startBlock, "Lottery not running yet" );
        require(block.number <= currentLottery.endBlock, "Lottery finished");

        transfer(address(this), currentLottery.ticketPrice * _amount);

        for(i = 0; i < _amount; i++){
            currentLottery.saledTickets++;
            players[msg.sender].pull(currentLottery.saledTickets);            
        }
        currentLottery.totalBank = saledTickets * currentLottery.ticketPrice;

        bool duplicate = false;
        for(uint i = 0; i < playersList.length; i++){
            if(playersList[i] == msg.sender) duplicate = true;
        }
        if(!duplicate) playersList.push(msg.sender);
    }
}