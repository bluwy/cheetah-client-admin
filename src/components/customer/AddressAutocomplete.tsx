import React, { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import {
  CustomerAddressAutocompleteFindCustomerQuery as FindCustomerQ,
  CustomerAddressAutocompleteFindCustomerQueryVariables as FindCustomerV,
} from '/@/schema';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';

export type CustomerAddressAutocompleteProps<
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> = Omit<
AutocompleteProps<string, Multiple, DisableClearable, FreeSolo>,
'loading' | 'options'
> & {
  customerId?: string
};

const FIND_CUSTOMER = gql`
  query CustomerAddressAutocompleteFindCustomer($id: ID!) {
    customer(id: $id) {
      id
      addresses
    }
  }
`;

function CustomerAddressAutocomplete<
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(props: CustomerAddressAutocompleteProps<Multiple, DisableClearable, FreeSolo>) {
  const { customerId, ...restProps } = props;

  const [
    findCustomer,
    { loading, data },
  ] = useLazyQuery<FindCustomerQ, FindCustomerV>(FIND_CUSTOMER);

  useEffect(() => {
    if (customerId != null) {
      findCustomer({
        variables: {
          id: customerId,
        },
      });
    }
  }, [customerId]);

  return (
    <Autocomplete
      {...restProps}
      loading={loading}
      options={data?.customer.addresses ?? []}
    />
  );
}

export default CustomerAddressAutocomplete;
