import React from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import {
  StaffDeleteDialogStaffDeleteMutation as DeleteM,
  StaffDeleteDialogStaffDeleteMutationVariables as DeleteV,
} from '/@/schema';
import YesNoDialog, { YesNoDialogProps } from '/@/components/YesNoDialog';
import { useSnackbar } from '/@/components/SnackbarProvider';

interface StaffDeleteDialogProps extends Omit<YesNoDialogProps, 'dialogTitle' | 'yesText' | 'noText'> {
  staffId: string
}

const DELETE_STAFF = gql`
  mutation StaffDeleteDialogStaffDelete($id: ID!) {
    staffDelete(id: $id)
  }
`;

function StaffDeleteDialog(props: StaffDeleteDialogProps) {
  const { staffId, onYes, ...restProps } = props;
  const [deleteStaff] = useMutation<DeleteM, DeleteV>(DELETE_STAFF);
  const pushSnack = useSnackbar();

  const handleYes = () => {
    deleteStaff({
      variables: {
        id: staffId,
      },
    }).catch(() => {
      pushSnack({
        severity: 'error',
        message: 'Unable to delete staff',
      });
    });

    onYes?.();
  };

  return (
    <YesNoDialog
      {...restProps}
      dialogTitle="Delete staff?"
      onYes={handleYes}
    />
  );
}

StaffDeleteDialog.propTypes = {
  staffId: PropTypes.string.isRequired,
  onYes: PropTypes.func,
};

StaffDeleteDialog.defaultProps = {
  onYes: undefined,
};

export default StaffDeleteDialog;
