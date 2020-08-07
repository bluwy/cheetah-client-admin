import React, { useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import CompanyCreateDialog from '/@/components/company/CreateDialog';
import CompanyList from '/@/components/company/List';

function SettingsCompany() {
  const [showCompanyCreateDialog, setShowCompanyCreateDialog] = useState(false);

  return (
    <Box py={2}>
      <Typography variant="subtitle1">Companies</Typography>
      <CompanyList />
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => setShowCompanyCreateDialog(true)}
      >
        Create new company
      </Button>
      <CompanyCreateDialog
        open={showCompanyCreateDialog}
        onClose={() => setShowCompanyCreateDialog(false)}
      />
    </Box>
  );
}

export default SettingsCompany;
