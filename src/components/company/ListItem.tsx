import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import {
  CompanyListItemCompanyFindOneQuery as FindOneQ,
  CompanyListItemCompanyFindOneQueryVariables as FindOneV,
} from '/@/schema';
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import CompanyDeleteDialog from '/@/components/company/DeleteDialog';

const FIND_COMPANY = gql`
  query CompanyListItemCompanyFindOne($id: ID!) {
    company(id: $id) {
      id
      name
    }
  }
`;

function CompanyListItem({ companyId }: CompanyListItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data } = useQuery<FindOneQ, FindOneV>(FIND_COMPANY, {
    variables: {
      id: companyId,
    },
  });

  if (data == null) {
    return <ListItem />;
  }

  return (
    <ListItem>
      <ListItemText>{data.company.name}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton size="small" edge="end" onClick={() => setShowDeleteDialog(true)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        <CompanyDeleteDialog
          companyId={data.company.id}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

type CompanyListItemProps = PropTypes.InferProps<typeof CompanyListItem.propTypes>;

CompanyListItem.propTypes = {
  companyId: PropTypes.string.isRequired,
};

export default CompanyListItem;
