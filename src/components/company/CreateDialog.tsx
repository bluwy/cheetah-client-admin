import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  CompanyCreateDialogCompanyCreateMutation as CreateM,
  CompanyCreateDialogCompanyCreateMutationVariables as CreateV,
} from '/@/schema';
import { makeStyles, Box, TextField } from '@material-ui/core';
import FormDialog, { FormDialogProps } from '/@/components/FormDialog';

type CompanyCreateDialogProps = Omit<FormDialogProps, 'dialogTitle' | 'onSubmit'>;

interface FormInput {
  name: string
  alias: string
}

const CREATE_COMPANY = gql`
  mutation CompanyCreateDialogCompanyCreate($data: CompanyCreateInput!) {
    companyCreate(data: $data) {
      id
    }
  }
`;

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

function CompanyCreateDialog(props: CompanyCreateDialogProps) {
  const { onClose, classes: propClasses, ...restProps } = props;

  const {
    register,
    handleSubmit,
    reset,
    errors,
    formState,
  } = useForm<FormInput>();

  const [createCompany] = useMutation<CreateM, CreateV>(CREATE_COMPANY);

  const classes = useStyles();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await createCompany({
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
      dialogTitle="Create new company"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
    >
      <Box mb={2}>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          autoFocus
          inputRef={register({
            required: { value: true, message: 'Name is required' },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

      </Box>
      <TextField
        name="alias"
        label="Alias"
        variant="outlined"
        fullWidth
        inputRef={register({
          required: { value: true, message: 'Alias is required' },
          pattern: { value: /^[A-Za-z]$/, message: 'Alias should only be a single alphabet' },
        })}
        error={!!errors.alias}
        helperText={errors.alias?.message || 'Enter a single alphabet as the alias'}
      />
    </FormDialog>
  );
}

export default CompanyCreateDialog;
