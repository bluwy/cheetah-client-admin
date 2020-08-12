import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {
  StaffToggleActiveDialogFindOneQuery as FindOneQ,
  StaffToggleActiveDialogFindOneQueryVariables as FindOneV,
  StaffToggleActiveDialogStaffSetActiveMutation as SetActiveM,
  StaffToggleActiveDialogStaffSetActiveMutationVariables as SetActiveV,
} from '/@/schema';
import YesNoDialog, { YesNoDialogProps } from '/@/components/YesNoDialog';

interface StaffToggleActiveDialogProps extends Omit<YesNoDialogProps, 'dialogTitle' | 'yesText' | 'noText'> {
  staffId: string
}

const FIND_STAFF = gql`
  query StaffToggleActiveDialogFindOne($id: ID!) {
    staff(id: $id) {
      id
      active
    }
  }
`;

const SET_ACTIVE = gql`
  mutation StaffToggleActiveDialogStaffSetActive($id: ID!, $active: Boolean!) {
    staffUpdate(id: $id, data: { active: $active }) {
      id
      active
    }
  }
`;

function StaffToggleActiveDialog(props: StaffToggleActiveDialogProps) {
  const {
    staffId,
    open,
    onYes,
    ...restProps
  } = props;
  const [findStaff, { data }] = useLazyQuery<FindOneQ, FindOneV>(FIND_STAFF, {
    variables: {
      id: staffId,
    },
  });
  const [setActive] = useMutation<SetActiveM, SetActiveV>(SET_ACTIVE);

  useEffect(() => {
    if (open) {
      findStaff();
    }
  }, [open]);

  const handleYes = () => {
    setActive({
      variables: {
        id: staffId,
        active: !data?.staff.active,
      },
    });
    onYes?.();
  };

  return (
    <YesNoDialog
      {...restProps}
      open={open}
      dialogTitle={data?.staff.active ? 'Make staff inactive?' : 'Make staff active?'}
      onYes={handleYes}
    />
  );
}

StaffToggleActiveDialog.propTypes = {
  staffId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onYes: PropTypes.func,
};

StaffToggleActiveDialog.defaultProps = {
  onYes: undefined,
};

export default StaffToggleActiveDialog;
