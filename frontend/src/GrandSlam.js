import React, { useState, useEffect } from 'react';
import styles from './GrandSlam.module.css';
import { AtpStatsApi } from './AtpStatsApi';

export function GrandSlam(props) {
  const [mostSinglesPlayer, setMostSinglesPlayer] = useState(<div className={styles.loader}>Loading...</div>);

  // Fetch data on first render
  useEffect(() => {
    const handleClickOnPlayer = () => {
      const mostRecentYearEl = document.getElementById(`mostRecentYear${props.id}`);
      const currentOpacity = mostRecentYearEl.style.opacity;
      mostRecentYearEl.style.opacity = (currentOpacity === '0' || !currentOpacity) ? '1' : '0';
    }

    AtpStatsApi
    .getMostSingles(props.id)
    .then((mostSinglesEntry) => {
      // Do note that we assume the years are sorted in ascending order, i.e. wins[n] <= wins[n + 1].
      // We could sort them to make sure, but it's kinda wasteful given that the spreadsheet will
      // probably not change anytime soon.
      const mostRecentYear = mostSinglesEntry.wins[mostSinglesEntry.wins.length - 1];

      // Used to get element in click handler above
      const mostRecentYearId = `mostRecentYear${props.id}`;

      setMostSinglesPlayer(
        <div className={styles.PlayerInfo}>
          <h2 onClick={handleClickOnPlayer}>{mostSinglesEntry.player}</h2>
          <div className={styles.YearBox}><h3 id={mostRecentYearId}>{mostRecentYear}</h3></div>
        </div>
      );
    })
    .catch((err) => {
      setMostSinglesPlayer(<h1>{err.message}</h1>);
    })
  }, [props.id]);

  return (
    <div className={styles.GrandSlamContainer}>
      <h1>{props.name}</h1>
      {mostSinglesPlayer}
    </div>
  );
}
