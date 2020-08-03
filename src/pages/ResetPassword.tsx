import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import {
  AuthResetPasswordMutation as ResetM,
  AuthResetPasswordMutationVariables as ResetV,
} from '/@/schema';
import { useLocationQuery } from '/@/utils';
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
  newPassword: string
}

const RESET_TOKEN_KEY = 'token';

const RESET_PASSWORD = gql`
  mutation AuthResetPassword($resetToken: String!, $newPassword: String!) {
    adminResetPassword(resetToken: $resetToken, newPassword: $newPassword)
  }
`;

const useStyles = makeStyles({
  grid: {
    height: '100vh',
  },
});

function useResetToken() {
  const history = useHistory();
  const query = useLocationQuery();
  const resetToken = query.get(RESET_TOKEN_KEY);

  if (!resetToken) {
    history.push('/login');
  }

  return resetToken;
}

function ResetPassword() {
  const history = useHistory();
  const { register, handleSubmit } = useForm<FormInput>();
  const [resetPassword, { loading, error }] = useMutation<ResetM, ResetV>(RESET_PASSWORD);

  const classes = useStyles();
  const resetToken = useResetToken();

  const onSubmit = async (data: FormInput) => {
    if (!resetToken) {
      return;
    }

    const result = await resetPassword({
      variables: {
        resetToken,
        newPassword: data.newPassword,
      },
    });

    if (result.data?.adminResetPassword) {
      history.push('/login');
    }
  };

  return (
    <Grid className={classes.grid} container justify="center" alignItems="center">
      <Card>
        <CardContent>
          <Box mb={2}>
            <Typography align="center">Enter your new password</Typography>
          </Box>
          {error && (
            <Alert severity="error">
              Unable to reset. The token may be expired.
            </Alert>
          )}
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Box my={2}>
              <TextField
                type="password"
                name="newPassword"
                autoComplete="new-password"
                label="New password"
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
              Confirm
            </Button>
          </form>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default ResetPassword;
