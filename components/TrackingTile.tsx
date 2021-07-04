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

function getDaysBetween(d1: Date, d2: Date) {
  console.log({ d1, d2 });
  const d1Start = new Date(d1.toISOString().split('T')[0]);
  const d2Start = new Date(d2.toISOString().split('T')[0]);
  return Math.round(Math.abs(d1Start - d2Start) / (1000 * 60 * 60 * 24)); // @ts-ignore
}

type TrackingTileProps = {
  trackerId: number;
  onTrackerClick: (tracker: Tracker) => void;
};
export function TrackingTile(props: TrackingTileProps) {
  const classes = useStyles();
  const appContext = useContext(AppContext);
  const { trackerId, onTrackerClick } = props;

  if (!appContext) return null;
  const { trackers, checkins } = appContext;
  const tracker = trackers.find((t) => t.id === trackerId);
  if (!tracker) return <Box>Invalid tracker id</Box>;

  const lastCheckin = checkins.filter((c) => c.tracker_id === trackerId)[0];
  const daysBetween = getDaysBetween(lastCheckin ? new Date(lastCheckin.checkin_date) : new Date(), new Date());
  const fillPercent = (daysBetween / tracker.expiry_days) * 100;

  return (
    <Box mt={4} onClick={() => onTrackerClick(tracker)}>
      <Typography>{tracker.name}</Typography>
      <Box display="flex" flexDirection="row">
        <Box className={classes.progressBar}>
          <Box className={classes.progressFilled} style={{ width: `${fillPercent}%` }}></Box>
        </Box>
        <Box className={classes.dayCounter}>{daysBetween} days</Box>
      </Box>
    </Box>
  );
}
