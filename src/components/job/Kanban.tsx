import React from 'react';
import { Grid, Divider } from '@material-ui/core';
import KanbanTodo from './KanbanTodo';
import KanbanProgress from './KanbanProgress';
import KanbanDone from './KanbanDone';

function JobKanban() {
  return (
    <Grid container spacing={4} wrap="nowrap">
      <Grid item xs={4}>
        <KanbanTodo />
      </Grid>
      <Divider orientation="vertical" light flexItem />
      <Grid item xs={4}>
        <KanbanProgress />
      </Grid>
      <Divider orientation="vertical" light flexItem />
      <Grid item xs={4}>
        <KanbanDone />
      </Grid>
    </Grid>
  );
}

export default JobKanban;
