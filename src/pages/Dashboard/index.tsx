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
  People as PeopleIcon,
} from '@material-ui/icons';
import DashboardHome from './Home';
import DashboardSettings from './Settings';
import DashboardCustomers from './Customers';

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
  const [logout, { loading, client }] = useMutation<LogoutM, LogoutV>(LOGOUT, {
    fetchPolicy: 'no-cache',
  });

  const classes = useStyles();

  const handleLogout = async () => {
    if (!loading) {
      await logout();
      await client.clearStore();
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
            <ListItem button component={RouterLink} to={`${routeMatch.url}/customers`}>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText>Customers</ListItemText>
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
      <Box flexGrow={1} p={2}>
        <Switch>
          <Route path={`${routeMatch.url}/customers`} component={DashboardCustomers} />
          <Route path={`${routeMatch.url}/settings`} component={DashboardSettings} />
          <Route component={DashboardHome} />
        </Switch>
      </Box>
    </Grid>
  );
}

export default Dashboard;
