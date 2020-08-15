import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  JobKanbanTodoFindJobsQuery as FindQ,
  JobKanbanTodoFindJobsQueryVariables as FindV,
} from '/@/schema';
import { List, ListItem, Typography } from '@material-ui/core';
import JobKanbanCard, { JOB_FRAGMENT } from './KanbanCard';
import JobReassignDialog from './ReassignDialog';

interface KanbanaTodoListItemProps {
  jobId: string
}

const FIND_TODO_JOBS = gql`
  query JobKanbanTodoFindJobs {
    jobs(
      first: 30,
      where: {
        checkIn: {
          equals: null
        },
        checkOut: {
          equals: null
        },
        state: {
          equals: TODO
        }
      }
    ) {
      ...KanbanCardJob
    }
  }
  ${JOB_FRAGMENT}
`;

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
  const { data } = useQuery<FindQ, FindV>(FIND_TODO_JOBS);

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
