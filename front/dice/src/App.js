import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum.js';

function App() {
  const [Dice, setDice] = useState(undefined);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const { Dice } = await getBlockchain();
      const data = await Dice.readData();
      setDice(Dice);
      setData(data);
    };
    init();
  }, []);

  const updateData = async e => {
    e.preventDefault();
    const data = e.target.elements[0].value;
    const tx = await Dice.updateData(data);
    await tx.wait();
    const newData = await Dice.readData();
    setData(newData);
  };

  if(
    typeof Dice === 'undefined'
    || typeof data === 'undefined'
  ) {
    return 'Loading...';
  }

  return (
    <div className='container'>
      <div className='row'>

        <div className='col-sm-6'>
          <h2>Data:</h2>
          <p>{data.toString()}</p>
        </div>

        <div className='col-sm-6'>
          <h2>Change data</h2>
          <form className="form-inline" onSubmit={e => updateData(e)}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="data"
            />
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;