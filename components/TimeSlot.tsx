// src/components/TimeSlot.tsx
import React from 'react';
import styles from './TimeSlot.module.css';
import TodaysPlanTask from './TodaysPlanTask';

interface TimeSlotProps {
  time: string;
  task?: string;
  onHourClick: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, task, onHourClick }) => {
  return (
    <div className={styles.timeSlot} onClick={onHourClick}>
      <span className={styles.time}>{time}</span>
      {task ? <TodaysPlanTask text={task} /> : <span className={styles.placeholder}>Add Task</span>}
    </div>
  );
};

export default TimeSlot;
