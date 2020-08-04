import React, { ChangeEvent } from 'react';
import { gql, useQuery } from '@apollo/client';
import { appTheme } from '/@/store/vars';
import {
  GetAppThemeQuery as AppThemeQ,
  GetAppThemeQueryVariables as AppThemeV,
} from '/@/schema';
import { FormControlLabel, Switch } from '@material-ui/core';

const APP_THEME = gql`
  query ThemeSwitchGetAppTheme {
    appTheme @client
  }
`;

function ThemeSwitch() {
  const { data } = useQuery<AppThemeQ, AppThemeV>(APP_THEME);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    appTheme(e.target.checked ? 'dark' : 'light');
  };

  return (
    <FormControlLabel
      label="Dark mode"
      control={<Switch checked={data?.appTheme === 'dark'} onChange={handleChange} />}
    />
  );
}

export default ThemeSwitch;
