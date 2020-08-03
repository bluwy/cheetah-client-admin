import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Sudo from './pages/Sudo';
import Null from './pages/Null';

function App() {
  return (
    <main>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/reset-password">
          <ResetPassword />
        </Route>
        <Route path="/sudo">
          <Sudo />
        </Route>
        <Route path="/dashboard">
          Dashboard
        </Route>
        <Route>
          <Null />
        </Route>
      </Switch>
    </main>
  );
}

export default App;
