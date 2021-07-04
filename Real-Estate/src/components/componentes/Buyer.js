import React, { useState, useEffect } from "react";
import { getAccount } from "../contracts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from "web3";
import { openModal, closeModal } from "../gestioModals";
import Modal from '../Modal';

const web3 = new Web3(window.ethereum);

const Buyer = ({ homeTransaction, contractState }) => {

  const [precioEur, setPrecioEur] = useState(null)
  const [depositEur, setDepositEur] = useState(null)
  const [precioEth, setPrecioEth] = useState(null)
  const [depositEth, setDepositEth] = useState(null)

  useEffect(() => {
    (async () => {
      if (homeTransaction) {
        //  const cambioEuros = await getCambioEuros
        const cambioEuros = (await homeTransaction.methods.conversor().call()) / 1000;
        const priceInWei = await homeTransaction.methods.price().call();
        const depositInWei = parseInt(priceInWei / 10)
        setPrecioEth(priceInWei)
        setDepositEth(depositInWei)
        const priceInEth = web3.utils.fromWei(priceInWei.toString(), 'ether')
        const priceInEur = parseInt(priceInEth * cambioEuros)
        const depositInEur = parseInt(priceInEur / 10)
        setPrecioEur(priceInEur)
        setDepositEur(depositInEur)
      }
    })();
  }, [homeTransaction]);
  const sign = async () => {
    const from = await getAccount();
    homeTransaction.methods
      .buyerSignContractAndPayDeposit()
      .send({ from, value: depositEth })
      .on('transactionHash', function (hash) {
        const elModal2 = document.querySelector('#modal-spinner');
        openModal(elModal2);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        console.log('confirmation: ' + confirmationNumber);
        if (confirmationNumber === 1) {
          toast.success('Contracte signat i dipòsit pagat', {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            window.location.reload();
          }, 3500);
        }
      })
  };
  const finalize = async () => {
    const from = await getAccount();
    const transFinal = (precioEth - (depositEth - 1000)).toString()
    homeTransaction.methods.buyerFinalizeTransaction().send({ from, value: transFinal })
      .on('transactionHash', function (hash) {
        const elModal2 = document.querySelector('#modal-spinner');
        openModal(elModal2);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        console.log('confirmation: ' + confirmationNumber);
        if (confirmationNumber === 1) {
          toast.success('Import pagat contracte finalitzat', {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            window.location.reload();
          }, 3500);
        }
      })
  };
  return (
    <div>
      <Modal />
      <ToastContainer></ToastContainer>
      {contractState == null && <p>Carregant...</p>}
      {contractState != null && contractState === 1 && (
        <>
          <p>Signar el contracte i pagar el dipòsit</p>
          <div>
            <button onClick={() => sign()} className="btn btn-primary btn-block">Signar</button>

          </div>
        </>
      )}
      {contractState != null && contractState === 3 && (
        <>
          <p>Fer el pagament i finalitzar contracte.</p>
          <div>
            <button onClick={() => finalize()} className="btn btn-primary btn-block mb-2">Finalitzar</button>
          </div>
        </>
      )}
      {contractState != null && contractState > 1 && contractState < 4 && <div><div className="alert alert-primary" role="alert">El dipòsit està pagat.</div></div>}
      {contractState != null && contractState === 4 && <div><div className="alert alert-primary" role="alert">Total de l'import pagat.</div></div>}
      <div className="d-flex w-100">
        <ul className="list-group mt-2 w-50">
          <li className="list-group-item">{`Preu: ${precioEur} €`}</li>        
        </ul>
        <ul className="list-group mt-2 w-50 pl-1">         
          <li className="list-group-item">{`Dipòsit: ${depositEur} €`}</li>
        </ul>
      </div>
    </div>
  );
};

export default Buyer;
