import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import {
  AdminPrivilege,
  AuthCreateAdminMutation as CreateAdminM,
  AuthCreateAdminMutationVariables as CreateAdminV,
  AuthGetResetPasswordTokenMutation as GetResetTokenM,
  AuthGetResetPasswordTokenMutationVariables as GetResetTokenV,
} from '/@/schema';
import {
  makeStyles,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Tab,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  Alert,
  TabContext,
  TabList,
  TabPanel,
} from '@material-ui/lab';

interface CreateAdminFormInput {
  username: string
  password: string
  privilege: AdminPrivilege
}

interface ResetTokenFormInput {
  username: string
}

const CREATE_ADMIN = gql`
  mutation AuthCreateAdmin($sudoPassword: String!, $data: AdminCreateInput!) {
    adminCreate(sudoPassword: $sudoPassword, data: $data) {
      id
      username
    }
  }
`;

const GET_RESET_TOKEN = gql`
  mutation AuthGetResetPasswordToken($sudoPassword: String!, $username: String!) {
    adminGetResetPasswordToken(sudoPassword: $sudoPassword, username: $username)
  }
`;

const useStyles = makeStyles({
  grid: {
    height: '100vh',
  },
});

function useCreateAdminForm(sudoPassword: string) {
  const { register, handleSubmit } = useForm<CreateAdminFormInput>();
  const [
    createAdmin,
    { loading, error, data },
  ] = useMutation<CreateAdminM, CreateAdminV>(CREATE_ADMIN);

  const onSubmit = async (formData: CreateAdminFormInput) => {
    await createAdmin({
      variables: {
        sudoPassword,
        data: formData,
      },
    });
  };

  return (
    <div>
      {error && (
        <Alert severity="error">
          Password is incorrect
        </Alert>
      )}
      {data?.adminCreate && (
        <Alert severity="success">
          Created admin &quot;
          {data.adminCreate.username}
          &quot;
        </Alert>
      )}
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Box my={3}>
          <TextField
            name="username"
            autoComplete="username"
            label="Username"
            variant="outlined"
            fullWidth
            inputRef={register({ required: true })}
          />
        </Box>
        <Box my={3}>
          <TextField
            type="password"
            name="password"
            autoComplete="new-password"
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
          Confirm
        </Button>
      </form>
    </div>
  );
}

function useGetResetTokenForm(sudoPassword: string) {
  const { register, handleSubmit } = useForm<ResetTokenFormInput>();
  const [
    getResetToken,
    { loading, error, data },
  ] = useMutation<GetResetTokenM, GetResetTokenV>(GET_RESET_TOKEN);

  const resetLink = data?.adminGetResetPasswordToken
    ? window.location.host + data?.adminGetResetPasswordToken
    : undefined;

  const onSubmit = async (formData: ResetTokenFormInput) => {
    await getResetToken({
      variables: {
        sudoPassword,
        username: formData.username,
      },
    });
  };

  return (
    <div>
      {error && (
        <Alert severity="error">
          Password is incorrect
        </Alert>
      )}
      {resetLink && (
        <Alert severity="success">
          View link at:
          {' '}
          {resetLink}
        </Alert>
      )}
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Box my={3}>

          <TextField
            name="username"
            autoComplete="username"
            label="Username"
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
    </div>
  );
}

function Sudo() {
  const classes = useStyles();
  const [sudoPassword, setSudoPassword] = useState('');
  const [tabValue, setTabValue] = useState('1');
  const createAdminForm = useCreateAdminForm(sudoPassword);
  const getResetTokenForm = useGetResetTokenForm(sudoPassword);

  return (
    <Grid className={classes.grid} container justify="center" alignItems="center">
      <Card>
        <CardContent>
          <Box mb={2}>
            <Typography align="center">Hola sudo mode</Typography>
          </Box>
          <Box my={3}>
            <TextField
              name="sudoPassword"
              autoComplete="password"
              label="Password"
              variant="outlined"
              fullWidth
              value={sudoPassword}
              onChange={(e) => setSudoPassword(e.target.value)}
            />
          </Box>
          <TabContext value={tabValue}>
            <TabList onChange={(e, newVal) => setTabValue(newVal)}>
              <Tab label="Create admin" value="1" />
              <Tab label="Reset password link" value="2" />
            </TabList>
            <TabPanel value="1">{createAdminForm}</TabPanel>
            <TabPanel value="2">{getResetTokenForm}</TabPanel>
          </TabContext>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default Sudo;
