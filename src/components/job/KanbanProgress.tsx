import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  JobKanbanProgressFindJobsQuery as FindQ,
  JobKanbanProgressFindJobsQueryVariables as FindV,
} from '/@/schema';
import { List, ListItem, Typography } from '@material-ui/core';
import JobKanbanCard, { JOB_FRAGMENT } from './KanbanCard';

const FIND_IN_PROGRESS = gql`
  query JobKanbanProgressFindJobs {
    jobs(
      first: 30,
      where: {
        checkIn: {
          not: null
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

function KanbanProgress() {
  const { data } = useQuery<FindQ, FindV>(FIND_IN_PROGRESS);

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
