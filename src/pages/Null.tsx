import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  makeStyles,
  Box,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
  grid: {
    height: '100vh',
  },
});

function Null() {
  const classes = useStyles();

  return (
    <Grid className={classes.grid} container justify="center" alignItems="center">
      <Box textAlign="center">
        <Typography variant="h1">404</Typography>
        <Typography variant="body1">Page not found.</Typography>
        <Box marginTop={1}>
          <Typography variant="body2">
            Take me to
            {' '}
            <Link component={RouterLink} to="/login">login</Link>
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
}

export default Null;
