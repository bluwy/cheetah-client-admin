import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import JobCreateDialog from '/@/components/job/CreateDialog';
import JobKanban from '/@/components/job/Kanban';

function DashboardHome() {
  const [jobCreateDialogOpen, setJobCreateDialogOpen] = useState(false);

  return (
    <div>
      <Box mb={2}>
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
      </Box>
      <JobKanban />
      <JobCreateDialog
        open={jobCreateDialogOpen}
        onClose={() => setJobCreateDialogOpen(false)}
      />
    </div>
  );
}

export default DashboardHome;
