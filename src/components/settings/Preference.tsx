import React from 'react';
import { Box, Typography } from '@material-ui/core';
import ThemeSwitch from '/@/components/ThemeSwitch';

function SettingsPreference() {
  return (
    <Box my={2}>
      <Typography variant="subtitle1">Theme</Typography>
      <ThemeSwitch />
    </Box>
  );
}

export default SettingsPreference;
