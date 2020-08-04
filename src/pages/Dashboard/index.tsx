import React from 'react';
import {
  useRouteMatch,
  Link as RouterLink,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import {
  AuthLogoutMutation as LogoutM,
  AuthLogoutMutationVariables as LogoutV,
} from '/@/schema';
import {
  makeStyles,
  Box,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
} from '@material-ui/icons';
import DashboardSettings from './Settings';

const LOGOUT = gql`
  mutation AuthLogout {
    adminLogout
  }
`;

const drawerWidth = 240;

const useStyles = makeStyles({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerGrid: {
    height: '100%',
  },
});

function Dashboard() {
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const [logout, { loading }] = useMutation<LogoutM, LogoutV>(LOGOUT);

  const classes = useStyles();

  const handleLogout = () => {
    if (!loading) {
      // No need to await, just assume that it'll work and got to login page
      logout();
      history.push('/login');
    }
  };

  return (
    <Grid container>
      <Drawer
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
        variant="permanent"
        anchor="left"
      >
        <Grid className={classes.drawerGrid} container direction="column" justify="space-between">
          <List>
            <ListItem button component={RouterLink} to={`${routeMatch.url}`}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItem>
          </List>
          <List>
            <ListItem button component={RouterLink} to={`${routeMatch.url}/settings`}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </ListItem>
          </List>
        </Grid>
      </Drawer>
      <Box p={2}>
        <Switch>
          <Route path={`${routeMatch.url}/settings`} component={DashboardSettings} />
          <Route>Home</Route>
        </Switch>
      </Box>
    </Grid>
  );
}

export default Dashboard;
