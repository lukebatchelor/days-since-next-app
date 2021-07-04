import { User } from '.prisma/client';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [checkins, setCheckins] = useState<Array<User>>([]);
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((r) => setCheckins(r.users));
  }, []);
  return (
    <div className={styles.container}>
      {' '}
      Hello World
      <div>{checkins && checkins.map((checkin) => <div key={checkin.id}>{JSON.stringify(checkin)}</div>)}</div>
    </div>
  );
}
