import { useState } from "react";
import styles from './TaskBox.module.css';
import { IoIosAddCircle } from 'react-icons/io';
import { useEffect } from "react";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

type TaskType = {
  id: number;
  title: string;
  date: string;
  start: string;
  end: string;
  image: string;
  color: string;
  daysLeft: number;
};

const dummyTasks: TaskType[] = [
  {
    id: 1,
    title: "Coffee with sister",
    date: "2024-11-15",
    start: "07:00",
    end: "08:00",
    image: "https://cdn.vox-cdn.com/thumbor/X6SXIp7SNGuXE6IRcCZuVu8m3J0=/0x0:3072x4080/1200x900/filters:focal(1143x2660:1633x3150):no_upscale()/cdn.vox-cdn.com/uploads/chorus_image/image/71633539/PXL_20220830_183956022.PORTRAIT.0.jpg",
    color: "yellow",
    daysLeft: 4,
  },
  {
    id: 2,
    title: "Test",
    date: "2024-11-18",
    start: "11:00",
    end: "12:00",
    image: "https://www.verywellmind.com/thmb/Z5c1MgXTWvzGZtvh3l-qZNRn0qo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-172163714-56910a493df78cafda818537.jpg",
    color: "red",
    daysLeft: 7,
  },
  {
    id: 3,
    title: "Fair",
    date: "2024-11-23",
    start: "21:00",
    end: "23:00",
    image: "https://www.orangecountyfair.com/images/site/rides/D1B3EE71-95DC-4709-BC05-CD7AB556B701.44384.6965046296-G.jpg",
    color: "gray",
    daysLeft: 12,
  }
];

