import { ethers } from "ethers";
import { useEffect, useState } from "react";
import diceContract from "./connection";
import provider from "./provider";
import React from "react";

export default function EventList({
  signer,
  setPedding,
  pedding,
  log,
  setLog,
}) {
  const [renderedLog, setRenderedLog] = useState();
  //    const filter = {
  //         address: "0x8c47fE26385630D4De17B303a5Af3045827b7E73",
  //         topics: [
  //             playLog
  //         ]
  //     }
  useEffect(() => {
    console.log("test2");

    const logger = diceContract.on(
      "playLog",
      (player, number, _direction, value, _result) => {
        const values = { number, player, _result };
        setLog([
          ...log,
          {
            number: number.toString(),
            player: player.toString(),
            result: _result.toString(),
            value: (value / 1000000000000000000).toString(),
            direction: _direction.toString(),
          },
        ]);
      }
    );
    setRenderedLog(eventListRender());
    // console.log(
    //     diceContract.filters.playLog("0x8c47fE26385630D4De17B303a5Af3045827b7E73")
    // )
  }, [pedding, log]);

  const eventListRender = () => {
    return log.map((rol) => {
      return (
        <li>
          Number: {rol.number} | Result: {rol.result === "2" ? "win" : "loose"}{" "}
          | direction: {rol.direction} | total: {rol.value}
        </li>
      );
    });
  };

  const errorLog = {};

  const logger = diceContract.on(
    "playLog",
    (player, number, _direction, value, _result) => {
      const values = { number, player, _result };
      setLog([
        ...log,
        {
          number: number.toString(),
          player: player.toString(),
          result: _result.toString(),
          value: (value / 1000000000000000000).toString(),
          direction: _direction.toString(),
        },
      ]);
    }
  );

  return (
    <>
      <ul className="flex justify-center flex-col-reverse mx-auto ">
        {renderedLog}
      </ul>
    </>
  );
}
