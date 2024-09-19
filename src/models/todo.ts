import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  name: String,
  details: String, // เปลี่ยนจาก description เป็น details
  status: Boolean,
  dueDate: Date,
});
//connent to "todos" collection
const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
export default Todo;  