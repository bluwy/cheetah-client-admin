import React, { useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  GetAppThemeQuery as AppThemeQ,
  GetAppThemeQueryVariables as AppThemeV,
} from './schema';
import AuthRouteGuard from './components/route/AuthRouteGuard';
import SnackbarProvider from './components/SnackbarProvider';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Sudo from './pages/Sudo';
import Dashboard from './pages/Dashboard';
import Null from './pages/Null';

const APP_THEME = gql`
  query GetAppTheme {
    appTheme @client
  }
`;

function App() {
  const { data } = useQuery<AppThemeQ, AppThemeV>(APP_THEME);

  const theme = useMemo(() => createMuiTheme({
    palette: {
      type: data?.appTheme as 'light' | 'dark',
    },
  }), [data]);

  return (
    <main>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <SnackbarProvider>
            <Switch>
              <Route path="/login">
                <AuthRouteGuard ifPass="/dashboard">
                  <Login />
                </AuthRouteGuard>
              </Route>
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/sudo" component={Sudo} />
              <Route path="/dashboard">
                <AuthRouteGuard ifFail="/login">
                  <Dashboard />
                </AuthRouteGuard>
              </Route>
              <Route component={Null} />
            </Switch>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </main>
  );
}

export default App;
