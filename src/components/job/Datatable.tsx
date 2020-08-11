import React, { useMemo, useState, useRef } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  JobDatatableFindJobsQuery as FindQ,
  JobDatatableFindJobsQueryVariables as FindV,
  JobDatatableJobCountQuery as CountQ,
  JobDatatableJobCountQueryVariables as CountV,
  OrderByArg,
} from '/@/schema';
import Datatable, { DatatableProps } from '/@/components/Datatable';

type Job = FindQ['jobs'][number];

const FIND_JOBS = gql`
  query JobDatatableFindJobs(
    $query: String
    $skip: Int
    $first: Int
    $where: JobWhereInput
    $orderBy: JobOrderByInput
  ) {
    jobs(
      query: $query,
      skip: $skip,
      first: $first,
      where: $where,
      orderBy: $orderBy
    ) {
      id
      code
      address
      state
    }
  }
`;

const JOB_COUNT = gql`
  query JobDatatableJobCount {
    jobCount
  }
`;

function JobDatatable() {
  const dataRef = useRef<Job[]>([]);
  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(10);
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
  const [orderDesc, setOrderDesc] = useState(false);

  const { data: findData, loading: findLoading } = useQuery<FindQ, FindV>(FIND_JOBS, {
    variables: {
      skip,
      first,
      orderBy: orderBy != null ? {
        [orderBy]: orderDesc ? OrderByArg.Desc : OrderByArg.Asc,
      } : undefined,
    },
  });

  const { data: countData, loading: countLoading } = useQuery<CountQ, CountV>(JOB_COUNT);

  if (findData != null) {
    dataRef.current = findData.jobs;
  }

  const columns = useMemo(() => [
    { Header: 'Code', accessor: 'code' as const },
    { Header: 'Address', accessor: 'address' as const },
    { Header: 'State', accessor: 'state' as const },
  ], []);
  const totalCount = countData?.jobCount ?? -1;
  const sortBy = orderBy != null ? [{ id: orderBy, desc: orderDesc }] : [];

  const handleStateChange: DatatableProps<Job>['onStateChange'] = (state) => {
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

export default JobDatatable;
