import React from 'react';
import PropTypes from 'prop-types';
import {
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

function DialogTitleClosable({ children, onClose }: DialogTitleClosableProps) {
  return (
    <DialogTitle disableTypography>
      <Grid container justify="space-between">
        <Typography variant="h6" component="h2">{children}</Typography>
        <IconButton size="small" onClick={onClose ?? undefined}>
          <CloseIcon />
        </IconButton>
      </Grid>
    </DialogTitle>
  );
}

type DialogTitleClosableProps = PropTypes.InferProps<typeof DialogTitleClosable.propTypes>;

DialogTitleClosable.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
};

DialogTitleClosable.defaultProps = {
  children: undefined,
  onClose: undefined,
};

export default DialogTitleClosable;
