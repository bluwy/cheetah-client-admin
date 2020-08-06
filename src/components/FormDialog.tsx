import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@material-ui/core';
import DialogTitleClosable from './DialogTitleClosable';

export interface FormDialogProps extends Omit<DialogProps, 'onSubmit' | 'onClose'> {
  dialogTitle: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

function FormDialog(props: FormDialogProps) {
  const {
    dialogTitle,
    onSubmit,
    onClose,
    children,
    ...restProps
  } = props;

  return (
    <Dialog {...restProps} onClose={onClose}>
      <form noValidate onSubmit={onSubmit}>
        <DialogTitleClosable onClose={onClose}>
          {dialogTitle}
        </DialogTitleClosable>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// Only declare custom prop type
FormDialog.propTypes = {
  dialogTitle: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FormDialog;
