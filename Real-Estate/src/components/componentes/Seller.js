import React, { useState, useEffect } from "react";
import { getAccount } from "../contracts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { openModal, closeModal } from "../gestioModals";
import Modal from '../Modal';

export default function Seller({ contractState, instance }) {

  const sellerSignContract = async () => {
    const account = await getAccount();
    instance.methods.sellerSignContract().send({ from: account })
      .on('transactionHash', function (hash) {
        const elModal2 = document.querySelector('#modal-spinner');
        openModal(elModal2);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        console.log('confirmation: ' + confirmationNumber);
        if (confirmationNumber === 1) {
          toast.success('Contracte signat', {
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
      {contractState === 0 ? (
        <>
          <p>Signar el contracte.</p>
          <button
            className="btn btn-primary btn-block"
            onClick={() => sellerSignContract()}>Signar</button>
        </>
      ) : (
        <div className="alert alert-primary" role="alert">Contracte signat, res més a fer.</div>
      )}
    </div>
  );
}
