import React from 'react';
import PropTypes from 'prop-types';
import { TaskType } from '/@/schema';
import {
  makeStyles,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import TaskInput, { taskPropTypeShape, TaskInputTask } from './TaskInput';

type TaskInputListProps = {
  value: TaskInputTask[],
  onChange: ((newValue: TaskInputTask[]) => void) | null | undefined
};

const useStyles = makeStyles({
  itemDeleteHide: {
    visibility: 'hidden',
  },
});

function TaskInputList({ value, onChange }: TaskInputListProps) {
  const classes = useStyles();

  // Add a task input at the end to allow users to directly type a new input
  const anticipatedValue = value.concat([{
    type: '' as TaskType,
    remarks: '',
  }]);

  const handleTaskChange = (index: number, newTask: TaskInputTask) => {
    if (onChange != null) {
      const newValue = value.slice();
      newValue.splice(index, 1, newTask);
      onChange(newValue);
    }
  };

  const handleTaskDelete = (index: number) => {
    if (value.length > 0 && onChange != null) {
      const newValue = value.slice();
      newValue.splice(index, 1);
      onChange(newValue);
    }
  };

  return (
    <List dense>
      {anticipatedValue.map((taskValue, i) => (
        <ListItem key={taskValue.type + taskValue.remarks}>
          <ListItemText>
            <TaskInput
              value={taskValue}
              onChange={(newValue) => handleTaskChange(i, newValue)}
            />
          </ListItemText>
          <ListItemSecondaryAction className={i < value.length ? '' : classes.itemDeleteHide}>
            <IconButton edge="end" onClick={() => handleTaskDelete(i)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

TaskInputList.propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape(taskPropTypeShape).isRequired).isRequired,
  onChange: PropTypes.func,
};

TaskInputList.defaultProps = {
  onChange: undefined,
};

export default TaskInputList;
