import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactTable, { Column } from 'react-table';
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableFooter,
  TablePagination,
} from '@material-ui/core';

// Fuck packages that don't export ESM
const { useTable, usePagination } = ReactTable;

interface DatatableProps<T extends object> {
  columns: Column<T>[],
  data: T[],
  totalCount: number
}

function Datatable<T extends object>(props: DatatableProps<T>) {
  const { columns, data, totalCount } = props;
  const [pageSize, setPageSize] = useState(10);
  const {
    getTableProps,
    headerGroups,
    page,
    prepareRow,
    state: {
      pageIndex,
    },
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      pageCount: Math.ceil(totalCount / pageSize),
      initialState: {
        pageSize,
        pageIndex: 0,
      },
    },
    usePagination,
  );

  return (
    <TableContainer>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
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
              onChangePage={(e, value) => setPageSize(value)}
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
};

export default Datatable;
