import React from 'react' ; 
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const App = () => {
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/connexion" component={Login} />
        <Route path="/accueil" exact component={Home} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;