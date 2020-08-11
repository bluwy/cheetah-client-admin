import React, { useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import CustomerDatatable from '/@/components/customer/Datatable';
import CustomerCreateDialog from '/@/components/customer/CreateDialog';

function DashboardCustomers() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div>
      <Grid container justify="space-between">
        <Typography variant="h6">Customers</Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create new customer
        </Button>
      </Grid>
      <CustomerCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
      <CustomerDatatable />
    </div>
  );
}

export default DashboardCustomers;
