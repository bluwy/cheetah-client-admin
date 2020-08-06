import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  SettingsCompanyFindCompaniesQuery as FindCompaniesQ,
  SettingsCompanyFindCompaniesQueryVariables as FindCompaniesV,
} from '/@/schema';
import {
  Box,
  Button,
  List,
  Typography,
} from '@material-ui/core';
import CompanyCreateDialog from '/@/components/company/CreateDialog';
import CompanyListItem from './CompanyListItem';

const FIND_COMPANIES = gql`
  query SettingsCompanyFindCompanies {
    companies {
      id
      name
    }
  }
`;

function SettingsCompany() {
  const { data } = useQuery<FindCompaniesQ, FindCompaniesV>(FIND_COMPANIES);

  const [showCompanyCreateDialog, setShowCompanyCreateDialog] = useState(false);

  const companies = data?.companies ?? [];

  return (
    <Box py={2}>
      <Typography variant="subtitle1">Companies</Typography>
      <List dense>
        {companies.map((company) => (
          <CompanyListItem key={company.id} companyId={company.id} />
        ))}
      </List>
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
