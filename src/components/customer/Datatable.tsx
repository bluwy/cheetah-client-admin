import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  CustomerDatatableFindCustomersQuery as FindQ,
  CustomerDatatableFindCustomersQueryVariables as FindV,
  CustomerDatatableCustomerCountQuery as CountQ,
  CustomerDatatableCustomerCountQueryVariables as CountV,
} from '/@/schema';
import Datatable from '/@/components/Datatable';

const FIND_CUSTOMERS = gql`
  query CustomerDatatableFindCustomers(
    $query: String
    $skip: Int
    $first: Int
    $where: CustomerWhereInput
    $orderBy: CustomerOrderByInput
  ) {
    customers(
      query: $query,
      skip: $skip,
      first: $first,
      where: $where,
      orderBy: $orderBy
    ) {
      id
      code
      name
      active
    }
  }
`;

const CUSTOMER_COUNT = gql`
  query CustomerDatatableCustomerCount {
    customerCount
  }
`;

function CustomerDatatable() {
  const { data: findData } = useQuery<FindQ, FindV>(FIND_CUSTOMERS);
  const { data: countData } = useQuery<CountQ, CountV>(CUSTOMER_COUNT);

  const customers = findData?.customers ?? [];
  const totalCount = countData?.customerCount ?? -1;

  const columns = useMemo(() => [
    { Header: 'Code', accessor: 'code' as const },
    { Header: 'Name', accessor: 'name' as const },
    { Header: 'Active', accessor: 'active' as const },
  ], []);

  return (
    <Datatable
      columns={columns}
      data={customers}
      totalCount={totalCount}
    />
  );
}

export default CustomerDatatable;
