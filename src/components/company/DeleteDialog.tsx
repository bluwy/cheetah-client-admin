import React from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import {
  CompanyDeleteDialogCompanyDeleteMutation as DeleteM,
  CompanyDeleteDialogCompanyDeleteMutationVariables as DeleteV,
} from '/@/schema';
import YesNoDialog, { YesNoDialogProps } from '/@/components/YesNoDialog';

interface CompanyDeleteDialog extends Omit<YesNoDialogProps, 'dialogTitle' | 'yesText' | 'noText'> {
  companyId: string
}

const DELETE_COMPANY = gql`
  mutation CompanyDeleteDialogCompanyDelete($id: ID!) {
    companyDelete(id: $id)
  }
`;

function CompanyDeleteDialog(props: CompanyDeleteDialog) {
  const { companyId, onYes, ...restProps } = props;
  const [deleteCompany] = useMutation<DeleteM, DeleteV>(DELETE_COMPANY);

  const handleYes = () => {
    deleteCompany({ variables: { id: companyId } });
    onYes?.();
  };

  return (
    <YesNoDialog
      {...restProps}
      dialogTitle="Delete company?"
      onYes={handleYes}
    />
  );
}

CompanyDeleteDialog.propTypes = {
  companyId: PropTypes.string.isRequired,
  onYes: PropTypes.func,
};

CompanyDeleteDialog.defaultProps = {
  onYes: undefined,
};

export default CompanyDeleteDialog;
