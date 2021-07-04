import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Crowdfunding from '../abis/Crowdfunding.json';
import Navbar from './Navbar';
import Principal from './Principal';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()

    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Crowdfunding.networks[networkId]

    if (networkData) {
      const crowdfundingNetwork = new web3.eth.Contract(Crowdfunding.abi, networkData.address)
      this.setState({ crowdfundingNetwork })
      const balance_M_InWei = await web3.eth.getBalance(accounts[0])
      const balance_M_InEth = web3.utils.fromWei(balance_M_InWei, 'ether');
      this.setState({ balanceCuentaMecenas: balance_M_InEth })
      this.setState({ loading: false })
      const elArtistaAddress = await crowdfundingNetwork.methods.artista().call()
      const balance_A_InWei = await web3.eth.getBalance(elArtistaAddress)
      const balance_A_InEth = web3.utils.fromWei(balance_A_InWei, 'ether');
      this.setState({ balanceCuentaArtista: balance_A_InEth })


    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }
  setMecenas(elNombre, elApellido, laAportacion) {
    this.setState({ loading: true })
    // this.state.crowdfundingNetwork.methods.setMecenas(elNombre, elApellido).send({from:this.state.account, value: 1000000000000000000})
    //  this.setState({ loading: false })         
    // this.state.crowdfundingNetwork.methods.setMecenas(elNombre, elApellido).send({ from: this.state.account,  value: 1000000000000000000 })
    // .once('receipt', (receipt) => {
    //  this.setState({ loading: false })     
    // })

    this.state.crowdfundingNetwork.methods.setMecenas(elNombre, elApellido, laAportacion).send({ from: this.state.account, value: laAportacion })
      .on('transactionHash', (hash) => {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })

  };

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      crowdfundingNetwork: null,
      balanceCuentaMecenas: '0',
      balanceCuentaArtista: '0',
      loading: true
    }
    this.setMecenas = this.setMecenas.bind(this)

  }

  render() {
    return (
      <div>
        <Navbar
          account={this.state.account}
          balanceCuentaMecenas={this.state.balanceCuentaMecenas}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Cargando...</p></div>
          : <Principal
            balanceCuentaMecenas={this.state.balanceCuentaMecenas}
            balanceCuentaArtista={this.state.balanceCuentaArtista}
            setMecenas={this.setMecenas}
          />
        }

      </div>
    );
  }
}

export default App;
