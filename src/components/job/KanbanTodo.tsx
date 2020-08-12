import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  JobKanbanTodoFindJobsQuery as FindQ,
  JobKanbanTodoFindJobsQueryVariables as FindV,
} from '/@/schema';
import { List, ListItem, Typography } from '@material-ui/core';
import JobKanbanCard, { JOB_FRAGMENT } from './KanbanCard';

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

function KanbanTodo() {
  const { data } = useQuery<FindQ, FindV>(FIND_TODO_JOBS);

  return (
    <>
      <Typography variant="h6" color="textSecondary">
        Todo
      </Typography>
      <List>
        {data?.jobs.map((job) => (
          <ListItem key={job.id} disableGutters>
            <JobKanbanCard jobId={job.id} />
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default KanbanTodo;
