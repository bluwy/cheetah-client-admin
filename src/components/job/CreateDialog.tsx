import React from 'react';
import { gql, useMutation } from '@apollo/client';
import {
  useForm,
  Controller,
  NestedValue,
  SubmitHandler,
} from 'react-hook-form';
import {
  JobCreateDialogJobCreateMutation as CreateM,
  JobCreateDialogJobCreateMutationVariables as CreateV,
} from '/@/schema';
import {
  makeStyles,
  Box,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import CustomerAutocomplete from '/@/components/customer/Autocomplete';
import CustomerAddressAutocomplete from '/@/components/customer/AddressAutocomplete';
import StaffAutocomplete from '/@/components/staff/Autocomplete';
import FormDialog, { FormDialogProps } from '/@/components/FormDialog';
import { useSnackbar } from '/@/components/SnackbarProvider';
import TaskInputList, { TaskInputListTask } from './TaskInputList';

type JobCreateDialogProps = Omit<FormDialogProps, 'dialogTitle' | 'onSubmit'>;

interface FormInput {
  address: string
  customerId: string
  staffPrimaryId: string
  staffSecondaryId?: string
  startDate: Date
  tasks: NestedValue<TaskInputListTask[]>
}

const CREATE_JOB = gql`
  mutation JobCreateDialogJobCreate($data: JobCreateInput!) {
    jobCreate(data: $data) {
      id
    }
  }
`;

const useStyles = makeStyles({
  root: {
    width: 600,
  },
});

function JobCreateDialog(props: JobCreateDialogProps) {
  const { onClose, classes: propClasses, ...restProps } = props;

  const {
    handleSubmit,
    control,
    reset,
    errors,
    formState,
  } = useForm<FormInput>();

  const [createJob] = useMutation<CreateM, CreateV>(CREATE_JOB);

  const pushSnack = useSnackbar();
  const classes = useStyles();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    createJob({
      variables: {
        data: {
          ...data,
          tasks: data.tasks.map((v) => ({
            type: v.type,
            remarks: v.remarks,
          })),
        },
      },
    }).catch(() => {
      pushSnack({
        severity: 'error',
        message: 'Unable to create job',
      });
    });

    handleClose();
  };

  return (
    <FormDialog
      {...restProps}
      disableBackdropClick={formState.isDirty}
      classes={{ ...propClasses, paper: classes.root }}
      dialogTitle="Create new job"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
    >
      <Box mb={2}>
        <Controller
          name="customerId"
          control={control}
          rules={{
            required: { value: true, message: 'Customer is required' },
          }}
          defaultValue={undefined}
          render={({ onBlur, onChange }) => (
            <CustomerAutocomplete
              onBlur={onBlur}
              onChange={(e, option) => onChange(option?.id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Customer"
                  variant="outlined"
                  fullWidth
                  autoFocus
                  error={!!errors.customerId}
                  helperText={errors.customerId?.message}
                />
              )}
            />
          )}
        />
      </Box>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              name="address"
              control={control}
              rules={{
                required: { value: true, message: 'Address is required' },
              }}
              defaultValue={undefined}
              render={({ onBlur, onChange }) => (
                <CustomerAddressAutocomplete
                  freeSolo
                  onBlur={onBlur}
                  onChange={(e, option) => onChange(option)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Address"
                      variant="outlined"
                      fullWidth
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="startDate"
              control={control}
              rules={{
                required: { value: true, message: 'Start time is required' },
              }}
              defaultValue={new Date()}
              render={(params) => (
                <KeyboardDateTimePicker
                  {...params}
                  label="Start time"
                  variant="inline"
                  inputVariant="outlined"
                  ampm={false}
                  format="yyyy/MM/dd HH:mm"
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              name="staffPrimaryId"
              control={control}
              rules={{
                required: { value: true, message: 'Technician 1 is required' },
              }}
              defaultValue={undefined}
              render={({ onBlur, onChange }) => (
                <StaffAutocomplete
                  onBlur={onBlur}
                  onChange={(e, option) => onChange(option?.id)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Technician 1"
                      variant="outlined"
                      fullWidth
                      error={!!errors.staffPrimaryId}
                      helperText={errors.staffPrimaryId?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="staffSecondaryId"
              control={control}
              defaultValue={undefined}
              render={({ onBlur, onChange }) => (
                <StaffAutocomplete
                  onBlur={onBlur}
                  onChange={(e, option) => onChange(option?.id)}
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
          </Grid>
        </Grid>
      </Box>
      <Typography variant="subtitle1">Job tasks</Typography>
      <Controller
        name="tasks"
        control={control}
        defaultValue={[]}
        render={({ onChange, value }) => (
          <TaskInputList value={value} onChange={onChange} />
        )}
      />
    </FormDialog>
  );
}

export default JobCreateDialog;
