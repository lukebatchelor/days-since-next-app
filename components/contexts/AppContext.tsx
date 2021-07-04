import { Checkin } from '.prisma/client';
import { Tracker } from '@prisma/client';
import React, { useEffect, useState } from 'react';

export type AppContextType = {
  trackers: Array<Tracker>;
  checkins: Array<Checkin>;
  refresh: () => void;
};

const defaultAppContext: AppContextType = {
  trackers: [],
  checkins: [],
  refresh: () => {},
};
const AppContext = React.createContext<AppContextType>(defaultAppContext);

type Props = {
  children: React.ReactNode;
};
const AppContextProvider: React.FC = (props: Props) => {
  const [trackers, setTrackers] = useState<Array<Tracker>>([]);
  const [checkins, setCheckins] = useState<Array<Checkin>>([]);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    fetch('/api/trackers')
      .then((res) => res.json())
      .then((data) => setTrackers(data.trackers));
    fetch('/api/checkins')
      .then((res) => res.json())
      .then((data) => setCheckins(data.checkins));
  }, [refreshCounter]);
  const refresh = () => setRefreshCounter(refreshCounter + 1);

  const appContext = { trackers, checkins, refresh };

  return <AppContext.Provider value={appContext}>{props.children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
