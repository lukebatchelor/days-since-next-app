import React, { useContext, useEffect, useState } from 'react';
import {
  Backdrop,
  Box,
  Button,
  Fab,
  Fade,
  IconButton,
  makeStyles,
  Modal,
  Slide,
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Controller, useForm } from 'react-hook-form';
import { Checkin, Tracker } from '@prisma/client';
import { AppContext } from './contexts/AppContext';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { DeleteCheckinsReq, DeleteTrackerReq, PostCheckinsReq } from '../typings/api';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    // height: '80vh',
    width: '80vw',
  },
}));

type FormValues = {
  name: string;
  expiryDays: number;
};

const defaultValues: FormValues = {
  name: '',
  expiryDays: 7,
};

type ViewTrackerProps = {
  open: boolean;
  tracker: Tracker;
  onClose: () => void;
};
export function ViewTracker(props: ViewTrackerProps) {
  const { open, tracker, onClose } = props;
  const classes = useStyles();
  const appContext = useContext(AppContext);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { handleSubmit, control } = useForm<FormValues>({ defaultValues });
  const [checkinDate, setCheckinDate] = useState<Date>(null);
  const [deleting, setDeleting] = useState<Checkin>(null);

  const onCheckinDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setCheckinDate(e.target.valueAsDate);

  useEffect(() => {
    setCheckinDate(new Date());
  }, []);

  if (!open || !tracker) return null;
  const checkins = appContext.checkins.filter((c) => c.tracker_id === tracker.id);
  const todayDateStr = new Date().toISOString().split('T')[0];
  const onAddCheckinClicked = () => {
    const body: PostCheckinsReq = { date: checkinDate, trackerId: tracker.id };
    fetch('/api/checkins', { method: 'POST', body: JSON.stringify(body) })
      .then((r) => r.json())
      .then(() => {
        appContext.refresh();
        onClose();
      });
  };

  const onCheckinClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const div = e.target as HTMLDivElement;
    if (!div.classList.contains('checkin') || !div.dataset['checkinId']) return;
    const checkinId = Number(div.dataset['checkinId']);
    const checkin = checkins.find((c) => c.id === checkinId);
    if (checkin) setDeleting(checkin);
  };
  const onDeleteCancel = () => setDeleting(null);
  const onDeleteConfirm = () => {
    const body: DeleteCheckinsReq = { checkinId: deleting.id };
    fetch('/api/checkins', { method: 'DELETE', body: JSON.stringify(body) })
      .then((r) => r.json())
      .then(() => {
        appContext.refresh();
        setDeleting(null);
      });
  };
  const deleteTrackerClick = () => {
    const body: DeleteTrackerReq = { trackerId: tracker.id };
    fetch('/api/trackers', { method: 'DELETE', body: JSON.stringify(body) })
      .then((r) => r.json())
      .then(() => {
        appContext.refresh();
        onClose();
      });
  };

  return (
    <div ref={rootRef}>
      <Modal
        className={classes.modal}
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        container={() => rootRef.current}
      >
        <Slide direction="left" in={open}>
          <div className={classes.paper}>
            <Box display="flex">
              <Box flexGrow={1}>
                <Typography variant="body1" gutterBottom>
                  {tracker.name}
                </Typography>
                <Box mb={4} display="flex" flexDirection="column" onClick={onCheckinClick}>
                  {checkins.map((c) => (
                    <Box key={c.id} data-checkin-id={c.id} className="checkin">
                      {new Date(c.checkin_date).toISOString().split('T')[0].replace(/-/g, '/')}
                    </Box>
                  ))}
                </Box>
              </Box>
              {!!deleting && (
                <Box maxWidth="min-content">
                  <Box>
                    Are you sure you want to delete{' '}
                    {new Date(deleting.checkin_date).toISOString().split('T')[0].replace(/-/g, '/')}?
                  </Box>
                  <Box display="flex" justifyContent="space-around">
                    <IconButton aria-label="delete" className="" size="small" onClick={onDeleteCancel}>
                      <CancelIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="delete" className="" size="small" onClick={onDeleteConfirm}>
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>

            <TextField
              id="checkin-date"
              label="Date of check-in"
              type="date"
              defaultValue={todayDateStr}
              onChange={onCheckinDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Box mt={4} />
            <Button type="submit" fullWidth variant="contained" color="primary" onClick={onAddCheckinClicked}>
              Add check-in
            </Button>
            <Box mt={2} />
            <Button variant="contained" fullWidth color="secondary" onClick={deleteTrackerClick}>
              Delete Tracker
            </Button>
          </div>
        </Slide>
      </Modal>
    </div>
  );
}
