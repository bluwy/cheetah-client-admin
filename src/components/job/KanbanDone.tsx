import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  JobKanbanDoneFindJobsQuery as FindQ,
  JobKanbanDoneFindJobsQueryVariables as FindV,
} from '/@/schema';
import { List, ListItem, Typography } from '@material-ui/core';
import JobDoneDialog from './DoneDialog';
import JobKanbanCard, { JOB_FRAGMENT } from './KanbanCard';

interface KanbanaProgressListItemProps {
  jobId: string
}

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

function KanbanProgressListItem({ jobId }: KanbanaProgressListItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <ListItem disableGutters>
      <JobKanbanCard jobId={jobId} onClick={() => setOpen(true)} />
      <JobDoneDialog
        jobId={jobId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </ListItem>
  );
}

function KanbanProgress() {
  const { data } = useQuery<FindQ, FindV>(FIND_DONE);

  return (
    <>
      <Typography variant="h6" color="textSecondary">
        Done
      </Typography>
      <List>
        {data?.jobs.map((job) => (
          <KanbanProgressListItem key={job.id} jobId={job.id} />
        ))}
      </List>
    </>
  );
}

export default KanbanProgress;
