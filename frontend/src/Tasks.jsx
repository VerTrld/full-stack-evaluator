import { useEffect, useState } from "react";
import api from "./api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // Fetch tasks and users only once on mount
  useEffect(() => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));

    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, [tasks, users]);

  const handleSubmit = async () => {
    if (!title || !selectedUser) return;

    try {
      const res = await api.post("/tasks", {
        title,
        userId: selectedUser,
        isDone: false,
      });

      setTasks((prev) => [...prev, res.data]);
      setTitle("");
      setSelectedUser("");
      console.log("Task added!", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <div>
      <h2>Tasks</h2>

      <div style={{ marginBottom: 20 }}>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginLeft: 10 }}
        />

        <button
          style={{ border: "1px solid red", marginLeft: 10 }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      <ul style={{ padding: 0 }}>
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
            <input
              type="checkbox"
              checked={task.isDone}
              onChange={async () => {
                const newStatus = !task.isDone;

                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === task.id ? { ...t, isDone: newStatus } : t
                  )
                );

                try {
                  await api.put(`/tasks/${task.id}`, {
                    title: task.title,
                    userId: task.userId,
                    isDone: newStatus,
                  });
                } catch (err) {
                  console.error(err);
                  setTasks((prev) =>
                    prev.map((t) =>
                      t.id === task.id ? { ...t, isDone: task.isDone } : t
                    )
                  );
                }
              }}
            />

            <span>{task.user?.email}</span>
            <span>{task.title}</span>
            <span>{task.isDone ? "✅" : "❌"}</span>

            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
