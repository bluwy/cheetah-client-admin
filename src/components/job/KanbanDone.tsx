import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  JobKanbanFindDoneJobsQuery as FindQ,
  JobKanbanFindDoneJobsQueryVariables as FindV,
} from '/@/schema';
import { List, ListItem, Typography } from '@material-ui/core';
import JobDoneDialog from './DoneDialog';
import JobKanbanCard from './KanbanCard';
import { KANBAN_FIND_DONE_JOBS } from './kanban-gql';

interface KanbanaProgressListItemProps {
  jobId: string
}

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
  const { data } = useQuery<FindQ, FindV>(KANBAN_FIND_DONE_JOBS);

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
