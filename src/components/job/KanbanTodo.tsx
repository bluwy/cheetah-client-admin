import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  JobKanbanFindTodoJobsQuery as FindQ,
  JobKanbanFindTodoJobsQueryVariables as FindV,
} from '/@/schema';
import { List, ListItem, Typography } from '@material-ui/core';
import JobKanbanCard from './KanbanCard';
import JobReassignDialog from './ReassignDialog';
import { KANBAN_FIND_TODO_JOBS } from './kanban-gql';

interface KanbanaTodoListItemProps {
  jobId: string
}

function KanbanTodoListItem({ jobId }: KanbanaTodoListItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <ListItem disableGutters>
      <JobKanbanCard jobId={jobId} onClick={() => setOpen(true)} />
      <JobReassignDialog
        jobId={jobId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </ListItem>
  );
}

function KanbanTodo() {
  const { data } = useQuery<FindQ, FindV>(KANBAN_FIND_TODO_JOBS);

  return (
    <>
      <Typography variant="h6" color="textSecondary">
        Todo
      </Typography>
      <List>
        {data?.jobs.map((job) => (
          <KanbanTodoListItem key={job.id} jobId={job.id} />
        ))}
      </List>
    </>
  );
}

export default KanbanTodo;
