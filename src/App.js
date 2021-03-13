import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import React, { useState, useEffect } from "react";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [prizeFund, setPrizeFund] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const prizeFund = await lottery.methods.getPrizeFund().call();
    setManager(manager);
    setPlayers(players);
    setPrizeFund(prizeFund);
  }, []);

  const onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting for transaction success");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether")
    });
    setMessage("You have been entered");
  };

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting for transaction success");

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    setMessage("We have a winner");
  };

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is manged by {manager}</p>
      <p>
        The following {players.length} players are playing for a prize frund of{" "}
        {web3.utils.fromWei(prizeFund, "ether")} Ether
      </p>

      <hr />
      <form onSubmit={onSubmit}>
        <h4>Wanna try your luck</h4>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "40%"
          }}
        >
          <label>Amount of Ether to enter</label>
          <input
            value={value}
            onChange={event => setValue(event.target.value)}
          ></input>
        </div>
        <button type="submit">Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={pickWinner}>Pick</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
