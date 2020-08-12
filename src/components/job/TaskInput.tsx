import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Grid,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { Task, TaskType } from '/@/schema';

export type TaskInputTask = Pick<Task, 'type' | 'remarks'>;

type TaskInputProps = {
  value: TaskInputTask,
  onChange: ((newValue: TaskInputTask) => void) | null | undefined
};

interface TaskInputTaskType {
  label: string,
  value: TaskType
}

export const taskPropTypeShape = {
  type: PropTypes.string,
  remarks: PropTypes.string,
};

const TASK_TYPES: TaskInputTaskType[] = [
  { label: 'Follow-up service', value: TaskType.Service },
  { label: 'Complaint', value: TaskType.Complaint },
  { label: 'Delivery', value: TaskType.Delivery },
  { label: 'Transport', value: TaskType.Transport },
  { label: 'Others', value: TaskType.Others },
];

const useStyles = makeStyles((theme) => ({
  typeText: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 120,
  },
  remarksText: {
    marginLeft: theme.spacing(2),
  },
}));

function TaskInput({ value, onChange }: TaskInputProps) {
  const classes = useStyles();

  const handleChange = (partialTask: Partial<TaskInputTask>) => {
    if (onChange != null) {
      onChange({ ...value, ...partialTask });
    }
  };

  return (
    <Grid container wrap="nowrap">
      <TextField
        className={classes.typeText}
        label="Type"
        select
        variant="outlined"
        size="small"
        value={value.type}
        onChange={(e) => handleChange({ type: e.target.value as TaskType })}
      >
        {TASK_TYPES.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        className={classes.remarksText}
        label="Remarks"
        size="small"
        variant="outlined"
        fullWidth
        value={value.remarks}
        onChange={(e) => handleChange({ remarks: e.target.value })}
      />
    </Grid>
  );
}

TaskInput.propTypes = {
  value: PropTypes.shape(taskPropTypeShape).isRequired,
  onChange: PropTypes.func,
};

TaskInput.defaultProps = {
  onChange: undefined,
};

export default TaskInput;
