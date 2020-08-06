import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  StaffCreateDialogStaffCreateMutation as CreateM,
  StaffCreateDialogStaffCreateMutationVariables as CreateV,
} from '/@/schema';
import { TextField } from '@material-ui/core';
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

function StaffCreateDialog(props: StaffCreateDialogProps) {
  const { onClose, ...restProps } = props;

  const { register, handleSubmit, reset } = useForm<FormInput>();

  const [createStaff] = useMutation<CreateM, CreateV>(CREATE_STAFF);

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
      dialogTitle="Create new staff"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
    >
      <TextField
        name="username"
        label="Username"
        variant="outlined"
        fullWidth
        inputRef={register({ required: true })}
      />
      <TextField
        name="fullName"
        label="Full name"
        variant="outlined"
        fullWidth
        inputRef={register({ required: true })}
      />
    </FormDialog>
  );
}

export default StaffCreateDialog;
