import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Sudo from './pages/Sudo';
import Dashboard from './pages/Dashboard';
import Null from './pages/Null';

function App() {
  return (
    <main>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/sudo" component={Sudo} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={Null} />
      </Switch>
    </main>
  );
}

export default App;
