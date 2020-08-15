import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  JobDoneDialogJobFindOneQuery as FindQ,
  JobDoneDialogJobFindOneQueryVariables as FindV,
  JobDoneDialogJobFinishMutation as FinishM,
  JobDoneDialogJobFinishMutationVariables as FinishV,
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
import JobCreateDialog from './CreateDialog';

interface DoneDialogProps extends DialogProps {
  jobId: string
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
    }
  }
`;

function DoneDialog(props: DoneDialogProps) {
  const { jobId, ...restProps } = props;

  const { data } = useQuery<FindQ, FindV>(FIND_JOB, {
    variables: {
      id: jobId,
    },
  });

  const [finishJob] = useMutation<FinishM, FinishV>(FINISH_JOB, {
    variables: {
      id: jobId,
    },
  });

  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);

  return (
    <Dialog {...restProps}>
      <DialogTitleClosable>
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
        <Button color="primary" onClick={() => finishJob()}>
          Finish
        </Button>
      </DialogActions>
      <JobCreateDialog
        open={showFollowUpDialog}
        onClose={() => setShowFollowUpDialog(true)}
        defaultFormInput={{
          address: data?.job.address,
          customerId: data?.job.customer.id,
          staffPrimaryId: data?.job.staffPrimary.id,
          staffSecondaryId: data?.job.staffSecondary?.id,
          startDate: data?.job.startDate,
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
};

export default DoneDialog;
