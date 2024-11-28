import styles from "./TodayPlan.module.css";
import { FaHeart } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import { GoArrowSwitch } from 'react-icons/go';
import { useState } from "react";
import { useEffect } from "react";
import TimeSlot from "./TimeSlot";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const hours = [
  "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM",
  "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM",
  "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
];

function TodayPlan() {
  const [view, setView] = useState(true); // toggle between views
  const [tasks, setTasks] = useState<{ [key: string]: string }>({});
  const [showPopup, setShowPopup] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");
  const [newTask, setNewTask] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication cookie
    const authToken = Cookies.get('token');
    if (authToken) {
      console.log('authorizing');
      try {
        const decoded = jwtDecode(authToken);
        if (decoded && decoded.exp > Date.now() / 1000) {
          setIsAuthenticated(true);
          fetchTasks();
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const toggleView = () => {
    setView(!view);
  };

  const handleAddIconClick = () => {
    setShowPopup(true); // Open the popup to add a task
  };

  // const handleAddTask = () => {
  //   if (newTask.trim() !== "" && selectedHour) {
  //     setTasks((prevTasks) => ({
  //       ...prevTasks,
  //       [selectedHour]: newTask
  //     }));
  //     setNewTask("");
  //     setSelectedHour("");
  //     setShowPopup(false);
  //   }
  // };

  // const handleDelete = (id: string) => {
  //   setTasks((prevTasks) => {
  //     const updatedTasks = { ...prevTasks };
  //     delete updatedTasks[id]; // Remove the task for the specific hour
  //     return updatedTasks;
  //   });
  // }
  
  const fetchTasks = async () => {
    const authToken = Cookies.get('token'); 
    if (!authToken) {
      console.warn("Attempted to fetch tasks while not authenticated.");
      return;
    }

    try {
      const decoded = jwtDecode(authToken);
      const userId = decoded.userId;

      console.log ("User from client side: ", userId);
      const response = await fetch("/api/todaysplan", {
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
          "User" : userId,
        },
      }); 
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      const tasks = data.entries.reduce((acc, entry) => {
        acc[entry.selectedHour] = entry.task; // Map tasks by their selected hour
        return acc;
      }, {});
      setTasks(tasks); // Assuming the response is an object with { [hour]: task }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "" || !selectedHour) {
      alert('Please fill in all required fields');
      return;
    }
    const token = Cookies.get('token'); 
    const decoded = jwtDecode<{ userId: string }>(token as string);
    const userId = decoded.userId;
    
    if (!userId) {
        alert("User not authenticated.");
        return;
    }
    const newEntry = { selectedHour, task: newTask, user: userId };
    console.log(selectedHour);
    console.log(newTask);
    try {
      const response = await fetch("/api/todaysplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });
      if (!response.ok) throw new Error("Failed to add task");

      setTasks((prevTasks) => ({
        ...prevTasks,
        [selectedHour]: newTask,
      }));
      setNewTask(" ");
      setSelectedHour(" ");
      setShowPopup(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (hour: string) => {
    console.log("delete hour: " + hour)
    try {
      const response = await fetch(`/api/todaysplan/${hour}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");

      // Update local state after successful deletion
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        delete updatedTasks[hour];
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error deleting task:", error);
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
          {/* Clickable icon to add task */}
          <div className={`${styles.addLogo} ${isAuthenticated ? styles.enabled : styles.disabled}`}>
            <IoIosAddCircle size={20} 
            onClick= {isAuthenticated ? handleAddIconClick : undefined}
            style={{ cursor: isAuthenticated ? "pointer" : "default", opacity: isAuthenticated ? 1 : 0.5}}/>
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
            id = {hour}
            time={hour}
            task={tasks[hour]}
            onDelete={deleteTask}
          />
        ))}
      </div>

      {/* Popup for adding a task */}
      {showPopup && (
        <div className={styles.popup}>
          <h2>Add Task</h2>
          <label>Select Hour:</label>
          <select
            value={selectedHour}
            onChange={(e) => setSelectedHour(e.target.value)}
          >
            <option value="">Select an hour</option>
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>

          <label>Task Description:</label>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task description"
          />

          <button onClick={addTask}>Add Task</button>
          <button onClick={() => setShowPopup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default TodayPlan;
