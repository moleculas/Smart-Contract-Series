import React, { Component, useEffect, useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import { factory, getAccount, getCambioEuros, getAddressImmobiliaria } from "../contracts";
import JSONTree from "react-json-tree";
import logoImmobiliaria from '../images/logo.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from "web3";
import { openModal, closeModal } from "../gestioModals";
import Modal from '../Modal';

const web3 = new Web3(window.ethereum);
const $ = window.$;

const HomeTransaction = ({ homeTransaction, index }) => {
    const [contenido, setContenido] = useState('');
    useEffect(() => {
        (async () => {
            if (homeTransaction) {
                const estat = await homeTransaction.methods.contractState().call();
                switch (estat) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        setContenido(<span className="badge badge-warning">Pendent</span>)
                        break;
                    case 4:
                        setContenido(<span className="badge badge-success">Finalitzat</span>)
                        break;
                    case 5:
                        setContenido(<span className="badge badge-danger">Rebutjat</span>)
                        break;
                    default:
                }
            }
        })();
    }, [homeTransaction]);
    return (
        <Link to={`/${index}`} className="list-group-item list-group-item-action flex-column align-items-start" key={index}>
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{`Contracte #${index}`}</h5>
                <span>{contenido}</span>
            </div>
            <div><code className="mb-1">{homeTransaction.options.address}</code></div>
        </Link>
    );
};

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {
                address: "",
                zip: "",
                observacions: "",
                realtorFee: "",
                price: "",
                seller: "",
                buyer: "",
                conversor: ""
            },
            menu: 'llistar',
            textTooltip: '',
            searchTerm: '',
            isSearching: false
        };
        this.manejarCambio = this.manejarCambio.bind(this);
        this.manejarModal = this.manejarModal.bind(this);
        this.manejarEnvioDeFormulario = this.manejarEnvioDeFormulario.bind(this);
        this.manejarError = this.manejarError.bind(this);
        this.createContract = this.createContract.bind(this);
        this.gestBotonera = this.gestBotonera.bind(this);
        this.manejarTooltip = this.manejarTooltip.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);            
    }

    handleChangeSearch = event => {
        if (this.state.searchTerm === '' ) {            
            this.setState({
                searchTerm: event.target.value
            });
        }else{           
            this.setState({
                isSearching: false
            });
            this.setState({
                searchTerm: event.target.value
            });
        }
    };

    handleSubmitSearch = event => {
        event.preventDefault()
        this.setState({
            isSearching: true
        });
    };

    gestBotonera = (estado) => {
        if (estado === 'llistar') {
            this.setState({
                menu: 'crear',
            });
        } else {
            this.setState({
                menu: 'llistar',
            });
        }
    }

    manejarTooltip = () => {
        setTimeout(() => {
            $('[data-toggle="tooltip"]').tooltip('hide')
        }, 7000);
    }

    manejarModal = async (evento) => {
        evento.preventDefault();
        $('[data-toggle="tooltip"]').tooltip('hide')
        const cambioEuros = parseInt((await getCambioEuros) * 1000);
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                conversor: cambioEuros
            }
        }))

        if (!this.state.form.address.trim()) {
            this.setState({
                textTooltip: "Aquest camp no pot estar buit",
            });
            $('#tooltip-adr').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (!this.state.form.zip.trim()) {
            this.setState({
                textTooltip: "Aquest camp no pot estar buit",
            });
            $('#tooltip-cod').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (isNaN(this.state.form.zip)) {
            this.setState({
                textTooltip: "Format incorrecte",
            });
            $('#tooltip-cod').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (!this.state.form.realtorFee.trim()) {
            this.setState({
                textTooltip: "Aquest camp no pot estar buit",
            });
            $('#tooltip-comi').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (isNaN(this.state.form.realtorFee)) {
            this.setState({
                textTooltip: "Format incorrecte",
            });
            $('#tooltip-comi').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (this.state.form.realtorFee > 100) {
            this.setState({
                textTooltip: "Comissió incorrecta",
            });
            $('#tooltip-comi').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (isNaN(this.state.form.price)) {
            this.setState({
                textTooltip: "Format incorrecte",
            });
            $('#tooltip-pre').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (!this.state.form.price.trim()) {
            this.setState({
                textTooltip: "Aquest camp no pot estar buit",
            });
            $('#tooltip-pre').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (!this.state.form.seller.trim()) {
            this.setState({
                textTooltip: "Aquest camp no pot estar buit",
            });
            $('#tooltip-ven').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (!this.state.form.buyer.trim()) {
            this.setState({
                textTooltip: "Aquest camp no pot estar buit",
            });
            $('#tooltip-com').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (!web3.utils.isAddress(this.state.form.seller)) {
            this.setState({
                textTooltip: "L'adreça ETH no és correcta",
            });
            $('#tooltip-ven').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        if (!web3.utils.isAddress(this.state.form.buyer)) {
            this.setState({
                textTooltip: "L'adreça ETH no és correcta",
            });
            $('#tooltip-com').tooltip('show')
            this.manejarTooltip()
            this.manejarError()
            return
        }
        const elModal = document.querySelector('#exampleModal');
        openModal(elModal);
    }

    manejarEnvioDeFormulario(decision) {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            closeModal(modal);
        }
        if (decision) {
            this.createContract()
        }
    }

    createContract = async () => {
        const from = await getAccount();
        const adressImmobiliaria = getAddressImmobiliaria
        const cambioEuros = this.state.form.conversor
        const precioRegEth = (this.state.form.price / (cambioEuros / 1000)).toString()
        const precioRegWei = web3.utils.toWei(precioRegEth, 'ether')
        const comissio = parseInt((precioRegWei * this.state.form.realtorFee) / 100).toString()

        factory.methods
            .create(
                this.state.form.address,
                this.state.form.zip,
                this.state.form.city,
                this.state.form.observacions,
                comissio,
                precioRegWei,
                cambioEuros,
                adressImmobiliaria,
                this.state.form.seller,
                this.state.form.buyer
            )
            .send({ from })
            .on('transactionHash', function (hash) {
                const elModal2 = document.querySelector('#modal-spinner');
                openModal(elModal2);
            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log('confirmation: ' + confirmationNumber);
                if (confirmationNumber === 1) {
                    toast.success('Contracte creat', {
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

    manejarCambio(evento) {
        const clave = evento.target.id;
        var valor;
        valor = evento.target.value;

        this.setState(state => {
            const formActualizado = state.form;
            formActualizado[clave] = valor;
            return {
                form: formActualizado
            }

        });
    }
    manejarError() {
        toast.error("Hi ha hagut un error en l'enviament. Algun dels camps és incorrecte.");
    }
    render() {

        return (
            <div>
                <Modal />
                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Són correctes les dades?</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <ul className="list-group">
                                    <li className="list-group-item"><mark><strong>Adreça:</strong></mark> {this.state.form.address}</li>
                                    <li className="list-group-item"><mark><strong>Codi postal:</strong></mark> {this.state.form.zip}</li>
                                    <li className="list-group-item"><mark><strong>Ciutat:</strong></mark> {this.state.form.city}</li>
                                    <li className="list-group-item"><mark><strong>Comissió immobiliària (%):</strong></mark> {this.state.form.realtorFee}</li>
                                    <li className="list-group-item"><mark><strong>Preu immoble (€):</strong></mark> {this.state.form.price}</li>
                                    <li className="list-group-item"><mark><strong>Adreça ETH venedor:</strong></mark> <code>{this.state.form.seller}</code></li>
                                    <li className="list-group-item"><mark><strong>Adreça ETH comprador:</strong></mark> <code>{this.state.form.buyer}</code></li>
                                    <li className="list-group-item"><mark><strong>Observacions:</strong></mark> {this.state.form.observacions}</li>

                                </ul>
                                <div className="alert alert-primary mt-3" role="alert">En el moment de generar el contracte 1 ETH val: {(this.state.form.conversor) / 1000} €</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.manejarEnvioDeFormulario.bind(this, false)} className="btn btn-danger cerrar-modal" data-dismiss="modal">Corregir</button>
                                <button type="button" onClick={this.manejarEnvioDeFormulario.bind(this, true)} className="btn btn-success">És correcte</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Modal --> */}
                <div className="container-fluid mt-5 col-6">
                    <p>&nbsp;</p>
                    <ToastContainer></ToastContainer>
                    <div className="justify-content-center ">
                        <div className="card">
                            <div className="card-header d-flex w-100 justify-content-between ">
                                <h6 className="pt-2">Creador de contractes immobiliàris SMART CONTRACTS BARCELONA</h6>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" onClick={this.gestBotonera.bind(this, 'llistar')} className="btn btn-primary"> <i className="fas fa-home"></i> Crear Contacte</button>
                                    <button type="button" onClick={this.gestBotonera.bind(this, 'crear')} className="btn btn-primary"> <i className="fas fa-list"></i> Llistar Contractes</button>
                                </div>

                            </div>
                            <div className="card-body">
                                <img style={{ width: '40%' }} src={logoImmobiliaria} alt="LogoImmobiliaria" />
                                <hr />
                                {this.state.menu === 'llistar' ? (
                                    <div>
                                        <nav className="navbar navbar-light bg-light">
                                            <span className="navbar-brand">Llistat de contractes</span>
                                            <form
                                                className="form-inline"
                                                onSubmit={this.handleSubmitSearch}
                                            >
                                                <input
                                                    className="form-control mr-sm-2"
                                                    type="search"
                                                    placeholder=""
                                                    aria-label="Search"
                                                    value={this.state.searchTerm}
                                                    onChange={this.handleChangeSearch}
                                                />
                                                <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Cercar</button>
                                            </form>
                                        </nav>
                                        <div className="list-group mt-4">
                                            {
                                                !this.state.isSearching ? (
                                                    this.props.homeTransactions &&
                                                    this.props.homeTransactions.map((homeTransaction, index) => (
                                                        <HomeTransaction homeTransaction={homeTransaction} key={index} index={index}/>
                                                    ))
                                                ) : (
                                                    this.props.homeTransactions &&
                                                    this.props.homeTransactions.filter(item => item.options.address === this.state.searchTerm).map((homeTransaction, index) => (
                                                        <HomeTransaction homeTransaction={homeTransaction} key={index} index={index} />
                                                    ))
                                                )
                                            }
                                        </div>
                                    </div>
                                ) : (<div>
                                    <nav className="navbar navbar-light bg-light">
                                        <span className="navbar-brand">Crear Contrate Immobiliari</span>
                                    </nav>

                                    <p className="card-text mt-3">Introduïu les dades d'inici del contracte:</p>
                                    <form id="formulari" className="col s12 contenedor" onSubmit={this.manejarModal}>
                                        <div className="form-group mr-sm-2">

                                            <div className="input-group mb-2 row">
                                                <div className="input-group-prepend col">
                                                    <span id="tooltip-adr" data-toggle="tooltip" data-placement="left" title={this.state.textTooltip}></span>
                                                    <span className="input-group-text tipo-inputs" style={{ width: '100%' }}>Adreça</span>
                                                </div>
                                                <div className="col-8" style={{ marginLeft: '-20px' }}>
                                                    <input
                                                        id="address"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={this.manejarCambio}
                                                        defaultValue={this.state.form.address}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group mb-2 row">
                                                <div className="input-group-prepend col">
                                                    <span id="tooltip-cod" data-toggle="tooltip" data-placement="left" title={this.state.textTooltip}></span>
                                                    <span className="input-group-text tipo-inputs" style={{ width: '100%' }}>Codi postal</span>
                                                </div>
                                                <div className="col-8" style={{ marginLeft: '-20px' }}>
                                                    <input
                                                        id="zip"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={this.manejarCambio}
                                                        defaultValue={this.state.form.zip}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group mb-2 row">
                                                <div className="input-group-prepend col">
                                                    <span id="tooltip-ciu" data-toggle="tooltip" data-placement="left" title={this.state.textTooltip}></span>
                                                    <span className="input-group-text tipo-inputs" style={{ width: '100%' }}>Ciutat</span>
                                                </div>
                                                <div className="col-8" style={{ marginLeft: '-20px' }}>
                                                    <input
                                                        id="city"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={this.manejarCambio}
                                                        defaultValue={this.state.form.city}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group mb-2 row">
                                                <div className="input-group-prepend col">
                                                    <span id="tooltip-comi" data-toggle="tooltip" data-placement="left" title={this.state.textTooltip}></span>
                                                    <span className="input-group-text tipo-inputs" style={{ width: '100%' }}>Comissió immobiliària (%)</span>
                                                </div>
                                                <div className="col-8" style={{ marginLeft: '-20px' }}>
                                                    <input
                                                        id="realtorFee"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={this.manejarCambio}
                                                        defaultValue={this.state.form.realtorFee}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group mb-2 row">
                                                <div className="input-group-prepend col">
                                                    <span id="tooltip-pre" data-toggle="tooltip" data-placement="left" title={this.state.textTooltip}></span>
                                                    <span className="input-group-text tipo-inputs" style={{ width: '100%' }}>Preu immoble (€)</span>
                                                </div>
                                                <div className="col-8" style={{ marginLeft: '-20px' }}>
                                                    <input
                                                        id="price"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={this.manejarCambio}
                                                        defaultValue={this.state.form.price}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group mb-2 row">
                                                <div className="input-group-prepend col">
                                                    <span id="tooltip-ven" data-toggle="tooltip" data-placement="left" title={this.state.textTooltip}></span>
                                                    <span className="input-group-text tipo-inputs" style={{ width: '100%' }}>Adreça ETH venedor</span>
                                                </div>
                                                <div className="col-8" style={{ marginLeft: '-20px' }}>
                                                    <input
                                                        id="seller"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={this.manejarCambio}
                                                        defaultValue={this.state.form.seller}
                                                    />

                                                </div>
                                            </div>
                                            <div className="input-group mb-2 row">
                                                <div className="input-group-prepend col">
                                                    <span id="tooltip-com" data-toggle="tooltip" data-placement="left" title={this.state.textTooltip}></span>
                                                    <span className="input-group-text tipo-inputs" style={{ width: '100%' }}>Adreça ETH comprador</span>
                                                </div>
                                                <div className="col-8" style={{ marginLeft: '-20px' }}>
                                                    <input
                                                        id="buyer"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={this.manejarCambio}
                                                        defaultValue={this.state.form.buyer}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group mb-2 row">
                                            <div className="input-group-prepend col">
                                                <span className="input-group-text tipo-inputs" style={{ width: '100%' }}>Observacions</span>
                                            </div>
                                            <div className="col-8" style={{ marginLeft: '-20px' }}>
                                                <textarea
                                                    id="observacions"
                                                    className="form-control"
                                                    onChange={this.manejarCambio}
                                                    defaultValue={this.state.form.observacions}
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <button type="submit" className="btn btn-primary btn-block">Generar Smart Contract</button>
                                        </div>
                                    </form>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <p>&nbsp;</p>
                </div>
            </div>
        );
    }
}

export default withRouter(Main);
