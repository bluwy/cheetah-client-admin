import React from 'react';
import { Box, Typography } from '@material-ui/core';
import usePrivilege from '/@/hooks/privilege';
import SettingsCompany from '/@/components/settings/Company';
import SettingsPreference from '/@/components/settings/Preference';
import SettingsStaff from '/@/components/settings/Staff';

function DashboardSettings() {
  const { isPrivilegeFull } = usePrivilege();

  return (
    <div>
      <Box mb={2}>
        <Typography variant="h6">Settings</Typography>
      </Box>
      <SettingsPreference />
      {isPrivilegeFull && (
        <>
          <SettingsStaff />
          <SettingsCompany />
        </>
      )}
    </div>
  );
}

export default DashboardSettings;
