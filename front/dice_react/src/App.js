import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import PlayForm from "./components/PlayForm";
import diceContract from "./components/connection";
import provider from "./components/provider";
import EventList from "./components/EventList";
import "./main.css";

const signer = provider.getSigner();
const diceWithSigner = diceContract.connect(signer);

function App() {
  const [isConnect, setIsConnect] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [random, setRandom] = useState(0);
  const [balance, setBalance] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [pedding, setPedding] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [log, setLog] = useState([]);

  const handleConnectButton = async () => {
    try {
      await provider.send("eth_requestAccounts", []);

      const address = await signer.getAddress();
      setAccounts(address);
      setIsConnect(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    console.log("test");
    (async () => {
      if (isConnect) {
        try {
          const balance = await diceWithSigner.balanceOf(accounts);
          setBalance(ethers.utils.formatEther(balance));
          setErrorMessage("");
          setIsConnect(true);
        } catch (error) {
          console.error(error);
          if (error.code === "INVALID_ARGUMENT") {
            setErrorMessage("");
          } else {
            setErrorMessage(error.message);
          }
          setIsConnect(false);
        }
      }
    })();
  }, [random, diceWithSigner, accounts, pedding]);

  // setInterval(() => {
  //   setRandom(Math.random());
  // }, 1000);

  //console.log({ isConnect });

  return (
    <div className="bg-[url('./rRo702.gif')] m-0 bg-cover h-screen p-4">
      {!isConnect ? (
        <button
          className="flex text-xl border border-white bg-transparent text-white rounded-md px-4 py-2 m-2 ml-auto transition duration-500 ease select-none hover:bg-white/[.2] focus:outline-none focus:shadow-outline"
          onClick={handleConnectButton}
        >
          Connect MetaMask
        </button>
      ) : null}

      <div className="text-2xl flex flex-col justify-center my-10 mx-auto w-3/4 p-10 border-4 border-solid rounded-lg text-white bg-gray-500/[.2]">
        <h1 className="flex mx-auto">
          Your balance: {parseFloat(balance).toFixed(2)} DCE
        </h1>
        <PlayForm
          signer={signer}
          diceWithSigner={diceWithSigner}
          setErrorMessage={setErrorMessage}
          setPedding={setPedding}
          setTxStatus={setTxStatus}
          isConnect={isConnect}
          pedding={pedding}
        />
        <EventList
          signer={signer}
          setPedding={setPedding}
          pedding={pedding}
          log={log}
          setLog={setLog}
        />
      </div>
      <div className="text-red-500 bg-gray-500/[.2] text-2xl flex flex-col justify-center my-10 mx-auto w-3/4 p-10 border-4 border-solid rounded-lg">
        {errorMessage}
        {txStatus === 1 && log[log.length - 1] ? (
          
          <p className="text-white flex justify-center">
            {log[log.length - 1].result === "2"
              ? log[log.length - 1].number + " WIN!"
              : log[log.length - 1].number + " LOOSE :("}
          </p>
        ) : null}
        {txStatus === 0 ? (
          <p className="flex justify-center">Transaction failed!</p>
        ) : null}
        {pedding ? (
          <p className="text-white flex justify-center">
            Transition pending...
          </p>
        ) : null}
        {isConnect ? (
          <p className="text-white flex justify-center py-4">
            Connected: {accounts}
          </p>
        ) : <button
        className="flex text-xl border text-center justify-center border-white bg-transparent text-white rounded-md px-auto py-2 m-2 transition duration-500 ease select-none hover:bg-white/[.2] focus:outline-none focus:shadow-outline"
        onClick={handleConnectButton}
      >
        Connect MetaMask
      </button>}
      </div>
    </div>
  );
}

export default App;
