import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import JobDatatable from '/@/components/job/Datatable';
import JobCreateDialog from '/@/components/job/CreateDialog';

function DashboardJobs() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div>
      <Box mb={2}>
        <Grid container justify="space-between">
          <Typography variant="h6">Jobs</Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create new job
          </Button>
        </Grid>
      </Box>
      <JobCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
      <JobDatatable />
    </div>
  );
}

export default DashboardJobs;
