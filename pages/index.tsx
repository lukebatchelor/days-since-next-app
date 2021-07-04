import { Checkin, User } from '@prisma/client';
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

import { AppContext } from 'components/contexts/AppContext';
import { TrackingTile } from 'components/TrackingTile';
import { CreateTracker } from 'components/CreateTracker';

const useStyles = makeStyles((theme) => ({
  container: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function Home() {
  const classes = useStyles();
  const appContext = useContext(AppContext);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Days Since App</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box mt={4} />
        <Typography variant="h4" gutterBottom>
          Your Trackers
        </Typography>
        <Box>
          {appContext &&
            appContext.trackers &&
            appContext.trackers.map((tracker) => <TrackingTile key={tracker.id} trackerId={tracker.id} />)}
        </Box>
        <CreateTracker />
      </Container>
    </Box>
  );
}
