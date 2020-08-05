import React, { useState } from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import JobCreateDialog from '/@/components/job/CreateDialog';

function DashboardHome() {
  const [jobCreateDialogOpen, setJobCreateDialogOpen] = useState(false);

  return (
    <div>
      <Grid container justify="space-between">
        <Typography variant="h6">Welcome, User</Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setJobCreateDialogOpen(true)}
        >
          Create new job
        </Button>
      </Grid>
      <JobCreateDialog
        open={jobCreateDialogOpen}
        onClose={() => setJobCreateDialogOpen(false)}
      />
      Home
    </div>
  );
}

export default DashboardHome;
