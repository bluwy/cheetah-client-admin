import React, { useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import {
  GetAppThemeQuery as AppThemeQ,
  GetAppThemeQueryVariables as AppThemeV,
} from './schema';
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
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/sudo" component={Sudo} />
          <Route path="/dashboard" component={Dashboard} />
          <Route component={Null} />
        </Switch>
      </ThemeProvider>
    </main>
  );
}

export default App;
