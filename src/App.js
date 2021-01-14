import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    accounts: []
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    //const whoami = await window.ethereum.request({ method: 'eth_accounts' });
    await window.ethereum.enable();
    const whoami = await web3.eth.getAccounts();
    console.log("eth accounts are", whoami);

    this.setState({ manager, players, balance, whoami });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on tx success..." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({ message: "Successfully entered into lottery!" });
  };

  onClick = async (event) => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on pickWinner success..." });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({ message: "Successfully picked a winner!" });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}
          There are currently {this.state.players.length} entered competing to
          win {web3.utils.fromWei(this.state.balance, "ether")} ether! BTW, it
          looks like you are {this.state.whoami}
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Try your luck</h4>
          <div>
            <label>Amount of ether to enter:</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner</button>

        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
