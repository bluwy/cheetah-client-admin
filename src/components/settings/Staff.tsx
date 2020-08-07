import React, { useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import StaffCreateDialog from '/@/components/staff/CreateDialog';
import StaffList from '/@/components/staff/List';

function SettingsStaff() {
  const [showStaffCreateDialog, setShowStaffCreateDialog] = useState(false);

  return (
    <Box py={2}>
      <Typography variant="subtitle1">Staff</Typography>
      <StaffList />
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => setShowStaffCreateDialog(true)}
      >
        Create new staff
      </Button>
      <StaffCreateDialog
        open={showStaffCreateDialog}
        onClose={() => setShowStaffCreateDialog(false)}
      />
    </Box>
  );
}

export default SettingsStaff;
