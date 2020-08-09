import React from 'react';
import { Typography } from '@material-ui/core';
import usePrivilege from '/@/hooks/privilege';
import SettingsCompany from '/@/components/settings/Company';
import SettingsPreference from '/@/components/settings/Preference';
import SettingsStaff from '/@/components/settings/Staff';

function DashboardSettings() {
  const { isPrivilegeFull } = usePrivilege();

  return (
    <div>
      <Typography variant="h6">Settings</Typography>
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
