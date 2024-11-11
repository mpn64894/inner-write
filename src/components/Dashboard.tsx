import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import TaskBox from './TaskBox';
import TodayPlan from './TodayPlan';

function Dashboard() {
  return (
    <div className={styles.container}>
      <TaskBox/>
      <TodayPlan />
    </div>
  );
}

export default Dashboard;