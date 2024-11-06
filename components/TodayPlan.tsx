import styles from "./TodayPlan.module.css";
import { FaHeart } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import { GoArrowSwitch } from 'react-icons/go';
import { useState } from "react";
import TimeSlot from "./TimeSlot";

const hours = [
  "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM",
  "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM",
  "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
];

function TodayPlan() {
  const [view, setView] = useState(true); // toggle between views
  const [tasks, setTasks] = useState<{ [key: string]: string }>({});
  const [showInput, setShowInput] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");
  const [newTask, setNewTask] = useState("");

  const toggleView = () => {
    setView(!view);
  };

  const handleAddClick = () => {
    setShowInput(true); // Show the input field
  };

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour); // Select the hour to add the task for
    setShowInput(true);
  };

  const handleAddTask = () => {
    if (selectedHour && newTask.trim() !== "") {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [selectedHour]: newTask
      }));
      setNewTask("");
      setShowInput(false);
    }
  };

  return (
    <div className={styles.todayPlan}>
      <div className={styles.topPart}>
        <div className={styles.leftSide}>
          <h1 className={styles.h1}>Today's Plan</h1>
          <div className={styles.logo}>
            <FaHeart size={20} />
          </div>
          <div className={styles.logo} onClick={handleAddClick}>
            <IoIosAddCircle size={20} />
          </div>
        </div>
        <div onClick={toggleView} className={styles.switchButton}>
          <GoArrowSwitch size={20} />
        </div>
      </div>
      <div className={styles.timeline}>
        {hours.map((hour, index) => (
          <TimeSlot
            key={index}
            time={hour}
            task={tasks[hour]}
            onHourClick={() => handleHourSelect(hour)}
          />
        ))}
      </div>
      {showInput && (
        <div className={styles.taskInputModal}>
          <h2>Add Task for {selectedHour}</h2>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task description"
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
      )}
    </div>
  );
}

export default TodayPlan;
