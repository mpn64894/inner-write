import { useState } from "react";
import styles from './TaskBox.module.css';
import { IoIosAddCircle } from 'react-icons/io';

type TaskType = {
  id: number;
  title: string;
  date: string;
  start: string;
  end: string;
  color: string;
  daysLeft: number;
};

const TaskBox = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [showPopup, setShowPopup] = useState(false); // create popup
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#cccccc"); // default color
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null); // type selectedTask

  const formatDate = (dateStr = "") => {
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`;
  };

  const formatTime = (time = "") => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const addTask = () => {
    if (newTask.trim() && taskDate && startTime) {
      if (!isDateTimeValid() || !isEndTimeAfterStartTime()) return;

      const task = {
        id: Date.now(),
        title: newTask,
        date: taskDate,
        start: startTime,
        end: endTime,
        color: selectedColor,
        daysLeft: calculateDaysLeft(taskDate),
      };

      setTasks((prevTasks) =>
        [...prevTasks, task].sort((a, b) =>
          new Date(`${a.date} ${a.start}`).getTime() - new Date(`${b.date} ${b.start}`).getTime()
        )
      );

      // Reset input fields and close popup
      setNewTask("");
      setTaskDate("");
      setStartTime("");
      setEndTime("");
      setShowPopup(false);
    }
  };

  const handleTaskClick = (task: TaskType) => {
    setSelectedTask(task); 
    setNewTask(task.title);
    setTaskDate(task.date);
    setStartTime(task.start);
    setEndTime(task.end);
    setSelectedColor(task.color);
    setShowEditPopup(true); // Open the edit popup
  };

  const saveEditedTask = () => {
    if (!selectedTask) return;
  
    console.log(selectedTask)

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === selectedTask.id
          ? { ...task, title: newTask, date: taskDate, start: startTime, end: endTime, color: selectedColor }
          : task
      )
    );

    handleCloseEditPopup(); // This clears the edit popup values
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setSelectedTask(null); // Clear the selected task
    setNewTask("");  // Clear the task title
    setTaskDate(""); // Clear the task date
    setStartTime(""); // Clear the start time
    setEndTime(""); // Clear the end time
    setSelectedColor("#cccccc"); // Reset color to default
  };

  const deleteTask = () => {
    if (selectedTask) {
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== selectedTask.id));
      setShowEditPopup(false);
      setSelectedTask(null);
    }
  };

  const calculateDaysLeft = (date: string) => {
    const taskDate = new Date(date);
    const currentDate = new Date();
    const diffTime = taskDate.getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days difference
  };

  const handleAddIconClick = () => {
    setNewTask("");
    setTaskDate("");
    setStartTime("");
    setEndTime("");
    setSelectedColor("#cccccc"); 
    setShowPopup(true); 
  };

  const isDateTimeValid = () => {
    const selectedDateTime = new Date(`${taskDate}T${startTime}`);
    const currentDateTime = new Date();
    if (selectedDateTime < currentDateTime) {
      setError("The selected date and time have already passed.");
      setShowErrorPopup(true); // Show error popup
      return false;
    }
    setError("");
    return true;
  };

  const isEndTimeAfterStartTime = () => {
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      if (end <= start) {
        setError("End time must be after the start time.");
        setShowErrorPopup(true); // Show error popup
        return false;
      }
    }
    setError("");
    return true;
  };

  return (
    <div className={styles.tasksContainer}>
      <div className={styles.topPart}>
        <h1 className={styles.upcommingEvents}>Upcoming Events</h1>
        <div className={styles.addButton} onClick={handleAddIconClick}>
          <IoIosAddCircle size={20} />
        </div>
      </div>

      {/* Create Popup */}
      {showPopup && (
        <div className={styles.popup}>
          <label>Task:</label>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a task..."
            className={styles.input}
          />
          <button className={styles.closeButton} onClick={() => setShowPopup(false)}>X</button>

          <label>Date:</label>
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            className={styles.input}
          />

          <label>Start:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={styles.input}
          />

          <label>End:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={styles.input}
          />

          <div className={styles.colorOptions}>
            <span
              className={`${styles.color} ${selectedColor === "#fff88f" ? styles.selected : ""}`}
              style={{ backgroundColor: "#fff88f" }}
              onClick={() => setSelectedColor("#fff88f")}
            ></span>
            <span
              className={`${styles.color} ${selectedColor === "#e0d4e7" ? styles.selected : ""}`}
              style={{ backgroundColor: "#e0d4e7" }}
              onClick={() => setSelectedColor("#e0d4e7")}
            ></span>
            <span
              className={`${styles.color} ${selectedColor === "#d8eef7" ? styles.selected : ""}`}
              style={{ backgroundColor: "#d8eef7" }}
              onClick={() => setSelectedColor("#d8eef7")}
            ></span>
            <span
              className={`${styles.color} ${selectedColor === "#d8e2dc" ? styles.selected : ""}`}
              style={{ backgroundColor: "#d8e2dc" }}
              onClick={() => setSelectedColor("#d8e2dc")}
            ></span>
            <span
              className={`${styles.color} ${selectedColor === "#ffdfc8" ? styles.selected : ""}`}
              style={{ backgroundColor: "#ffdfc8" }}
              onClick={() => setSelectedColor("#ffdfc8")}
            ></span>
          </div>
          
          <button className={styles.createButton} onClick={addTask}>Create</button>
        </div>
      )}

      {/* Edit Popup */}
      {showEditPopup && (
        <div className={styles.popup}>
          <label>Task:</label>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className={styles.input}
          />
          <button className={styles.closeButton} onClick={() => setShowEditPopup(false)}>X</button>

          <label>Date:</label>
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            className={styles.input}
          />

          <label>Start:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={styles.input}
          />

          <label>End:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={styles.input}
          />

          <div className={styles.colorOptions}>
            <span
              className={`${styles.color} ${selectedColor === "#fff88f" ? styles.selected : ""}`}
              style={{ backgroundColor: "#fff88f" }}
              onClick={() => setSelectedColor("#fff88f")}
            ></span>
            <span
              className={`${styles.color} ${selectedColor === "#e0d4e7" ? styles.selected : ""}`}
              style={{ backgroundColor: "#e0d4e7" }}
              onClick={() => setSelectedColor("#e0d4e7")}
            ></span>
            <span
              className={`${styles.color} ${selectedColor === "#d8eef7" ? styles.selected : ""}`}
              style={{ backgroundColor: "#d8eef7" }}
              onClick={() => setSelectedColor("#d8eef7")}
            ></span>
            <span
              className={`${styles.color} ${selectedColor === "#d8e2dc" ? styles.selected : ""}`}
              style={{ backgroundColor: "#d8e2dc" }}
              onClick={() => setSelectedColor("#d8e2dc")}
            ></span>
            <span
              className={`${styles.color} ${selectedColor === "#ffdfc8" ? styles.selected : ""}`}
              style={{ backgroundColor: "#ffdfc8" }}
              onClick={() => setSelectedColor("#ffdfc8")}
            ></span>
          </div>
          
          <div className={styles.buttonContainer}>
            <button className={styles.deleteButton} onClick={deleteTask}>Delete</button>
            <button className={styles.saveButton} onClick={saveEditedTask}>Save</button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className={styles.errorPopupOverlay}>
          <div className={styles.errorPopup}>
            <p>{error}</p>
            <button className={styles.closeErrorMsg} onClick={() => setShowErrorPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Task Cards */}
      <div className={styles.taskCard}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.taskItem} style={{ borderColor: task.color }} onClick={() => handleTaskClick(task)}>
            <h3>{task.title}</h3>
            <p>Date: {formatDate(task.date)}</p>
            <p>Start: {formatTime(task.start)}</p>
            <p>End: {formatTime(task.end)}</p>
            <p>Days Left: {task.daysLeft}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBox;