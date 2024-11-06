import React, { useState } from 'react';
import styles from './TodaysPlanTask.module.css';

interface TaskProps {
  text: string;
}

const TodaysPlanTask: React.FC<TaskProps> = ({ text }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = () => setIsChecked(!isChecked);

  return (
    <div className={styles.task}>
      <span className={isChecked ? styles.completed : ''}>{text}</span>
      <input 
        type="checkbox" 
        checked={isChecked} 
        onChange={handleCheck} 
        className={styles.checkbox} 
      />
    </div>
  );
};

export default TodaysPlanTask;
