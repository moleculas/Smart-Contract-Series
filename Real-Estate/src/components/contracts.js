import Web3 from "web3";
import Factory from "../abis/Factory.json";
import HomeTransaction from "../abis/HomeTransaction.json";
const { getEthPriceNow } = require('get-eth-price');

const web3 = new Web3(window.ethereum);

export const factory = new web3.eth.Contract(
  Factory.abi,
  // '0xa100E52ED07d2d1485C647dAcf3E0495b4ee388D'
  // '0x9621a96639aB0deCf91dfb7979a4492F06EE0F28'
 // '0x8a678d432d7b1d9bf90ceb485d7f62848ee7cdbd'
  '0x36c74b90019F3751321Cfb1233738652816168a9'
);

export const getAccount = async () => (await web3.eth.getAccounts())[0];

export const getHomeTransactions = async () =>
  (await factory.methods.getInstances().call()).map(
    contract => new web3.eth.Contract(HomeTransaction.abi, contract)
  );

export const getCambioEuros = getEthPriceNow()
  .then(data => {
    const valores = (Object.values(data))
    const objA = valores[0]
    const { ETH: { EUR } } = objA
    return EUR
  })

  export const getAddressImmobiliaria = '0x4A92dBA29a7A9D099B3F8315CAEAcC6a767510F9';
 
