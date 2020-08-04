import React from 'react';
import {
  useRouteMatch,
  Link as RouterLink,
  Switch,
  Route,
} from 'react-router-dom';
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
} from '@material-ui/icons';
import DashboardSettings from './Settings';

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
  const routeMatch = useRouteMatch();
  const classes = useStyles();

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
