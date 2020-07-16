import React from "react";

import Create from "./component/create";
import Edit from "./component/edit";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
    <Switch>
      <Route exact path="/create">
        <Create/>
      </Route>
      <Route exact path="/edit">
        <Edit/>
      </Route>
    </Switch>
    </Router>
  );
}

export default App;
