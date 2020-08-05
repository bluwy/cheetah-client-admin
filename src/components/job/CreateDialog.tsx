import React from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import {
  useForm,
  Controller,
  NestedValue,
  SubmitHandler,
} from 'react-hook-form';
import {
  CreateDialogJobCreateMutation as CreateM,
  CreateDialogJobCreateMutationVariables as CreateV,
  TaskCreateInput,
} from '/@/schema';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from '@material-ui/core';
import CustomerAutocomplete from '/@/components/customer/Autocomplete';
import StaffAutocomplete from '/@/components/staff/Autocomplete';
import DialogTitleClosable from '/@/components/DialogTitleClosable';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import TaskInputList from './TaskInputList';

interface FormInput {
  address: string
  customerId: string
  staffPrimaryId: string
  staffSecondaryId: string | undefined
  startDate: Date
  tasks: NestedValue<TaskCreateInput[]>
}

const CREATE_JOB = gql`
  mutation CreateDialogJobCreate($data: JobCreateInput!) {
    jobCreate(data: $data) {
      id
    }
  }
`;

function JobCreateDialog({ open, onClose }: JobCreateDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<FormInput>({
    defaultValues: {
      customerId: undefined,
      staffPrimaryId: undefined,
      staffSecondaryId: undefined,
      startDate: new Date(),
      tasks: [],
    },
  });

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
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitleClosable onClose={handleClose}>
          Create new job
        </DialogTitleClosable>
        <DialogContent>
          <Controller
            name="customerId"
            control={control}
            rules={{ required: true }}
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
            render={({ onChange, value }) => (
              <TaskInputList value={value} onChange={onChange} />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}

type JobCreateDialogProps = PropTypes.InferProps<typeof JobCreateDialog.propTypes>;

JobCreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default JobCreateDialog;
