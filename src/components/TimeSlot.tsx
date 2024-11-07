// src/components/TimeSlot.tsx
import React from 'react';
import styles from './TimeSlot.module.css';
import TodaysPlanTask from './TodaysPlanTask';

interface TimeSlotProps {
  time: string;
  task?: string;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, task }) => {
    return (
      <div className={styles.timeSlot}>
        <span className={styles.time}>{time}</span>
        {task ? (
          <TodaysPlanTask text={task} />
        ) : (
          <span className={styles.noTask}>No task</span> // no task or message
        )}
      </div>
    );
  };

export default TimeSlot;
