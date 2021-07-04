import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Principal extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <p>&nbsp;</p>
        <div className="row d-flex justify-content-center">
          <div className="card">
            <div className="card-header">
              Pasarela de pago Crowdfunding ArtikaWeb
      </div>
            <div className="card-body">
              <h5 className="card-title">Realizar pago</h5>
              <p className="card-text">Selecciona una cantidad en ether para aportar a la cuenta del artista.</p>
              <form onSubmit={(event) => {
                event.preventDefault()
                const nombre = this.nombreMecenas.value
                const apellidos = this.apellidosMecenas.value
                const cantidad = this.cantidadMecenas.value                
                this.props.setMecenas(nombre, apellidos, cantidad)
              }}>
                <div className="form-group mr-sm-2">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <label className="input-group-text" for="inputGroupSelect01">Opciones</label>
                    </div>
                    <select  ref={(input) => { this.cantidadMecenas = input }} className="custom-select" id="inputGroupSelect01">
                      <option selected>Elige...</option>
                      <option value="11000000000000000">0,011 ETH - 25 €</option>
                      <option value="22000000000000000">0,022 ETH - 50 €</option>
                      <option value="32000000000000000">0,032 ETH - 75 €</option>
                      <option value="43000000000000000">0,043 ETH - 100 €</option>
                    </select>
                  </div>
                  <input
                    id="nombreMecenas"
                    type="text"
                    ref={(input) => { this.nombreMecenas = input }}
                    className="form-control"
                    placeholder="Tu nombre..."
                    required />
                  <input
                    id="apellidosMecenas"
                    type="text"
                    ref={(input) => { this.apellidosMecenas = input }}
                    className="form-control mt-1"
                    placeholder="Tus apellidos..."
                    required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Pagar</button>
                <h3 className="card-text mt-3">Balance cuenta del artista: {this.props.balanceCuentaArtista} ETH.</h3>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Principal;