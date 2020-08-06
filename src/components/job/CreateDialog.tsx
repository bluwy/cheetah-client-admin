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
  TaskCreateInput,
} from '/@/schema';
import { TextField, Typography } from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import CustomerAutocomplete from '/@/components/customer/Autocomplete';
import StaffAutocomplete from '/@/components/staff/Autocomplete';
import FormDialog, { FormDialogProps } from '/@/components/FormDialog';
import TaskInputList from './TaskInputList';

type JobCreateDialogProps = Omit<FormDialogProps, 'dialogTitle' | 'onSubmit'>;

interface FormInput {
  address: string
  customerId: string
  staffPrimaryId: string
  staffSecondaryId: string | undefined
  startDate: Date
  tasks: NestedValue<TaskCreateInput[]>
}

const CREATE_JOB = gql`
  mutation JobCreateDialogJobCreate($data: JobCreateInput!) {
    jobCreate(data: $data) {
      id
    }
  }
`;

function JobCreateDialog(props: JobCreateDialogProps) {
  const { onClose, ...restProps } = props;

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<FormInput>();

  const [createJob] = useMutation<CreateM, CreateV>(CREATE_JOB);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await createJob({
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
      dialogTitle="Create new job"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
    >
      <Controller
        name="customerId"
        control={control}
        rules={{ required: true }}
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
              />
            )}
          />
        )}
      />
      <TextField
        name="address"
        label="Customer address"
        variant="outlined"
        fullWidth
        inputRef={register({ required: true })}
      />
      <Controller
        name="staffPrimaryId"
        control={control}
        rules={{ required: true }}
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
              />
            )}
          />
        )}
      />
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
      <Controller
        name="startDate"
        control={control}
        defaultValue={new Date()}
        render={(params) => (
          <KeyboardDateTimePicker
            {...params}
            label="Preferred start time"
            variant="inline"
            inputVariant="outlined"
            ampm={false}
            format="yyyy/MM/dd HH:mm"
          />
        )}
      />
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
