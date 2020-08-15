import React, { useState } from 'react';
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
import TaskInput, { TaskInputTask } from './TaskInput';

export interface TaskInputListTask extends TaskInputTask {
  id: string
}

type TaskInputListProps = {
  value: TaskInputListTask[],
  onChange?: (newValue: TaskInputTask[]) => void
};

const useStyles = makeStyles({
  itemDeleteHide: {
    visibility: 'hidden',
  },
});

function TaskInputList({ value, onChange }: TaskInputListProps) {
  const [antipatedId, setAnticipatedId] = useState(Math.random().toString());
  const classes = useStyles();

  // Add a task input at the end to allow users to directly type a new input
  const anticipatedValue = value.concat([{
    id: antipatedId,
    type: '' as TaskType,
    remarks: '',
  }]);

  const handleTaskChange = (index: number, newTask: TaskInputTask) => {
    if (onChange != null) {
      const newValue = value.slice();

      // Check if change from anticapted
      if (index >= value.length) {
        newValue.push({
          id: antipatedId,
          ...newTask,
        });

        // Set next id
        setAnticipatedId(Math.random().toString());
      } else {
        newValue.splice(index, 1, {
          id: value[index].id,
          ...newTask,
        });
      }

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
        <ListItem key={taskValue.id} disableGutters>
          <ListItemText>
            <TaskInput
              value={taskValue}
              onChange={(newValue) => handleTaskChange(i, newValue)}
            />
          </ListItemText>
          <ListItemSecondaryAction className={i < value.length ? '' : classes.itemDeleteHide}>
            <IconButton size="small" edge="end" onClick={() => handleTaskDelete(i)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

TaskInputList.propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    remarks: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  onChange: PropTypes.func,
};

TaskInputList.defaultProps = {
  onChange: undefined,
};

export default TaskInputList;
