import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  StaffAutocompleteFindStaffsQuery as FindStaffsQ,
  StaffAutocompleteFindStaffsQueryVariables as FindStaffsV,
} from '/@/schema';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';

export type StaffAutocompleteProps<
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> = Omit<
AutocompleteProps<string, Multiple, DisableClearable, FreeSolo>,
'loading' | 'getOptionLabel' | 'options'
>;

const FIND_STAFFS = gql`
  query StaffAutocompleteFindStaffs {
    staffs {
      id
      fullName
    }
  }
`;

function StaffAutocomplete<
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(props: StaffAutocompleteProps<Multiple, DisableClearable, FreeSolo>) {
  const { loading, data } = useQuery<FindStaffsQ, FindStaffsV>(FIND_STAFFS);

  const options = data?.staffs.map((v) => v.id) ?? [];

  const getOptionLabel = (id: string) => data?.staffs.find((v) => v.id === id)?.fullName ?? 'Invalid ID';

  return (
    <Autocomplete
      {...props}
      loading={loading}
      getOptionLabel={getOptionLabel}
      options={options}
    />
  );
}

export default StaffAutocomplete;
