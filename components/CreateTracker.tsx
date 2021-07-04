import React, { useContext, useState } from 'react';
import { Backdrop, Box, Button, Fab, Fade, makeStyles, Modal, Slide, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Controller, useForm } from 'react-hook-form';
import { AppContext } from './contexts/AppContext';

const useStyles = makeStyles((theme) => ({
  createButton: {
    position: 'fixed',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
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

export function CreateTracker() {
  const classes = useStyles();
  const appContext = useContext(AppContext);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { handleSubmit, control } = useForm<FormValues>({ defaultValues });

  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);
  const onCreateClick = () => setOpen(true);

  const onSubmit = (data: FormValues) => {
    const { name, expiryDays } = data;
    console.log({ data });
    fetch('/api/trackers', { method: 'POST', body: JSON.stringify({ name, expiryDays }) })
      .then((r) => r.json())
      .then(console.log)
      .then(() => {
        appContext.refresh();
        setOpen(false);
      });
  };

  return (
    <div ref={rootRef}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
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
        <Slide direction="up" in={open}>
          <div className={classes.paper}>
            <Typography variant="body1" gutterBottom>
              Create a new Tracker
            </Typography>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    autoFocus
                    helperText="Name of what you want to track"
                  />
                )}
              />
              <Controller
                control={control}
                name="expiryDays"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Days Between"
                    variant="outlined"
                    margin="normal"
                    type="number"
                    fullWidth
                    autoFocus
                    helperText="How often should this goal be done?"
                  />
                )}
              />
              <Box mt={4} />
              <Button type="submit" fullWidth variant="contained" color="primary">
                Create
              </Button>
            </form>
          </div>
        </Slide>
      </Modal>
      <Fab color="primary" aria-label="create new tracker" className={classes.createButton} onClick={onCreateClick}>
        <AddIcon />
      </Fab>
    </div>
  );
}
