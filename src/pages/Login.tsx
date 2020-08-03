import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import {
  AuthLoginMutation as LoginM,
  AuthLoginMutationVariables as LoginV,
} from '/@/schema';
import {
  makeStyles,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

interface FormInput {
  username: string
  password: string
}

const LOGIN = gql`
  mutation AuthLogin($username: String!, $password: String!) {
    adminLogin(username: $username, password: $password)
  }
`;

const useStyles = makeStyles({
  grid: {
    height: '100vh',
  },
});

function Login() {
  const history = useHistory();
  const { register, handleSubmit } = useForm<FormInput>();
  const [login, { loading, error }] = useMutation<LoginM, LoginV>(LOGIN);

  const classes = useStyles();

  const onSubmit = async (data: FormInput) => {
    const result = await login({ variables: data });

    if (result.data?.adminLogin) {
      history.push('/dashboard');
    }
  };

  return (
    <Grid
      className={classes.grid}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Card>
        <CardContent>
          <Box mb={2}>
            <Typography align="center">Login to dashboard</Typography>
          </Box>
          {error && (
            <Alert severity="error">
              Invalid username or password
            </Alert>
          )}
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Box my={2}>
              <TextField
                name="username"
                label="Username"
                variant="outlined"
                fullWidth
                inputRef={register({ required: true })}
              />
            </Box>
            <Box my={2}>
              <TextField
                type="password"
                name="password"
                label="Password"
                variant="outlined"
                fullWidth
                inputRef={register({ required: true })}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
      <Box clone mt={1}>
        <Typography color="textSecondary" align="center">
          Forgot password?
          <br />
          Please contact the developer.
        </Typography>
      </Box>
    </Grid>
  );
}

export default Login;
