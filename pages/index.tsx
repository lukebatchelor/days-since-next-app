import { Checkin, Tracker, User } from '@prisma/client';
import {
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import DateRangeIcon from '@material-ui/icons/DateRange';

import { AppContext } from 'components/contexts/AppContext';
import { TrackingTile } from 'components/TrackingTile';
import { CreateTracker } from 'components/CreateTracker';
import { ViewTracker } from 'components/ViewTracker';

const useStyles = makeStyles((theme) => ({
  container: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function Home() {
  const classes = useStyles();
  const appContext = useContext(AppContext);

  const [selectedTracker, setSelectedTracker] = useState<Tracker>(null);

  const onViewTrackerClose = () => setSelectedTracker(null);
  const onTrackerClick = (tracker: Tracker) => {
    setSelectedTracker(tracker);
  };

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <DateRangeIcon />
          </IconButton>
          <Typography variant="h6">Days Since App</Typography>
        </Toolbar>
      </AppBar>
      <Box mt={8} />
      <Container>
        {/* <Box mt={4} /> */}
        <Typography variant="h4" gutterBottom>
          Your Trackers
        </Typography>
        <Box>
          {appContext &&
            appContext.trackers &&
            appContext.trackers.map((tracker) => (
              <TrackingTile key={tracker.id} trackerId={tracker.id} onTrackerClick={onTrackerClick} />
            ))}
        </Box>
        <CreateTracker />
        <ViewTracker open={!!selectedTracker} tracker={selectedTracker} onClose={onViewTrackerClose} />
      </Container>
    </Box>
  );
}
