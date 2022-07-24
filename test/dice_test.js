const Dice = artifacts.require('Dice');

contract('Dice', accounts => {
    it('salt should changed', async () => {
        let instance = await Dice.deployed();
        let salt = 0xffff;
        let play = await instance.setSalt(salt);
        let cryptoSalt = await instance.cryptoSalt();
        console.log(`New salt: ${cryptoSalt}`);
        assert.equal(cryptoSalt, salt);
    })
    it('player state should changed', async () => {
        let instance = await Dice.deployed();
        //let log = await instance.getPlayerInfo();
        let init = await instance.initialisation();
        let play = await instance.playDice(0, 1);
        let log1 = await instance.getPlayerInfo();
        
        console.log(`random number: ${log1[1]}`);
        assert.notEqual(log1[1], 0);
    })
    it('address should added to players struct', async () => {
        let instance = await Dice.deployed();
        //let log = await instance.getPlayerInfo();
        let init = await instance.initialisation();
        let address = await instance.getPlayerInfo();

        console.log(`Assress: ${address[0]}`);
        assert.equal(address[0], accounts[0]);
    })
    it('Result is correctly', async () => {
        let instance = await Dice.deployed();
        let init = await instance.initialisation();
        let transfer = await instance.transfer(accounts[1], 10000);
        let play = await instance.playDice(0, 1, {from: accounts[1], gas: 5000000});

        let log1 = await instance.getPlayerInfo({from: accounts[1]});
        //log1 = await instance.getPlayerInfo();
        for(let i=0; i<1; ){
            if(log1[1] > 50){
                i++;
            }
            else {
                  play = await instance.playDice(0, 1, {from: accounts[1], gas: 5000000});
                  log1 = await instance.getPlayerInfo({from: accounts[1]});
            }
        }
        
        log1= await instance.getPlayerInfo({from: accounts[1]});;       
        console.log(`random number: ${log1[1]}; direction: ${log1[2]}; result: ${log1[3]}; Win`);
        assert.equal(log1[3], 2);
        play = await instance.playDice(0, 1, {from: accounts[1], gas: 5000000});
        log1 = await instance.getPlayerInfo({from: accounts[1]});
        for(let i=0; i<1; ){
            if(log1[1] <= 50){
                i++;
            }
            else {
                  play = await instance.playDice(0, 1, {from: accounts[1], gas: 5000000});
                  log1 = await instance.getPlayerInfo({from: accounts[1]});
            }
        }
        
        log1= await instance.getPlayerInfo({from: accounts[1]});;       
        console.log(`random number: ${log1[1]}; direction: ${log1[2]}; result: ${log1[3]}; Lose`);
        assert.equal(log1[3], 3);
        
        play = await instance.playDice(1, 1, {from: accounts[1], gas: 5000000});  
        log1 = await instance.getPlayerInfo({from: accounts[1]});
        for(let i=0; i<1; ){
            if(log1[1] < 49){
                i++;
            }
            else {
                  play = await instance.playDice(1, 1, {from: accounts[1], gas: 5000000});
                  log1 = await instance.getPlayerInfo({from: accounts[1]});
            }
        }
        
        log1= await instance.getPlayerInfo({from: accounts[1]});;       
        console.log(`random number: ${log1[1]}; direction: ${log1[2]}; result: ${log1[3]}: Win`);
        assert.equal(log1[3], 2);
        
        play = await instance.playDice(1, 1, {from: accounts[1], gas: 5000000});
        log1 = await instance.getPlayerInfo({from: accounts[1]});
        for(let i=0; i<1; ){
            if(log1[1] >= 49){
                i++;
            }
            else {
                  play = await instance.playDice(1, 1, {from: accounts[1], gas: 5000000});
                  log1 = await instance.getPlayerInfo({from: accounts[1]});
            }
        }
        
        log1= await instance.getPlayerInfo({from: accounts[1]});;       
        console.log(`random number: ${log1[1]}; direction: ${log1[2]}; result: ${log1[3]}: Lose`);
        assert.equal(log1[3], 3);
/*
        play = await instance.playDice(2);
        log1 = await instance.getPlayerInfo();
        for(let i=0; i<1; ){
            if(log1[1] == 49 || log1[1] == 50){
                i++;
            }
            else {
                  play = await instance.playDice(2);
                  log1 = await instance.getPlayerInfo();
            }
        }
        
        log1= await instance.getPlayerInfo();;       
        console.log(`random number: ${log1[1]}; direction: ${log1[2]}; result: ${log1[3]}: Win`);
        assert.equal(log1[3], 2);
*/        
        play = await instance.playDice(2, 1, {from: accounts[1], gas: 5000000});
        log1 = await instance.getPlayerInfo({from: accounts[1]});
        for(let i=0; i<1; ){
            if(log1[1] != 49 || log1[1] != 50){
                i++;
            }
            else {
                  play = await instance.playDice(1, 1, {from: accounts[1], gas: 5000000});
                  log1 = await instance.getPlayerInfo({from: accounts[1]});
            }
        }
        
        log1= await instance.getPlayerInfo({from: accounts[1]});;       
        console.log(`random number: ${log1[1]}; direction: ${log1[2]}; result: ${log1[3]}: Lose`);
        assert.equal(log1[3], 3);
    })   
})
