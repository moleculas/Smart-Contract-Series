import React from "react";
import { getAccount } from "../contracts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { openModal, closeModal } from "../gestioModals";
import Modal from '../Modal';

const Coop = ({ homeTransaction, contractState }) => {
  
  const confirm = async approved => {
    const from = await getAccount();
    homeTransaction.methods
      .realtorReviewedClosingConditions(approved)
      .send({ from })
      .on('transactionHash', function (hash) {
        const elModal2 = document.querySelector('#modal-spinner');
        openModal(elModal2);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        console.log('confirmation: ' + confirmationNumber);
        if (confirmationNumber === 1) {
          toast.success('Transacció confirmada', {
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
      {contractState != null && contractState === 2 && (
        <>
          <p>Aprovar la transacció.</p>
          <div className="d-flex justify-content-between">
          <button onClick={() => confirm(true)} className="w-50 btn btn-primary mr-1">Signar</button>
          <button onClick={() => confirm(false)} className="w-50 btn btn-danger ml-1">Declinar</button>
            
          </div>
        </>
      )}
      {contractState != null && contractState > 2 && <div className="alert alert-primary" role="alert">La transacció està confirmada.</div>}
    </div>
  );
};

export default Coop;
