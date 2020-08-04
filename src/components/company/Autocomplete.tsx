import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  CompanyAutocompleteFindCompaniesQuery as FindCompaniesQ,
  CompanyAutocompleteFindCompaniesQueryVariables as FindCompaniesV,
} from '/@/schema';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';

export type CompanyAutocompleteCompany = FindCompaniesQ['companies'][number];

export type CompanyAutocompleteProps<
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> = Omit<
AutocompleteProps<CompanyAutocompleteCompany, Multiple, DisableClearable, FreeSolo>,
'loading' | 'getOptionLabel' | 'options'
>;

const FIND_COMPANIES = gql`
  query CompanyAutocompleteFindCompanies {
    companies {
      id
      name
    }
  }
`;

function CompanyAutocomplete<
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(props: CompanyAutocompleteProps<Multiple, DisableClearable, FreeSolo>) {
  const { loading, data } = useQuery<FindCompaniesQ, FindCompaniesV>(FIND_COMPANIES);

  return (
    <Autocomplete
      {...props}
      loading={loading}
      getOptionLabel={(v) => v.name}
      options={data?.companies ?? []}
    />
  );
}

export default CompanyAutocomplete;
