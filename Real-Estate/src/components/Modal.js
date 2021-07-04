import React, { Component } from 'react';

class Modal extends Component {

  render() {
    return (
        <div className="modal fade" id="modal-spinner" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered justify-content-center" role="document">
            <div className="alert alert-light d-flex w-80" role="alert">
                <span className="fa fa-spinner fa-spin fa-3x text-primary"></span>
                <h6 className="mt-3 pl-3 text-primary">Desplegant informació a la blockchain</h6>
            </div>

        </div>
    </div>
    );
  }
}

export default Modal;