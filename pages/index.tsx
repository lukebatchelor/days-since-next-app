import { Checkin, Tracker, User } from '@prisma/client';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Fab,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';

import { AppContext } from '../components/contexts/AppContext';
import { CreateTracker } from '../components/CreateTracker';
import { TrackingTile } from '../components/TrackingTile';
import { ViewTracker } from '../components/ViewTracker';
import { getDaysLeft } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  container: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function Home() {
  const classes = useStyles();
  const appContext = useContext(AppContext);
  const [session, loading] = useSession();
  const [selectedTracker, setSelectedTracker] = useState<Tracker>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const avatarRef = useRef(null);
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  if (!session) {
    router.push('/api/auth/signin');
  }

  const onViewTrackerClose = () => setSelectedTracker(null);
  const onTrackerClick = (tracker: Tracker) => {
    setSelectedTracker(tracker);
  };

  const handleAvatarMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const trackers = appContext && appContext.trackers ? appContext.trackers : [];
  const sortedTrackers = trackers.sort((a, b) => {
    const aDaysLeft = getDaysLeft(a, appContext.checkins);
    const bDaysLeft = getDaysLeft(b, appContext.checkins);
    return aDaysLeft - bDaysLeft;
  });

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <DateRangeIcon />
          </IconButton>
          <Typography variant="h6">Days Since App</Typography>
          <Box
            display="flex"
            justifyContent="flex-end"
            flexGrow={1}
            justifySelf="flex-end"
            id="avatar-menu"
            onClick={handleAvatarMenuClick}
          >
            <Avatar ref={avatarRef} alt="Remy Sharp" src={session?.user?.image} />
          </Box>
          <Menu
            id="avatar-menu"
            anchorEl={avatarRef.current}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => signOut({ redirect: false }) && handleClose()}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box mt={8} />
      <Container>
        {/* <Box mt={4} /> */}
        <Typography variant="h4" gutterBottom>
          Your Trackers
        </Typography>
        <TableContainer component={Paper}>
          <Table className="" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Tracker</TableCell>
                <TableCell align="right">Days left</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTrackers &&
                sortedTrackers.map((tracker) => (
                  <TrackingTile key={tracker.id} trackerId={tracker.id} onTrackerClick={onTrackerClick} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CreateTracker />
        <ViewTracker open={!!selectedTracker} tracker={selectedTracker} onClose={onViewTrackerClose} />
      </Container>
    </Box>
  );
}
