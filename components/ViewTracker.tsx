import React, { useContext, useState } from 'react';
import { Backdrop, Box, Button, Fab, Fade, makeStyles, Modal, Slide, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Controller, useForm } from 'react-hook-form';
import { Tracker } from '@prisma/client';
import { AppContext } from './contexts/AppContext';

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

  const onCreateClick = () => {};
  const onCheckinDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setCheckinDate(e.target.valueAsDate);

  if (!open || !tracker) return null;
  const checkins = appContext.checkins.filter((c) => c.tracker_id === tracker.id);
  const todayDateStr = new Date().toISOString().split('T')[0];
  const onAddCheckinClicked = () => {
    fetch('/api/checkins', { method: 'POST', body: JSON.stringify({ date: checkinDate, trackerId: tracker.id }) })
      .then((r) => r.json())
      .then(console.log)
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
            <Typography variant="body1" gutterBottom>
              {tracker.name}
            </Typography>
            <Box mb={4} display="flex" flexDirection="column">
              {checkins.map((c) => (
                <Box key={c.id}>{new Date(c.checkin_date).toISOString().split('T')[0].replace(/-/g, '/')}</Box>
              ))}
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
          </div>
        </Slide>
      </Modal>
    </div>
  );
}
