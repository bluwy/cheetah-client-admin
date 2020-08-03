import React from 'react';
import { useRouteMatch, Link as RouterLink } from 'react-router-dom';
import {
  makeStyles,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Home as HomeIcon } from '@material-ui/icons';

const drawerWidth = 240;

const useStyles = makeStyles({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
});

function Dashboard() {
  const routeMatch = useRouteMatch();
  const classes = useStyles();

  return (
    <div>
      <Drawer
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem button component={RouterLink} to={`${routeMatch.url}`}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default Dashboard;
