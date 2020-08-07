import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import {
  StaffListItemStaffFindOneQuery as FindOneQ,
  StaffListItemStaffFindOneQueryVariables as FindOneV,
} from '/@/schema';
import {
  makeStyles,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  PermDeviceInformation as PairingIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';
import StaffToggleActiveDialog from './ToggleActiveDialog';
import StaffDeleteDialog from '/@/components/staff/DeleteDialog';

const FIND_STAFF = gql`
  query StaffListItemStaffFindOne($id: ID!) {
    staff(id: $id) {
      id
      fullName
      active
      paired
    }
  }
`;

const useStyles = makeStyles({
  inactiveText: {
    opacity: 0.5,
  },
});

function StaffListItem({ staffId }: StaffListItemProps) {
  const [showToggleActiveDialog, setShowToggleActiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data } = useQuery<FindOneQ, FindOneV>(FIND_STAFF, {
    variables: {
      id: staffId,
    },
  });

  const classes = useStyles();

  if (data == null) {
    return <ListItem />;
  }

  return (
    <ListItem>
      <ListItemText>
        {data.staff.active ? data.staff.fullName : (
          <Tooltip title="Staff is inactive and will not be searchable when creating jobs">
            <span className={classes.inactiveText}>
              {data.staff.fullName}
            </span>
          </Tooltip>
        )}
        {!data.staff.paired && (
          <Tooltip title="User is not paired yet">
            <PairingIcon fontSize="small" />
          </Tooltip>
        )}
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton onClick={() => setShowToggleActiveDialog(true)}>
          {data.staff.active ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
        <StaffToggleActiveDialog
          staffId={data.staff.id}
          open={showToggleActiveDialog}
          onClose={() => setShowToggleActiveDialog(false)}
        />
        <IconButton edge="end" onClick={() => setShowDeleteDialog(true)}>
          <DeleteIcon />
        </IconButton>
        <StaffDeleteDialog
          staffId={data.staff.id}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

type StaffListItemProps = PropTypes.InferProps<typeof StaffListItem.propTypes>;

StaffListItem.propTypes = {
  staffId: PropTypes.string.isRequired,
};

export default StaffListItem;
