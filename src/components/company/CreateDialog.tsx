import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  CompanyCreateDialogCompanyCreateMutation as CreateM,
  CompanyCreateDialogCompanyCreateMutationVariables as CreateV,
} from '/@/schema';
import { TextField } from '@material-ui/core';
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

function CompanyCreateDialog(props: CompanyCreateDialogProps) {
  const { onClose, ...restProps } = props;

  const { register, handleSubmit, reset } = useForm<FormInput>();

  const [createCompany] = useMutation<CreateM, CreateV>(CREATE_COMPANY);

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
      dialogTitle="Create new company"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
    >
      <TextField
        name="name"
        label="Name"
        variant="outlined"
        fullWidth
        inputRef={register({ required: true })}
      />
      <TextField
        name="alias"
        label="Alias"
        variant="outlined"
        fullWidth
        inputRef={register({ required: true, minLength: 1, maxLength: 1 })}
      />
    </FormDialog>
  );
}

export default CompanyCreateDialog;
