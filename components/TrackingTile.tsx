import React, { useContext } from 'react';
import { Box, makeStyles, TableCell, TableRow, Typography } from '@material-ui/core';

import { AppContext } from 'components/contexts/AppContext';
import { teal } from '@material-ui/core/colors';
import { Tracker } from '@prisma/client';
import { red, orange, yellow, green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  progressBar: {
    border: '1px solid black',
    width: '60vw',
    height: '40px',
  },
  progressFilled: {
    display: 'flex',
    background: teal['500'],
    height: '100%',
  },
  dayCounter: {
    fontSize: '24px',
    verticalAlign: 'middle',
    paddingTop: '30px',
  },
}));

function getDaysBetween(d1: Date, d2: Date) {
  console.log({ d1, d2 });
  const d1Start = new Date(d1.toISOString().split('T')[0]);
  const d2Start = new Date(d2.toISOString().split('T')[0]);
  // @ts-ignore
  return Math.round(Math.abs(d1Start - d2Start) / (1000 * 60 * 60 * 24));
}

function getColor(daysLeft: number, expiryDays: number) {
  const percent = (daysLeft / expiryDays) * 100;
  if (percent > 70) return green[500];
  if (percent > 50) return yellow[600];
  if (percent > 20) return orange[500];
  return red[500];
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
  const lastCheckinDate = lastCheckin ? new Date(lastCheckin.checkin_date) : new Date();
  const daysBetween = getDaysBetween(lastCheckinDate, new Date());
  const daysLeft = tracker.expiry_days - daysBetween;
  const fillPercent = (daysLeft / tracker.expiry_days) * 100;

  return (
    <TableRow key={tracker.id}>
      <TableCell component="th" scope="row">
        <Box onClick={() => onTrackerClick(tracker)}>
          <Typography>{tracker.name}</Typography>
          <Box display="flex" flexDirection="row">
            <Box className={classes.progressBar}>
              <Box
                className={classes.progressFilled}
                style={{ width: `${fillPercent}%`, background: getColor(daysLeft, tracker.expiry_days) }}
              ></Box>
            </Box>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="center" className={classes.dayCounter}>
        {daysLeft}
      </TableCell>
    </TableRow>
  );
}
