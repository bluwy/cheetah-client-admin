import React from 'react';
import { Typography } from '@material-ui/core';
import SettingsCompany from '/@/components/settings/Company';
import SettingsPreference from '/@/components/settings/Preference';
import SettingsStaff from '/@/components/settings/Staff';

function DashboardSettings() {
  return (
    <div>
      <Typography variant="h6">Settings</Typography>
      <SettingsPreference />
      <SettingsStaff />
      <SettingsCompany />
    </div>
  );
}

export default DashboardSettings;
