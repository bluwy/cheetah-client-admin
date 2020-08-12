import React from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import {
  JobKanbanCardFindJobQuery as FindQ,
  JobKanbanCardFindJobQueryVariables as FindV,
} from '/@/schema';
import {
  makeStyles,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@material-ui/core';

interface JobKanbanCardProps {
  jobId: string
  onClick?: () => void
}

export const JOB_FRAGMENT = gql`
  fragment KanbanCardJob on Job {
    id
    customer {
      id
      name
    }
    staffPrimary {
      id
      username
    }
    staffSecondary {
      id
      username
    }
  }
`;

const FIND_JOB = gql`
  query JobKanbanCardFindJob($id: ID!) {
    job(id: $id) {
      ...KanbanCardJob
    }
  }
  ${JOB_FRAGMENT}
`;

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  cardHeader: {
    fontWeight: 500,
  },
});

function JobKanbanCard({ jobId, onClick }: JobKanbanCardProps) {
  const { data } = useQuery<FindQ, FindV>(FIND_JOB, {
    variables: {
      id: jobId,
    },
  });

  const classes = useStyles();
  const staffPrimaryName = data?.job.staffPrimary.username;
  const staffSecondaryName = data?.job.staffSecondary?.username;

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography className={classes.cardHeader} gutterBottom>
            {data?.job.customer.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Assigned to
            {' '}
            <strong>{staffPrimaryName}</strong>
            {staffSecondaryName != null && (
              <>
                {' '}
                and
                {' '}
                <strong>{staffSecondaryName}</strong>
              </>
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

JobKanbanCard.propTypes = {
  jobId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

JobKanbanCard.defaultProps = {
  onClick: undefined,
};

export default JobKanbanCard;
