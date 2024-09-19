import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

//CRUD =>
//READ data
//url => api/v1/todo
export async function GET() {
  try {
    await connectToDatabase();
    const todoResult = await Todo.find({});  // Ensure it fetches `dueDate` and `details`
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    return NextResponse.json({
      error: err,
    });
  }
}
//Create new record
//req => { name:"", note:""}
//url => api/v1/todo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await Todo.create(body);  // Ensure 'dueDate' and 'details' are passed
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json({
      error: error,
    });
  }
}
//Update
//url => api/v1/todo
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body; // แยก _id ออกจากข้อมูลที่จะอัปเดต

    const updatedTodo = await Todo.findByIdAndUpdate(_id, updateData, {
      new: true,
    }); // ใช้ findByIdAndUpdate และส่งคืนเอกสารที่อัปเดตแล้ว

    if (!updatedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updatedTodo });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { _id } = body;

    const deletedTodo = await Todo.findByIdAndDelete(_id); // ใช้ findByIdAndDelete

    if (!deletedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ data: deletedTodo });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
