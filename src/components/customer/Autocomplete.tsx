import React, { useCallback } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import {
  CustomerAutocompleteFindCustomersQuery as FindCustomersQ,
  CustomerAutocompleteFindCustomersQueryVariables as FindCustomersV,
} from '/@/schema';
import { debounce } from '/@/utils';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';

export type CustomerAutocompleteCustomer = FindCustomersQ['customers'][number];

export type CustomerAutocompleteProps<
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> = Omit<
AutocompleteProps<CustomerAutocompleteCustomer, Multiple, DisableClearable, FreeSolo>,
'loading' | 'getOptionLabel' | 'options'
>;

const FIND_CUSTOMERS = gql`
  query CustomerAutocompleteFindCustomers($query: String) {
    customers(query: $query) {
      id
      name
    }
  }
`;

function CustomerAutocomplete<
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(props: CustomerAutocompleteProps<Multiple, DisableClearable, FreeSolo>) {
  const { onInputChange, ...restProps } = props;

  const [
    findCustomers,
    { loading, data },
  ] = useLazyQuery<FindCustomersQ, FindCustomersV>(FIND_CUSTOMERS);

  const debouncedFindCustomers = useCallback(debounce((query: string) => {
    findCustomers({
      variables: { query },
    });
  }, 300), []);

  const handleInputChange: typeof onInputChange = (...args) => {
    if (onInputChange != null) {
      onInputChange(...args);
    }
    debouncedFindCustomers(args[1]);
  };

  return (
    <Autocomplete
      {...restProps}
      loading={loading}
      getOptionLabel={(v) => v.name}
      options={data?.customers ?? []}
      onInputChange={handleInputChange}
    />
  );
}

export default CustomerAutocomplete;
