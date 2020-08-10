import React, { useMemo, useState, useRef } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  CustomerDatatableFindCustomersQuery as FindQ,
  CustomerDatatableFindCustomersQueryVariables as FindV,
  CustomerDatatableCustomerCountQuery as CountQ,
  CustomerDatatableCustomerCountQueryVariables as CountV,
  OrderByArg,
} from '/@/schema';
import Datatable, { DatatableProps } from '/@/components/Datatable';

type Customer = FindQ['customers'][number];

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
  const dataRef = useRef<Customer[]>([]);
  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(10);
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
  const [orderDesc, setOrderDesc] = useState(false);

  const { data: findData, loading: findLoading } = useQuery<FindQ, FindV>(FIND_CUSTOMERS, {
    variables: {
      skip,
      first,
      orderBy: orderBy != null ? {
        [orderBy]: orderDesc ? OrderByArg.Desc : OrderByArg.Asc,
      } : undefined,
    },
  });

  const { data: countData, loading: countLoading } = useQuery<CountQ, CountV>(CUSTOMER_COUNT);

  if (findData != null) {
    dataRef.current = findData.customers;
  }

  const columns = useMemo(() => [
    { Header: 'Code', accessor: 'code' as const },
    { Header: 'Name', accessor: 'name' as const },
    { Header: 'Active', accessor: 'active' as const },
  ], []);
  const totalCount = countData?.customerCount ?? -1;
  const sortBy = orderBy != null ? [{ id: orderBy, desc: orderDesc }] : [];

  const handleStateChange: DatatableProps<Customer>['onStateChange'] = (state) => {
    setSkip(state.pageIndex);
    setFirst(state.pageSize);
    setOrderBy(state.sortBy?.[0]?.id ?? undefined);
    setOrderDesc(state.sortBy?.[0]?.desc ?? false);
  };

  return (
    <Datatable
      columns={columns}
      data={dataRef.current}
      loading={findLoading || countLoading}
      totalCount={totalCount}
      pageIndex={skip}
      pageSize={first}
      sortBy={sortBy}
      onStateChange={handleStateChange}
    />
  );
}

export default CustomerDatatable;
