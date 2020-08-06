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
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import CompanyCreateDialog from '/@/components/company/CreateDialog';

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
          <ListItem key={company.id}>
            <ListItemText>{company.name}</ListItemText>
          </ListItem>
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
