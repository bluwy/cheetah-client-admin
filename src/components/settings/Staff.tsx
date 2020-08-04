import React, { useState } from 'react';
import clsx from 'clsx';
import { gql, useQuery } from '@apollo/client';
import {
  SettingsStaffFindStaffsQuery as FindStaffsQ,
  SettingsStaffFindStaffsQueryVariables as FindStaffsV,
} from '/@/schema';
import {
  makeStyles,
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

const FIND_STAFFS = gql`
  query SettingsStaffFindStaffs {
    staffs {
      id
      fullName
      active
      paired
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  inactiveItemText: {
    opacity: 0.5,
  },
}));

function SettingsStaff() {
  const { data } = useQuery<FindStaffsQ, FindStaffsV>(FIND_STAFFS);
  const activeStaffs = data?.staffs.filter((v) => v.active) ?? [];
  const inactiveStaffs = data?.staffs.filter((v) => !v.active) ?? [];

  const classes = useStyles();
  const [showInactive, setShowInactive] = useState(false);

  return (
    <Box py={2}>
      <Typography variant="subtitle1">Staff</Typography>
      <List dense>
        {activeStaffs.map((staff) => (
          <ListItem key={staff.id}>
            <ListItemText>{staff.fullName}</ListItemText>
          </ListItem>
        ))}
      </List>
      {inactiveStaffs.length > 0 && (
        <>
          <Button
            size="small"
            aria-expanded={showInactive}
            onClick={() => setShowInactive((v) => !v)}
            endIcon={(
              <ExpandMoreIcon
                className={clsx(classes.expand, {
                  [classes.expandOpen]: showInactive,
                })}
              />
        )}
          >
            View inactive staffs
          </Button>
          <Collapse in={showInactive} timeout="auto">
            <List dense>
              {inactiveStaffs.map((staff) => (
                <ListItem key={staff.id}>
                  <ListItemText className={classes.inactiveItemText}>
                    {staff.fullName}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      )}
    </Box>
  );
}

export default SettingsStaff;
