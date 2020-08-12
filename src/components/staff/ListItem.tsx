import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Box,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  PhoneAndroid as PairingIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';
import StaffToggleActiveDialog from './ToggleActiveDialog';
import StaffDeleteDialog from '/@/components/staff/DeleteDialog';

const useStyles = makeStyles({
  inactiveText: {
    opacity: 0.5,
  },
});

function StaffListItem({ data }: StaffListItemProps) {
  const [showToggleActiveDialog, setShowToggleActiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const classes = useStyles();

  return (
    <ListItem>
      <ListItemText>
        {data.active ? data.fullName : (
          <Tooltip title="Staff is inactive and will not be searchable when creating jobs">
            <span className={classes.inactiveText}>
              {data.fullName}
            </span>
          </Tooltip>
        )}
        {!data.paired && (
          <Tooltip title="User is not paired yet">
            <Box display="inline" mx={1}>
              <PairingIcon fontSize="inherit" />
            </Box>
          </Tooltip>
        )}
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton size="small" onClick={() => setShowToggleActiveDialog(true)}>
          {data.active
            ? <VisibilityIcon fontSize="small" />
            : <VisibilityOffIcon fontSize="small" />}
        </IconButton>
        <StaffToggleActiveDialog
          staffId={data.id}
          open={showToggleActiveDialog}
          onClose={() => setShowToggleActiveDialog(false)}
        />
        <IconButton size="small" edge="end" onClick={() => setShowDeleteDialog(true)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        <StaffDeleteDialog
          staffId={data.id}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

type StaffListItemProps = PropTypes.InferProps<typeof StaffListItem.propTypes>;

StaffListItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    paired: PropTypes.bool.isRequired,
  }).isRequired,
};

export default StaffListItem;
