import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  StaffCreateDialogStaffCreateMutation as CreateM,
  StaffCreateDialogStaffCreateMutationVariables as CreateV,
} from '/@/schema';
import { makeStyles, Box, TextField } from '@material-ui/core';
import FormDialog, { FormDialogProps } from '/@/components/FormDialog';

type StaffCreateDialogProps = Omit<FormDialogProps, 'dialogTitle' | 'onSubmit'>;

interface FormInput {
  username: string
  fullName: string
}

const CREATE_STAFF = gql`
  mutation StaffCreateDialogStaffCreate($data: StaffCreateInput!) {
    staffCreate(data: $data) {
      id
    }
  }
`;

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

function StaffCreateDialog(props: StaffCreateDialogProps) {
  const { onClose, classes: propClasses, ...restProps } = props;

  const {
    register,
    handleSubmit,
    reset,
    errors,
    formState,
  } = useForm<FormInput>();

  const [createStaff] = useMutation<CreateM, CreateV>(CREATE_STAFF);

  const classes = useStyles();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await createStaff({
        variables: { data },
      });

      handleClose();
    } catch {
      // TODO: Show error
    }
  };

  return (
    <FormDialog
      {...restProps}
      disableBackdropClick={formState.isDirty}
      classes={{ ...propClasses, paper: classes.root }}
      dialogTitle="Create new staff"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
    >
      <Box mb={2}>
        <TextField
          name="username"
          label="Username"
          variant="outlined"
          fullWidth
          autoFocus
          inputRef={register({
            required: { value: true, message: 'Username is required' },
          })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
      </Box>
      <TextField
        name="fullName"
        label="Full name"
        variant="outlined"
        fullWidth
        inputRef={register({
          required: { value: true, message: 'Full name is required' },
        })}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
      />
    </FormDialog>
  );
}

export default StaffCreateDialog;
