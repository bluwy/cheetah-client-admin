import React from 'react';
import { Typography } from '@material-ui/core';
import CustomerDatatable from '/@/components/customer/Datatable';

function DashboardCustomers() {
  return (
    <div>
      <Typography variant="h6">Customers</Typography>
      <CustomerDatatable />
    </div>
  );
}

export default DashboardCustomers;
