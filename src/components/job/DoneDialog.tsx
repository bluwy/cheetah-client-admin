import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  JobDoneDialogJobFindOneQuery as FindOneQ,
  JobDoneDialogJobFindOneQueryVariables as FindOneV,
  JobDoneDialogJobFinishMutation as FinishM,
  JobDoneDialogJobFinishMutationVariables as FinishV,
  JobKanbanFindDoneJobsQuery as FindDoneQ,
  JobKanbanFindDoneJobsQueryVariables as FindDoneV,
} from '/@/schema';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Typography,
} from '@material-ui/core';
import DialogTitleClosable from '/@/components/DialogTitleClosable';
import { useSnackbar } from '/@/components/SnackbarProvider';
import JobCreateDialog from './CreateDialog';
import { KANBAN_FIND_DONE_JOBS } from './kanban-gql';

interface DoneDialogProps extends DialogProps {
  jobId: string
  onClose: () => void
}

const FIND_JOB = gql`
  query JobDoneDialogJobFindOne($id: ID!) {
    job(id: $id) {
      id
      code
      address
      startDate
      checkIn
      checkOut
      state
      customer {
        id
        name
      }
      staffPrimary {
        id
      }
      staffSecondary {
        id
      }
      tasks {
        id
        type
        remarks
      }
    }
  }
`;

const FINISH_JOB = gql`
  mutation JobDoneDialogJobFinish($id: ID!) {
    jobFinish(id: $id) {
      id
      state
    }
  }
`;

function DoneDialog(props: DoneDialogProps) {
  const { jobId, onClose, ...restProps } = props;

  const { data } = useQuery<FindOneQ, FindOneV>(FIND_JOB, {
    variables: {
      id: jobId,
    },
  });

  const [finishJob] = useMutation<FinishM, FinishV>(FINISH_JOB);

  const pushSnack = useSnackbar();
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);

  const handleFinishClick = () => {
    finishJob({
      variables: {
        id: jobId,
      },
      update(cache, result) {
        // The following removes the current job in kanban done section
        const queryData = cache.readQuery<FindDoneQ, FindDoneV>({ query: KANBAN_FIND_DONE_JOBS });

        if (queryData != null) {
          const targetJobId = result.data?.jobFinish.id;

          cache.writeQuery<FindDoneQ, FindDoneV>({
            query: FIND_JOB,
            data: {
              jobs: queryData.jobs.filter((v) => v.id !== targetJobId),
            },
          });
        }
      },
    }).catch(() => {
      pushSnack({
        severity: 'error',
        message: 'Unable to create staff',
      });
    });

    onClose?.();
  };

  return (
    <Dialog {...restProps} onClose={onClose}>
      <DialogTitleClosable onClose={onClose}>
        Review job
        {' '}
        {data?.job.code}
      </DialogTitleClosable>
      <DialogContent>
        <Typography>
          Status:
          {' '}
          {data?.job.state}
        </Typography>
        <Typography>
          Check in:
          {' '}
          {data?.job.checkIn}
        </Typography>
        <Typography>
          Check out:
          {' '}
          {data?.job.checkOut}
        </Typography>
        <Typography>
          Customer:
          {' '}
          {data?.job.customer.name}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => setShowFollowUpDialog(true)}>
          Follow up
        </Button>
        <Button color="primary" onClick={() => handleFinishClick()}>
          Finish
        </Button>
      </DialogActions>
      <JobCreateDialog
        open={showFollowUpDialog}
        onClose={() => setShowFollowUpDialog(false)}
        defaultFormInput={{
          address: data?.job.address,
          customerId: data?.job.customer.id,
          staffPrimaryId: data?.job.staffPrimary.id,
          staffSecondaryId: data?.job.staffSecondary?.id,
          tasks: data?.job.tasks.map((v) => ({
            id: v.id,
            type: v.type,
            remarks: v.remarks,
          })),
        }}
      />
    </Dialog>
  );
}

DoneDialog.propTypes = {
  jobId: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

DoneDialog.defaultProps = {
  onClose: undefined,
};

export default DoneDialog;
