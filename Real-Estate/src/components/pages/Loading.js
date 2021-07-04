import React from "react";
import JSONTree from "react-json-tree";


const Loading = ({ web3error }) => {
  if (web3error) {
    return (
      <>
        <div className="alert alert-danger" role="alert">S'ha produït un error en connectar-se a la xarxa ether.</div>
        {/* <span>
          <JSONTree data={web3error} />
        </span> */}
      </>
    );
  }

  return <span>Carregant...</span>;
};

export default Loading;
