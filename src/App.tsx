import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

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
          Sudo
        </Route>
        <Route path="/dashboard">
          Dashboard
        </Route>
        <Route>404</Route>
      </Switch>
    </main>
  );
}

export default App;