const TaskBox = () => {
  const [tasks, setTasks] = useState<TaskType[]>(dummyTasks);
  const [showPopup, setShowPopup] = useState(false); // create popup
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [error, setError] = useState("");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#cccccc"); // default color
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null); // type selectedTask
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

  const fetchTasks = async () => {
    const authToken = Cookies.get('token'); 
    if (!authToken) {
      console.warn("Attempted to fetch tasks while not authenticated.");
      return;
    }

    try {
      const decoded = jwtDecode(authToken);
      const userId = decoded.userId;

      const response = await fetch(`/api/taskbox`, {
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
          Authorization: `Bearer ${authToken}`, 
        },
      }); 

      const userResponse = await fetch(`/api/taskbox/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, 
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      const userData = await userResponse.json();
      const userDataId = userData.userId;
      // const tasks = data.entries.reduce((acc, entry) => {
      //   acc[entry] = entry.task; // Map tasks by their selected hour
      //   return acc;
      // }, {});
      console.log("Data", data);
      console.log(userDataId);
      const filteredData = data.tasks?.filter((entry: any) => entry.user === userDataId) || [];
      console.log("Filtered data", filteredData);
      if (filteredData.length > 0 ) {
        setTasks(filteredData);
      } else {
        console.error('Invalid data format:', filteredData);
      } 

      
      // if (Array.isArray(filteredData)) {
      //   setTasks(filteredData);
      // } else {
      //   console.error('Invalid data format:', filteredData);
      // }    
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() && taskDate && startTime && imageURL.trim()) {
      if (!isDateTimeValid() || !isEndTimeAfterStartTime()) return;
      const token = Cookies.get('token'); 
      const decoded = jwtDecode<{ userId: string }>(token as string);
      const userId = decoded.userId;

      if (!userId) {
        alert("User not authenticated.");
        return;
      }

      const task = {
        dateStart: Date.now(),
        title: newTask,
        date: taskDate,
        start: startTime,
        end: endTime,
        image: imageURL,
        color: selectedColor,
        daysLeft: calculateDaysLeft(taskDate),
        user: userId,
      };
      console.log("task: ", task);

      try {
        const response = await fetch('/api/taskbox', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error("Failed to add task");
      // const newTask = await response.json();
      // setTasks((prevTasks) => [...prevTasks, newTask]);
      fetchTasks();  // this will update the tasks from the server
      setNewTask('');
      setTaskDate('');
      setStartTime(''); 
      setEndTime('');
      setImageURL('');
      setShowPopup(false);
    } catch (error) {
      console.error('Failed to add task');
    }
  } else {
      setError("All fields are required.");
      setShowErrorPopup(true);
  }
};

// const deleteTask = async () => {
//   if (selectedTask) {
//     setTasks((prevTasks) => prevTasks.filter(task => task.id !== selectedTask.id));
//     setShowEditPopup(false);
//     setSelectedTask(null);
//   }
// };

const deleteTask = async () => {
  if (selectedTask) {
    console.log("taskid: ", selectedTask);
    const taskId = selectedTask._id;  // Use _id for MongoDB ObjectId
    try {
      // Send a DELETE request to the backend
      const response = await fetch(`/api/taskbox/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Successfully deleted, update the tasks state
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        setShowEditPopup(false);
        setSelectedTask(null);
      } else {
        const data = await response.json();
        console.error('Failed to delete task:', data.message);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  } else {
    console.warn('No task selected to delete');
  }
};


  const handleTaskClick = (task: TaskType) => {
    setSelectedTask(task); 
    setNewTask(task.title);
    setTaskDate(task.date);
    setStartTime(task.start);
    setEndTime(task.end);
    setImageURL(task.image);
    setSelectedColor(task.color);
    setShowEditPopup(true); // Open the edit popup
  };

  // const saveEditedTask = () => {
  //   if (!selectedTask || !isDateTimeValid() || !isEndTimeAfterStartTime()) return;
  
  //   console.log(selectedTask)

  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) =>
  //       task.id === selectedTask.id
  //         ? { ...task, title: newTask, date: taskDate, start: startTime, end: endTime, color: selectedColor }
  //         : task
  //     )
  //   );

  //   handleCloseEditPopup();
  // };


  const saveEditedTask = async () => {
    if (!selectedTask || !isDateTimeValid() || !isEndTimeAfterStartTime()) return;
  
    const updatedTask = {
      title: newTask,
      date: taskDate,
      start: startTime,
      end: endTime,
      color: selectedColor,
    };
  
    console.log('Updated Task:', updatedTask);
  
    // Send a PATCH request to update the task in the backend
    try {
      const response = await fetch(`/api/taskbox/${selectedTask._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
  
      if (response.ok) {
        const updatedTaskData = await response.json();
        console.log('Task updated:', updatedTaskData);
  
        // Update the task list in the state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === selectedTask._id
              ? { ...task, ...updatedTask }  // Merge updated task data
              : task
          )
        );
  
        // Close the edit popup
        handleCloseEditPopup();
      } else {
        const errorData = await response.json();
        console.error('Failed to update task:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  
  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setSelectedTask(null); 
    setNewTask(""); 
    setTaskDate("");
    setStartTime("");
    setEndTime(""); 
    setImageURL("");
    setSelectedColor("#cccccc");
  };


  const calculateDaysLeft = (date: string) => {
    const taskDate = new Date(date);
    const currentDate = new Date();
    const diffTime = taskDate.getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAddIconClick = () => {
    setNewTask("");
    setTaskDate("");
    setStartTime("");
    setEndTime("");
    setImageURL("");
    setSelectedColor("#cccccc"); 
    setShowPopup(true); 
  };

  const isDateTimeValid = () => {
    const selectedDateTime = new Date(`${taskDate}T${startTime}`);
    const currentDateTime = new Date();
    if (selectedDateTime < currentDateTime) {
      setError("The selected date has already occurred.");
      setShowErrorPopup(true);
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
        setShowErrorPopup(true);
        return false;
      }
    }
    setError("");
    return true;
  };

  // const formatDate = (dateStr = "") => {
  //   const [year, month, day] = dateStr.split('-');
  //   return `${month}/${day}/${year}`;
  // };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
    //  weekday: 'long', // e.g., "Monday"
      year: 'numeric', // e.g., "2024"
      month: 'numeric', // e.g., "November"
      day: 'numeric', // e.g., "27"
    });
  };
  
  const formatTime = (time = "") => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={styles.tasksContainer}>
      <div className={styles.topPart}>
        <h1 className={styles.upcommingEvents}>Upcoming Events</h1>
          <div 
          className={`${styles.addButton} ${isAuthenticated ? styles.enabled : styles.disabled}`} 
          onClick={isAuthenticated ? handleAddIconClick : undefined}
          style={{ cursor: isAuthenticated ? "pointer" : "default", opacity: isAuthenticated ? 1 : 0.5 }}
        >
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

          <label>Image:</label>
          <input
            type="text"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="Paste an image URL..."
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

          <label>Image:</label>
          <input
            type="text"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="Paste an image URL..."
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
        {tasks.map((task, index) => (
          <div key={task.id || index} className={styles.taskItem} style={{ borderColor: task.color }} 
            onClick={() => isAuthenticated ? handleTaskClick(task) : undefined}>
            {task.image && <img src={task.image} alt="Task" className={styles.taskImage} />}
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