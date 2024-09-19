"use client"; 
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Todo {
  _id: string;
  name: string;
  status: boolean;
  dueDate: string;
  details: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  // ฟังก์ชันดึงข้อมูลทั้งหมด
  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/todo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setTodos(result.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // ฟังก์ชันสร้างงานใหม่
  const handleCreateTodo = async () => {
    if (!newTodo || !dueDate) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน"); // หรือใช้ library แจ้งเตือนที่สวยงามกว่านี้
      return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
    }
    try {
      console.log("Data to be sent:", {
        name: newTodo,
        status: false,
        dueDate,
        details,
      });
      const response = await fetch("http://localhost:3000/api/v1/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTodo,
          status: false,
          dueDate,
          details,
        }),
      });
      const result = await response.json();
      setTodos((prevTodos) => [...prevTodos, result.data]);
      setNewTodo("");
      setDueDate("");
      setDetails("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  // ฟังก์ชันอัปเดตสถานะงาน
  const handleUpdateTodo = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("http://localhost:3000/api/v1/todo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          status: !currentStatus,
        }),
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, status: !currentStatus } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // ฟังก์ชันลบงาน
  const handleDeleteTodo = async (id: string) => {
    try {
      await fetch("http://localhost:3000/api/v1/todo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <div className={styles.input}>
          <h1>Todo App</h1>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="ชื่องานใหม่"
            className={styles.taskInput}
          />
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="รายละเอียดงาน"
            className={styles.detailsInput} // เพิ่มคลาส CSS สำหรับ textarea
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={styles.dateInput}
          />
          <button onClick={handleCreateTodo} className={styles.btn_add}>
            เพิ่มงาน
          </button>
        </div>
        {/* แสดงรายการงาน */}
        <div className={styles.list}>
          <ul className={styles.ul}>
            {todos.map(
              (todo) =>
                todo && (
                  <li
                    key={todo._id}
                    className={`${styles["todo-item"]} ${
                      todo.status ? styles.done : ""
                    }`}
                  >
                    <div>
                      <h2>{todo.name}</h2>
                      {todo.details ? (
                        <p>{todo.details}</p>
                      ) : (
                        <p>ไม่มีรายละเอียด</p>
                      )}
                      {todo.dueDate && (
                        <p>
                          อย่าบิดเกินวันทื่:{" "}
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className={styles.btn_group}>
                      <button
                        onClick={() => handleUpdateTodo(todo._id, todo.status)}
                        className={`${styles.btns} ${styles.btn_done}`}
                      >
                        {todo.status ? "เปลี่ยนใจ" : "ทำแล้ว"}
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className={`${styles.btns} ${styles.btn_delete}`}
                      >
                        ลบ
                      </button>
                    </div>
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
