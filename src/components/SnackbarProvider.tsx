import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Snackbar, SnackbarCloseReason } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';

interface Snack {
  severity: Color
  message: string
}

type PushSnackFn = (snack: Snack) => void;

const SnackbarContext = createContext<PushSnackFn>(() => {});

export function useSnackbar() {
  return useContext(SnackbarContext);
}

function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [open, setOpen] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [snacks, setSnacks] = useState<Snack[]>([]);

  useEffect(() => {
    if (snacks.length > 0) {
      if (isShowing) {
        setOpen(false);
      } else {
        setOpen(true);
        setIsShowing(true);
      }
    }
  }, [snacks]);

  const pushSnack = useCallback((snack: Snack) => {
    setSnacks((v) => v.concat([snack]));
  }, []);

  const handleClose = (event: React.SyntheticEvent, reason: SnackbarCloseReason) => {
    if (reason === 'timeout') {
      setOpen(false);
    }
  };

  const handleExited = () => {
    setSnacks((v) => v.slice(1));
    setIsShowing(false);
  };

  return (
    <SnackbarContext.Provider value={pushSnack}>
      {children}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={handleClose}
        onExited={handleExited}
      >
        <Alert severity={snacks[0]?.severity} variant="filled">
          {snacks[0]?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

type SnackbarProviderProps = PropTypes.InferProps<typeof SnackbarProvider.propTypes>;

SnackbarProvider.propTypes = {
  children: PropTypes.node,
};

SnackbarProvider.defaultProps = {
  children: undefined,
};

export default SnackbarProvider;
