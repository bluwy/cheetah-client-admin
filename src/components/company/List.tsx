import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  CompanyListFindCompaniesQuery as FindCompaniesQ,
  CompanyListFindCompaniesQueryVariables as FindCompaniesV,
} from '/@/schema';
import { Box, List } from '@material-ui/core';
import CompanyListItem from './ListItem';

const FIND_COMPANIES = gql`
  query CompanyListFindCompanies {
    companies {
      id
      name
    }
  }
`;

function CompanyList() {
  const { data } = useQuery<FindCompaniesQ, FindCompaniesV>(FIND_COMPANIES);
  const companies = data?.companies ?? [];

  return (
    <Box maxWidth="400px">
      <List dense>
        {companies.map((company) => (
          <CompanyListItem key={company.id} companyId={company.id} />
        ))}
      </List>
    </Box>
  );
}

export default CompanyList;
