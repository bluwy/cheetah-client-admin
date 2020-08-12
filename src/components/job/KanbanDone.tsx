import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  JobKanbanDoneFindJobsQuery as FindQ,
  JobKanbanDoneFindJobsQueryVariables as FindV,
} from '/@/schema';
import { List, ListItem, Typography } from '@material-ui/core';
import JobKanbanCard, { JOB_FRAGMENT } from './KanbanCard';

const FIND_DONE = gql`
  query JobKanbanDoneFindJobs {
    jobs(
      first: 30,
      where: {
        checkIn: {
          not: null
        },
        checkOut: {
          not: null
        },
        OR: [
          {
            state: {
              equals: DONE
            }
          },
          {
            state: {
              equals: FOLLOW_UP
            }
          }
        ]
      }
    ) {
      ...KanbanCardJob
    }
  }
  ${JOB_FRAGMENT}
`;

function KanbanProgress() {
  const { data } = useQuery<FindQ, FindV>(FIND_DONE);

  return (
    <>
      <Typography variant="h6" color="textSecondary">
        Done
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
