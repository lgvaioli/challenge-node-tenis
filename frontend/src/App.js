import React from 'react';
import styles from './App.module.css';
import { GrandSlam } from './GrandSlam';

const GRAND_SLAMS = [
  { name: 'Autralian Open', id: 580 },
  { name: 'Roland Garros', id: 520 },
  { name: 'Wimbledon', id: 540 },
  { name: 'US Open', id: 560 },
];

function App() {
  const grandSlamsEl = GRAND_SLAMS.map((curr) => {
    return (
      <GrandSlam name={curr.name} id={curr.id} key={curr.id} />
    );
  })

  return (
    <div className={styles.AppContainer}>
      <h1>Grand Slam Most Single Titles</h1>
      {grandSlamsEl}
    </div>
  );
}

export default App;
