import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import diceContract from "./connection";
import provider from "./provider";

export default function PlayForm({
  signer,
  diceWithSigner,
  setErrorMessage,
  setPedding,
  setTxStatus,
  pedding,
  isConnect,
}) {
  const [amount, setAmount] = useState(0);
  const [direction, setDirection] = useState(0);
  const [balance, setBalance] = useState(0);
  const [tx, setTx] = useState();

  const handleSubmitRoll = async (event) => {
    event.preventDefault();

    try {
      const tx = await diceWithSigner.playDice(
        direction,
        ethers.BigNumber.from(amount.toString() + "000000000000000000")
      );
      setPedding(true);
      await provider.waitForTransaction(tx.hash);
      const trans = await provider.getTransactionReceipt(tx.hash);
      console.log({ status: trans.status });
      setTxStatus(trans.status);
      setPedding(false);

      setTx(tx);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };
  useEffect(() => {
    (async () => {})();
  }, []);

  const options = [
    { value: 0, label: "UP" },
    { value: 1, label: "DOWN" },
    { value: 2, label: "ZERO" },
  ];
  const handleChange = (selectedOption) => {
    setDirection(selectedOption);
  };
  return (
    <>
      <form
        onSubmit={handleSubmitRoll}
        className="flex justify-center flex-col px-auto "
      >
        <div className="flex mx-auto py-auto items-center justify-center mt-4">
          <label htmlFor="amount">Enter amount DCE</label>
          <input
            type="number"
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent w-1/3 m-2 border-solid border-2 border-white rounded-lg text-right"
          />

          <select
            value={direction}
            onChange={(e) => handleChange(e.target.value)}
            className="bg-gray-100/[.4] flex m-0 rounded-lg"
          >
            <option className="bg-blue-700/[.4]" value={0}>
              UP
            </option>
            <option className="bg-red-700/[.4]" value={1}>
              DOWN
            </option>
            <option className="bg-green-700/[.4]" value={2}>
              ZERO
            </option>
          </select>
        </div>
        <input
          className="flex text-xl  border-2 border-white bg-[url('./rRo702.gif')] cursor-pointer  m-0 bg-cover text-white rounded-md px-8 py-4 mx-auto my-10 transition duration-500 ease select-none hover:border-orange-300 hover:text-orange-300 focus:outline-none focus:shadow-outline disabled:text-gray-500 disabled:border-gray-500 disabled:hover:border-gray-500  disabled:cursor-default disabled:bg-[url()]"
          type="submit"
          value="ROLL!!!"
          disabled={!isConnect || pedding || amount < 1}
        />
      </form>
    </>
  );
}
