import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  useForm,
  Controller,
  NestedValue,
  SubmitHandler,
} from 'react-hook-form';
import {
  JobReassignDialogJobFindOneQuery as FindQ,
  JobReassignDialogJobFindOneQueryVariables as FindV,
  JobReassignDialogJobReassignMutation as ReassignM,
  JobReassignDialogJobReassignMutationVariables as ReassignV,
} from '/@/schema';
import {
  makeStyles,
  Box,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import TaskInputList, { TaskInputListTask } from './TaskInputList';
import FormDialog, { FormDialogProps } from '../FormDialog';
import { useSnackbar } from '../SnackbarProvider';
import CustomerAddressAutocomplete from '../customer/AddressAutocomplete';
import StaffAutocomplete from '../staff/Autocomplete';

interface JobReassignDialogProps extends Omit<FormDialogProps, 'dialogTitle' | 'onSubmit'> {
  jobId: string
}

interface FormInput {
  address: string
  staffPrimaryId: string
  staffSecondaryId?: string
  startDate: Date
  tasks: NestedValue<TaskInputListTask[]>
}

const FIND_ORI_JOB = gql`
  query JobReassignDialogJobFindOne($id: ID!) {
    job(id: $id) {
      id
      code
      address
      startDate
      checkIn
      checkOut
      state
      customer {
        id
        name
      }
      staffPrimary {
        id
      }
      staffSecondary {
        id
      }
      tasks {
        id
        type
        remarks
      }
    }
  }
`;

const REASSIGN_JOB = gql`
  mutation JobReassignDialogJobReassign($id: ID!, $data: JobReassignInput!) {
    jobReassign(id: $id, data: $data) {
      oriJob {
        id
        state
      }
      newJob {
        id
      }
    }
  }
`;

const useStyles = makeStyles({
  root: {
    width: 600,
  },
});

function JobReassignDialog(props: JobReassignDialogProps) {
  const {
    jobId,
    onClose,
    classes: propClasses,
    ...restProps
  } = props;

  const { data } = useQuery<FindQ, FindV>(FIND_ORI_JOB, {
    variables: {
      id: jobId,
    },
  });

  const [reassignJob] = useMutation<ReassignM, ReassignV>(REASSIGN_JOB);

  const {
    handleSubmit,
    control,
    reset,
    errors,
    formState,
  } = useForm<FormInput>();

  const pushSnack = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    if (data != null) {
      reset({
        address: data.job.address,
        staffPrimaryId: data.job.staffPrimary.id,
        staffSecondaryId: data.job.staffSecondary?.id,
        startDate: data.job.startDate,
        tasks: data.job.tasks,
      });
    }
  }, [data, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<FormInput> = (formData) => {
    reassignJob({
      variables: {
        id: jobId,
        data: {
          ...formData,
          tasks: formData.tasks.map((v) => ({
            type: v.type,
            remarks: v.remarks,
          })),
        },
      },
    }).catch(() => {
      pushSnack({
        severity: 'error',
        message: 'Unable to reassign job',
      });
    });

    handleClose();
  };

  return (
    <FormDialog
      {...restProps}
      disableBackdropClick={formState.isDirty}
      classes={{ ...propClasses, paper: classes.root }}
      dialogTitle="Reassign job"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
    >
      <Box mb={2}>
        <Typography>
          Customer:
          {' '}
          {data?.job.customer.name}
        </Typography>
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
              defaultValue={null}
              render={({ value, onBlur, onChange }) => (
                <CustomerAddressAutocomplete
                  value={value}
                  onBlur={onBlur}
                  onInputChange={(e, option) => onChange(option)}
                  freeSolo
                  customerId={data?.job.customer.id}
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

JobReassignDialog.propTypes = {
  jobId: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  classes: PropTypes.object,
};

JobReassignDialog.defaultProps = {
  onClose: undefined,
  classes: undefined,
};

export default JobReassignDialog;
