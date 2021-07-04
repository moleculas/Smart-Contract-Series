import React, { useState, useEffect } from "react";
import { Switch, Route, Link, useParams, withRouter, Redirect } from "react-router-dom";
import cx from "classnames";
import "./Contract.scss";
import JSONTree from "react-json-tree";
import Seller from "../componentes/Seller";
import Buyer from "../componentes/Buyer";
import Coop from "../componentes/Coop";
import { getAccount, getAddressImmobiliaria } from "../contracts";
import Web3 from "web3";

const web3 = new Web3(window.ethereum);

const timeline = [
  { text: "Contracte creat" },
  { text: "El venedor signa el contracte" },
  { text: "El comprador signa el contracte i paga el dipòsit (10% del preu)" },
  { text: "L’agent immobiliari signa el contracte" },
  { text: "El comprador fa el pagament restant i finalitza la transacció" }
];

const Contract = ({ homeTransaction, ...props }) => {
  const { index } = useParams();
  const [progress, setProgress] = useState(10);
  const [contractState, setContractState] = useState(null);
  const [timelineProgress, setTimelineProgress] = useState(1);
  const [claseBotonCom, setClaseBotonCom] = useState('disabled');
  const [claseBotonVen, setClaseBotonVen] = useState('disabled');
  const [claseBotonImm, setClaseBotonImm] = useState('disabled');
  const [tipoBotonCom, setTipoBotonCom] = useState('');
  const [tipoBotonVen, setTipoBotonVen] = useState('');
  const [tipoBotonImm, setTipoBotonImm] = useState('');
  const [form, setForm] = useState({});
  const [contenido, setContenido] = useState('');
  const [didMount, setDidMount] = useState(false);
  const [totCorrecte, setTotCorrecte] = useState(false);
  const [esImmo, setEsImmo] = useState(false);

  const updateProgress = index => {
    const percent = index / timeline.length;
    setProgress(Math.min(percent * 100, 100));
    setTimelineProgress(index);
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const addressDetectada = await getAccount()
        const res = await homeTransaction.methods.contractState().call();
        setContractState(parseInt(res, 10));
        switch (res) {
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
        const elSellerAddress = await homeTransaction.methods.seller().call()
        const elBuyerAddress = await homeTransaction.methods.buyer().call()
        const elAddress = await homeTransaction.methods.homeAddress().call()
        const elZip = await homeTransaction.methods.zip().call()
        const elCity = await homeTransaction.methods.city().call()
        const cambioEuros = (await homeTransaction.methods.conversor().call()) / 1000;
        const priceInWei = await homeTransaction.methods.price().call();
        const priceInEth = web3.utils.fromWei(priceInWei.toString(), 'ether')
        const elPrice = parseInt(priceInEth * cambioEuros)
        setForm({
          address: elAddress,
          zip: elZip,
          city: elCity,
          seller: elSellerAddress,
          buyer: elBuyerAddress,
          price: elPrice
        })

        if (addressDetectada === elSellerAddress || addressDetectada === elBuyerAddress || addressDetectada === getAddressImmobiliaria) {
          setTotCorrecte(true)
        } else {
          setTimeout(() => {
            props.history.push('/back')
          }, 100);
        }

        if (addressDetectada === getAddressImmobiliaria) {
          setEsImmo(true)
        }

        if (addressDetectada === elSellerAddress) {
          setTipoBotonCom('btn-secondary')
          setTipoBotonVen('btn-primary')
          setTipoBotonImm('btn-secondary')
        } else if (addressDetectada === elBuyerAddress) {
          setTipoBotonCom('btn-primary')
          setTipoBotonVen('btn-secondary')
          setTipoBotonImm('btn-secondary')
        } else {
          setTipoBotonCom('btn-secondary')
          setTipoBotonVen('btn-secondary')
          setTipoBotonImm('btn-primary')
        }
        switch (res) {
          case 0:
            setClaseBotonCom('disabled')
            if (addressDetectada === elSellerAddress) {
              setClaseBotonVen('')
            }
            setClaseBotonImm('disabled')
            break;
          case 1:
            if (addressDetectada === elBuyerAddress) {
              setClaseBotonCom('')
            }
            setClaseBotonVen('disabled')
            setClaseBotonImm('disabled')
            break;
          case 2:
            setClaseBotonCom('disabled')
            setClaseBotonVen('disabled')
            if ((addressDetectada !== elBuyerAddress) && (addressDetectada !== elSellerAddress)) {
              setClaseBotonImm('')
            }
            break;
          case 3:
            if (addressDetectada === elBuyerAddress) {
              setClaseBotonCom('')
            }
            setClaseBotonVen('disabled')
            setClaseBotonImm('disabled')
            break;
          default:
        }

      } catch (error) {
        console.log(error)
      }
    }
    obtenerDatos()
  }, [homeTransaction, props.history])

  useEffect(() => {
    updateProgress(parseInt(contractState, 10) + 1);
  }, [contractState])

  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, [])

  if (!didMount) {
    return null;
  } else {
    return (
      <div>
        {
          totCorrecte ? (
            <div className="container-fluid mt-5">
              <p>&nbsp;</p>
              <div className="row d-flex justify-content-center">
                <div className="card">
                  <div className="card-header">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">{`Estat del Contracte #${index}`}</h5>
                      <code className="mt-1">  {homeTransaction.options.address}</code>
                    </div>
                  </div>
                  <div className="card-body">
                    <Route
                      exact
                      path="/:addr"
                      render={() => (
                        <div className="btn-group mt-3 d-flex" role="group" aria-label="Basic example">
                          <Link
                            to={`/${index}/buyer`}
                            className={`btn ${tipoBotonCom} w-100 ml-2 ${claseBotonCom}`}
                          >
                            Comprador
                      </Link>
                          <Link
                            to={`/${index}/seller`}
                            className={`btn ${tipoBotonVen} w-100 ${claseBotonVen}`}
                          >
                            Venedor
                      </Link>
                          <Link
                            to={`/${index}/coop`}
                            className={`btn ${tipoBotonImm} w-100 mr-2 ${claseBotonImm}`}
                          >
                            Immobiliària
                    </Link>
                        </div>
                      )}
                    />
                    <Route
                      path="/:addr/buyer"
                      render={() => (
                        <Buyer
                          homeTransaction={homeTransaction}
                          contractState={contractState}
                        />
                      )}
                    />
                    <Route
                      path="/:addr/seller"
                      render={() => (
                        <Seller contractState={contractState} instance={homeTransaction} />
                      )}
                    />
                    <Route
                      path="/:addr/coop"
                      render={() => (
                        <Coop
                          contractState={contractState}
                          homeTransaction={homeTransaction}
                        />
                      )}
                    />
                    <div className="Timeline">
                      {timeline.map((point, i) => (
                        <div
                          key={i}
                          className={cx("Timeline-point", {
                            done: timelineProgress > i,
                            "in-progress": timelineProgress === i,
                            reject: contractState === 5
                          })}
                        >
                          {i + 1}. {point.text}
                        </div>
                      ))}
                      {contractState === 5 && (
                        <div className={cx("Timeline-point failed")}>
                          <div className="alert alert-danger mt-3" role="alert">Contracte rebutjat.</div>
                        </div>
                      )}
                    </div>
                    <div className="ProgressBar-container">
                      <div className="ProgressBar-background"></div>
                      <div
                        className={cx('ProgressBar-progress', {
                          reject: contractState === 5,
                        })}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p>&nbsp;</p>
                    <div className="card border-light mb-1">
                      <div className="card-header">
                        <div className="d-flex w-100 justify-content-between">
                          <p className="mb-1">Dades del contracte</p>
                          <span>{contenido}</span>
                        </div>

                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item p-1"><small>Immoble: </small><small className="text-muted">{form.address} ({form.zip}) {form.city}</small></li>
                          <li className="list-group-item p-1"><small>Venedor: </small><small className="text-muted">{form.seller}</small></li>
                          <li className="list-group-item p-1"><small>Comprador: </small><small className="text-muted">{form.buyer}</small></li>
                          <li className="list-group-item p-1"><small>Preu de venda: </small><small className="text-muted">{`${form.price}€`}</small></li>
                        </ul>
                        <a className="btn btn-outline-secondary btn-sm mt-3" href={`https://rinkeby.etherscan.io/address/${homeTransaction.options.address}`} target="_blank" rel="noopener noreferrer" role="button">Contracte a la blockchain</a>
                      </div>
                    </div>
                    {
                      esImmo ? (
                        <Route
                          exact
                          path="/:addr"
                          render={() => (
                            <Link
                              to={`/`}
                              className="btn btn-primary btn-block"
                            >
                              Tornar a l'inici
                            </Link>
                          )}
                        />
                      ) : <div></div>
                    }

                    <Route
                      // path="/:addr/seller"
                      path={["/:addr/seller", "/:addr/buyer", "/:addr/coop"]}
                      render={() => (
                        <Link
                          to={`/${index}`}
                          className="btn btn-primary btn-block"
                        >
                          Tornar al contracte
                        </Link>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )
        }
      </div>
    );
  }
}

export default withRouter(Contract);