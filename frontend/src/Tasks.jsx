import { useEffect, useState } from "react";
import api from "./api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  console.log(tasks);

  return (
    <div>
      <h2>Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: 10,
            }}
          >
            <input type="checkbox" />
            <span>{task.user.email}</span>
            <span>{task.title}</span>
            <span>{task.isDone ? "✅" : "❌"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
