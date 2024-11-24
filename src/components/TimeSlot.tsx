import React from 'react';
import styles from './TimeSlot.module.css';
import TodaysPlanTask from './TodaysPlanTask';
import { MdDelete } from 'react-icons/md'

interface TimeSlotProps {
  id: string;
  time: string;
  task?: string;
  onDelete: (id: string) => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ id, time, task, onDelete }) => {
    return (
      <div className={styles.timeSlot}>
        <span className={styles.time}>{time}</span>
        {task ? (
          <div className={styles.taskWithDelete}>
            <div>
              <TodaysPlanTask text={task} />
            </div>
            <div>
              <MdDelete onClick={() => onDelete(id)} className={styles.deleteIcon} />
            </div>
          </div>
        ) : (
          <span className={styles.noTask}>No task</span> // no task or message
        )}
      </div>
    );
  };

export default TimeSlot;
