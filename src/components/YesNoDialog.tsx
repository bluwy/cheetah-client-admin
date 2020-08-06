import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogProps,
} from '@material-ui/core';

export interface YesNoDialogProps extends Omit<DialogProps, 'onClose'> {
  dialogTitle?: string
  yesText?: string
  noText?: string
  onYes?: () => void
  onNo?: () => void
  onClose?: () => void
}

function YesNoDialog(props: YesNoDialogProps) {
  const {
    dialogTitle,
    yesText,
    noText,
    onYes,
    onNo,
    onClose,
    children,
    ...restProps
  } = props;

  const handleYes = () => {
    onYes?.();
    onClose?.();
  };

  const handleNo = () => {
    onNo?.();
    onClose?.();
  };

  return (
    <Dialog {...restProps} onClose={handleNo}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleNo}>
          {noText}
        </Button>
        <Button color="primary" onClick={handleYes}>
          {yesText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

YesNoDialog.propTypes = {
  dialogTitle: PropTypes.string,
  yesText: PropTypes.string,
  noText: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
  onClose: PropTypes.func,
};

YesNoDialog.defaultProps = {
  dialogTitle: 'Are you sure?',
  yesText: 'Yes',
  noText: 'No',
  onYes: undefined,
  onNo: undefined,
  onClose: undefined,
};

export default YesNoDialog;
