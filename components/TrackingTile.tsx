import React, { useContext } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { Checkin, Tracker } from '@prisma/client';

import { AppContext } from 'components/contexts/AppContext';
import { red } from '@material-ui/core/colors';
import teal from '@material-ui/core/colors/teal';

const useStyles = makeStyles((theme) => ({
  progressBar: {
    border: '1px solid black',
    width: '70vw',
  },
  progressFilled: {
    display: 'flex',
    background: teal['500'],
    height: '100%',
  },
  dayCounter: {
    flexGrow: 1,
    fontSize: '24px',
    textAlign: 'center',
  },
}));

type TrackingTileProps = {
  trackerId: number;
};
export function TrackingTile(props: TrackingTileProps) {
  const classes = useStyles();
  const appContext = useContext(AppContext);
  const { trackerId } = props;

  if (!appContext) return null;
  const { trackers, checkins } = appContext;
  const tracker = trackers.find((t) => t.id === trackerId);
  if (!tracker) return <Box>Invalid tracker id</Box>;

  return (
    <Box mt={4}>
      <Typography>{tracker.name}</Typography>
      <Box display="flex" flexDirection="row">
        <Box className={classes.progressBar}>
          <Box className={classes.progressFilled} style={{ width: '60%' }}></Box>
        </Box>
        <Box className={classes.dayCounter}>8 days</Box>
      </Box>
    </Box>
  );
}
