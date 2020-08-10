import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactTable, { Column, SortingRule, TableState } from 'react-table';
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableFooter,
  TablePagination,
  TableSortLabel,
} from '@material-ui/core';

// Fuck packages that don't export ESM
const { useTable, usePagination, useSortBy } = ReactTable;

export interface DatatableProps<T extends object> {
  columns: Column<T>[],
  data: T[],
  totalCount: number
  pageIndex: number,
  pageSize: number,
  sortBy: SortingRule<T>[],
  onStateChange: (state: TableState<T>) => void
}

function Datatable<T extends object>(props: DatatableProps<T>) {
  const {
    columns,
    data,
    totalCount,
    pageIndex,
    pageSize,
    sortBy,
    onStateChange,
  } = props;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state,
  } = useTable(
    {
      columns,
      data,
      manualSortBy: true,
      disableMultiSort: true,
      manualPagination: true,
      pageCount: Math.ceil(totalCount / pageSize),
      initialState: {
        pageIndex,
        pageSize,
        sortBy,
      },
    },
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    onStateChange(state);
  }, [onStateChange, state]);

  return (
    <TableContainer>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.canSort && (
                    <TableSortLabel
                      active={column.isSorted}
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              page={pageIndex}
              count={totalCount}
              rowsPerPage={pageSize}
              onChangePage={(e, value) => gotoPage(value)}
              onChangeRowsPerPage={(e) => setPageSize(+e.target.value)}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

Datatable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  sortBy: PropTypes.array.isRequired,
  onStateChange: PropTypes.func.isRequired,
};

export default Datatable;
