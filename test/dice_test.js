const Dice = artifacts.require('Dice');
const truffleAssert = require('truffle-assertions');
contract('Dice', accounts => {
    it('Salt should changed', async () => {
        let instance = await Dice.deployed();
        let salt = 0xffff; //salt
        let play = await instance.setSalt(salt);
        let cryptoSalt = await instance.cryptoSalt();
        console.log(`New salt: ${cryptoSalt}`);
        assert.equal(cryptoSalt, salt);
    })

    it('Result is correctly', async () => {
        let instance = await Dice.deployed();
        let transfer = await instance.transfer(accounts[1], 10000);
        let play = await instance.playDice(0, 1, {from: accounts[1]});

        // let log1 = await instance.getPlayerInfo({from: accounts[1]});
        //log1 = await instance.getPlayerInfo();
        let log1 = await instance.getPastEvents('playLog',{});

        // console.log(log1[0].returnValues.number);
        
        for(let i=0; i<1; ){
            if(log1[0].returnValues.number > 50){
                i++;
            }
            else {
                  play = await instance.playDice(0, 1, {from: accounts[1]});
                  log1 = await instance.getPastEvents('playLog',{});
            }
        }
        
        log1 = await instance.getPastEvents('playLog',{});       
        console.log(`
            random number: ${log1[0].returnValues.number}; 
            direction: ${log1[0].returnValues._direction}; 
            result: ${log1[0].returnValues._result}: Win`);
        assert.equal(log1[0].returnValues._result, 2);
        play = await instance.playDice(0, 1, {from: accounts[1]});
        log1 = await instance.getPastEvents('playLog',{});

        for(let i=0; i<1; ){
            if(log1[0].returnValues.number <= 50){
                i++;
            }
            else {
                  play = await instance.playDice(0, 1, {from: accounts[1]});
                  log1 = await instance.getPastEvents('playLog',{});
            }
        }
        
        log1 = await instance.getPastEvents('playLog',{});       
        console.log(`
            random number: ${log1[0].returnValues.number}; 
            direction: ${log1[0].returnValues._direction}; 
            result: ${log1[0].returnValues._result}: Lose`);
        assert.equal(log1[0].returnValues._result, 3);
        
        play = await instance.playDice(1, 1, {from: accounts[1]});  
        log1 = await instance.getPastEvents('playLog',{});
        for(let i=0; i<1; ){
            if(log1[0].returnValues.number < 49){
                i++;
            }
            else {
                  play = await instance.playDice(1, 1, {from: accounts[1]});
                  log1 = await instance.getPastEvents('playLog',{});
            }
        }
        
        log1 = await instance.getPastEvents('playLog',{});       
        console.log(`
            random number: ${log1[0].returnValues.number}; 
            direction: ${log1[0].returnValues._direction}; 
            result: ${log1[0].returnValues._result}: Win`);
        assert.equal(log1[0].returnValues._result, 2);
        
        play = await instance.playDice(1, 1, {from: accounts[1]});
        log1 = await instance.getPastEvents('playLog',{});
        for(let i=0; i<1; ){
            if(log1[0].returnValues.number >= 49){
                i++;
            }
            else {
                  play = await instance.playDice(1, 1, {from: accounts[1]});
                  log1 = await instance.getPastEvents('playLog',{});
            }
        }
        
        log1 = await instance.getPastEvents('playLog',{});       
        console.log(`
            random number: ${log1[0].returnValues.number}; 
            direction: ${log1[0].returnValues._direction}; 
            result: ${log1[0].returnValues._result}: Lose`);
        assert.equal(log1[0].returnValues._result, 3);
/*
        play = await instance.playDice(2);
        log1 = await instance.getPastEvents('playLog',{});
        for(let i=0; i<1; ){
            if(log1[0].returnValues.number == 49 || log1[1] == 50){
                i++;
            }
            else {
                  play = await instance.playDice(2);
                  log1 = await instance.getPastEvents('playLog',{});
            }
        }
        
        log1 = await instance.getPastEvents('playLog',{});       
        console.log(`
            random number: ${log1[0].returnValues.number}; 
            direction: ${log1[0].returnValues._direction}; 
            result: ${log1[0].returnValues._result}: Win`);
        assert.equal(log1[0].returnValues._result, 2);
*/        
        play = await instance.playDice(2, 1, {from: accounts[1]});
        log1 = await instance.getPastEvents('playLog',{});
        for(let i=0; i<1; ){
            if(log1[0].returnValues.number != 49 && log1[0].returnValues.number != 50){
                i++;
            }
            else {
                  play = await instance.playDice(1, 1, {from: accounts[1]});
                  log1 = await instance.getPastEvents('playLog',{});
            }
        }
        
        log1 = await instance.getPastEvents('playLog',{});       
        console.log(`
            random number: ${log1[0].returnValues.number}; 
            direction: ${log1[0].returnValues._direction}; 
            result: ${log1[0].returnValues._result}: Lose`);
        assert.equal(log1[0].returnValues._result, 3);
    })  
    it('Balance should changed', async () => {
        let instance = await Dice.deployed();
        let transfer = await instance.transfer(accounts[1], 10000);
        let play = await instance.playDice(0, 1, {from: accounts[1]});
        let log1 = await instance.getPastEvents('playLog',{});
        let balance = await instance.balanceOf(accounts[1]);
        for (let i = 0; i < 2;){
            let balance1 = await instance.balanceOf(accounts[1]);
            play = await instance.playDice(0, 1, {from: accounts[1]});
            log1 = await instance.getPastEvents('playLog',{});
            if(i == 0 && log1[0].returnValues._result == 2){
                balance = await instance.balanceOf(accounts[1]);
                console.log(balance);
                assert(balance1 < balance);
                i++;
            }
            if(i == 1 && log1[0].returnValues._result == 3){
                balance = await instance.balanceOf(accounts[1]);
                console.log(balance);
                assert(balance1 > balance);
                i++;
            }
        }
    }) 
    it('200 rolls', async () => {
        let instance = await Dice.deployed();
        let transfer = await instance.transfer(accounts[1], 10000);
        let play = await instance.playDice(0, 1, {from: accounts[1]});
        let log1 = await instance.getPastEvents('playLog',{});
        let balance = await instance.balanceOf(accounts[1]);
        console.log(`balance before: ${balance}`);

        let wins = 0;
        let loses = 0;
        for (let i = 0; i < 200; i++){
            play = await instance.playDice(0, 1, {from: accounts[1]});
            log1 = await instance.getPastEvents('playLog',{});
            if(log1[0].returnValues._result == 2) wins++;
            if(log1[0].returnValues._result == 3) loses++;
        }
        balance = await instance.balanceOf(accounts[1]);
        console.log(`balance after: ${balance}, wins: ${wins}, loses: ${loses}`);
    })
})
