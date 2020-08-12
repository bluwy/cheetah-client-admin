import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  StaffListFindStaffsQuery as FindStaffsQ,
  StaffListFindStaffsQueryVariables as FindStaffsV,
} from '/@/schema';
import { Box, List } from '@material-ui/core';
import StaffListItem from './ListItem';

const FIND_STAFFS = gql`
  query StaffListFindStaffs {
    staffs {
      id
      fullName
      active
      paired
    }
  }
`;

function StaffList() {
  const { data } = useQuery<FindStaffsQ, FindStaffsV>(FIND_STAFFS);
  const staffs = data?.staffs ?? [];

  return (
    <Box maxWidth="400px">
      <List dense>
        {staffs.map((staff) => (
          <StaffListItem key={staff.id} data={staff} />
        ))}
      </List>
    </Box>
  );
}

export default StaffList;
