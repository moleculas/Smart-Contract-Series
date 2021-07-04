import React from "react";
import { Route, BrowserRouter as Router, Switch, Redirect, withRouter} from "react-router-dom";
import Main from "./pages/Main";
import Contract from "./pages/Contract";
import Loading from "./pages/Loading";
import Back from "./pages/Back";

const AppRouter = ({ account, homeTransactions, web3error }) => {
  if (!account || !homeTransactions) {
    return <Loading web3error={web3error} />;
  }
  const numeroContractes = homeTransactions.length;  

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Main homeTransactions={homeTransactions} />}
        />
        <Route
          path="/back"
          render={() => <Back />}
        />
        <Route
          path="/:index"
          render={({
            match: {
              params: { index }
            }
          }) => (
            index < numeroContractes ? (
              <Contract
                homeTransaction={homeTransactions && homeTransactions[index]}               
              />
            ) : (<Redirect to="/back" render={() => <Back />}/>)
          )}
        />    
      </Switch>
    </Router>
  );
};

export default AppRouter;