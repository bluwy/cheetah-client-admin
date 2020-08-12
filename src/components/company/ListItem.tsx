import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import CompanyDeleteDialog from '/@/components/company/DeleteDialog';

function CompanyListItem({ data }: CompanyListItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <ListItem>
      <ListItemText>{data.name}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton size="small" edge="end" onClick={() => setShowDeleteDialog(true)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        <CompanyDeleteDialog
          companyId={data.id}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

type CompanyListItemProps = PropTypes.InferProps<typeof CompanyListItem.propTypes>;

CompanyListItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default CompanyListItem;
