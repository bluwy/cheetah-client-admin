import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  SettingsCompanyFindCompaniesQuery as FindCompaniesQ,
  SettingsCompanyFindCompaniesQueryVariables as FindCompaniesV,
} from '/@/schema';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';

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
    </Box>
  );
}

export default SettingsCompany;
