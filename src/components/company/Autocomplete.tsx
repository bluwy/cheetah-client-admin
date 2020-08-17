import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  CompanyAutocompleteFindCompaniesQuery as FindCompaniesQ,
  CompanyAutocompleteFindCompaniesQueryVariables as FindCompaniesV,
} from '/@/schema';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';

export type CompanyAutocompleteProps<
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> = Omit<
AutocompleteProps<string, Multiple, DisableClearable, FreeSolo>,
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

  const options = data?.companies.map((v) => v.id) ?? [];

  const getOptionLabel = (id: string) => data?.companies.find((v) => v.id === id)?.name ?? 'Invalid ID';

  return (
    <Autocomplete
      {...props}
      loading={loading}
      getOptionLabel={getOptionLabel}
      options={options}
    />
  );
}

export default CompanyAutocomplete;
