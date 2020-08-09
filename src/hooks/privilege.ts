import { gql, useQuery } from '@apollo/client';
import {
  AdminPrivilege,
  PrivilegeHookGetPrivilegeQuery as GetPrivilegeQ,
  PrivilegeHookGetPrivilegeQueryVariables as GetPrivilegeV,
} from '/@/schema';

const GET_PRIVILEGE = gql`
  query PrivilegeHookGetPrivilege {
    admin {
      id
      privilege
    }
  }
`;

export default function usePrivilege() {
  const { data } = useQuery<GetPrivilegeQ, GetPrivilegeV>(GET_PRIVILEGE);

  const privilege = data?.admin.privilege;

  return {
    isPrivilegeBasic: privilege === AdminPrivilege.Basic,
    isPrivilegeFull: privilege === AdminPrivilege.Full,
  };
}
