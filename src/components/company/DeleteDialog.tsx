import React from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import {
  CompanyDeleteDialogCompanyDeleteMutation as DeleteM,
  CompanyDeleteDialogCompanyDeleteMutationVariables as DeleteV,
} from '/@/schema';
import YesNoDialog, { YesNoDialogProps } from '/@/components/YesNoDialog';
import { useSnackbar } from '/@/components/SnackbarProvider';

interface CompanyDeleteDialogProps extends Omit<YesNoDialogProps, 'dialogTitle' | 'yesText' | 'noText'> {
  companyId: string
}

const DELETE_COMPANY = gql`
  mutation CompanyDeleteDialogCompanyDelete($id: ID!) {
    companyDelete(id: $id)
  }
`;

function CompanyDeleteDialog(props: CompanyDeleteDialogProps) {
  const { companyId, onYes, ...restProps } = props;
  const [deleteCompany] = useMutation<DeleteM, DeleteV>(DELETE_COMPANY);
  const pushSnack = useSnackbar();

  const handleYes = () => {
    deleteCompany({
      variables: {
        id: companyId,
      },
    }).catch(() => {
      pushSnack({
        severity: 'error',
        message: 'Unable to delete company',
      });
    });

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
