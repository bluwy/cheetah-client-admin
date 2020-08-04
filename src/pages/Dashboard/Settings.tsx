import React from 'react';
import { Typography, Box } from '@material-ui/core';
import ThemeSwitch from '/@/components/ThemeSwitch';

function DashboardSettings() {
  return (
    <div>
      <Typography variant="h6">Settings</Typography>
      <Box my={2}>
        <Typography variant="subtitle1">Theme</Typography>
        <ThemeSwitch />
      </Box>
    </div>
  );
}

export default DashboardSettings;
