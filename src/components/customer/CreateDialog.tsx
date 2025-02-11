import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import {
  CustomerCreateDialogCustomerCreateMutation as CreateM,
  CustomerCreateDialogCustomerCreateMutationVariables as CreateV,
} from '/@/schema';
import { TextField } from '@material-ui/core';
import StaffAutocomplete from '/@/components/staff/Autocomplete';
import FormDialog, { FormDialogProps } from '/@/components/FormDialog';
import CompanyAutocomplete from '/@/components/company/Autocomplete';
import { useSnackbar } from '/@/components/SnackbarProvider';

type CustomerCreateDialogProps = Omit<FormDialogProps, 'dialogTitle' | 'onSubmit'>;

interface FormInput {
  code: string
  name: string
  // Array separated with "\n"
  addresses: string
  email?: string
  phoneNumber?: string
  companyBelongId: string
  staffPrimaryId: string
  staffSecondaryId?: string
}

const CREATE_CUSTOMER = gql`
  mutation CustomerCreateDialogCustomerCreate($data: CustomerCreateInput!) {
    customerCreate(data: $data) {
      id
    }
  }
`;

function CustomerCreateDialog(props: CustomerCreateDialogProps) {
  const { onClose, ...restProps } = props;

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<FormInput>();

  const [createCustomer] = useMutation<CreateM, CreateV>(CREATE_CUSTOMER);

  const pushSnack = useSnackbar();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    createCustomer({
      variables: {
        data: {
          ...data,
          addresses: data.addresses.split('\n').filter(Boolean),
        },
      },
    }).catch(() => {
      pushSnack({
        severity: 'error',
        message: 'Unable to create customer',
      });
    });

    handleClose();
  };

  return (
    <FormDialog
      {...restProps}
      dialogTitle="Create new customer"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
    >
      <TextField
        name="code"
        label="Code"
        variant="outlined"
        fullWidth
        inputRef={register({ required: true })}
      />
      <TextField
        name="name"
        label="Name"
        variant="outlined"
        fullWidth
        inputRef={register({ required: true })}
      />
      <TextField
        name="email"
        type="email"
        label="Email"
        variant="outlined"
        fullWidth
        inputRef={register()}
      />
      <TextField
        name="phoneNumber"
        type="tel"
        label="Phone number"
        variant="outlined"
        fullWidth
        inputRef={register()}
      />
      <TextField
        name="addresses"
        label="Addresses (Separate multiple addresses in new line)"
        variant="outlined"
        multiline
        fullWidth
        inputRef={register()}
      />
      <Controller
        name="companyBelongId"
        control={control}
        defaultValue={null}
        render={({ value, onBlur, onChange }) => (
          <CompanyAutocomplete
            value={value}
            onBlur={onBlur}
            onChange={(e, v) => onChange(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Company in charge"
                variant="outlined"
                fullWidth
              />
            )}
          />
        )}
      />
      <Controller
        name="staffPrimaryId"
        control={control}
        rules={{ required: true }}
        defaultValue={null}
        render={({ value, onBlur, onChange }) => (
          <StaffAutocomplete
            value={value}
            onBlur={onBlur}
            onChange={(e, v) => onChange(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Technician 1"
                variant="outlined"
                fullWidth
              />
            )}
          />
        )}
      />
      <Controller
        name="staffSecondaryId"
        control={control}
        defaultValue={null}
        render={({ value, onBlur, onChange }) => (
          <StaffAutocomplete
            value={value}
            onBlur={onBlur}
            onChange={(e, v) => onChange(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Technician 2 (optional)"
                variant="outlined"
                fullWidth
              />
            )}
          />
        )}
      />
    </FormDialog>
  );
}

export default CustomerCreateDialog;
