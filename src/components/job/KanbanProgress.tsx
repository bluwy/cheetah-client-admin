import React from 'react';
import { useQuery } from '@apollo/client';
import {
  JobKanbanFindInProgressJobsQuery as FindQ,
  JobKanbanFindInProgressJobsQueryVariables as FindV,
} from '/@/schema';
import { List, ListItem, Typography } from '@material-ui/core';
import JobKanbanCard from './KanbanCard';
import { KANBAN_FIND_IN_PROGRESS_JOBS } from './kanban-gql';

function KanbanProgress() {
  const { data } = useQuery<FindQ, FindV>(KANBAN_FIND_IN_PROGRESS_JOBS);

  return (
    <>
      <Typography variant="h6" color="textSecondary">
        In progress
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

export default KanbanProgress;
