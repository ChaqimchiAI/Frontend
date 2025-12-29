import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import ProtectedRoute from "./components/Ui/ProtectedRoute";
import Chats from "./pages/Chats/Chats";
import Notes from "./pages/Notes/Notes";
import Calendar from "./pages/Calendar/Calendar";
import ToDoLists from "./pages/To_do_lists/ToDoLists";
import Teachers from "./pages/Teachers/Teachers";
import TeacherDetaile from "./pages/Teachers/TeacherDetaile";
import Students from "./pages/Students/Students";
import StudentDetaile from "./pages/Students/StudentDetaile";
import Schedule from "./pages/Exams/Schedule"
import Result from "./pages/Exams/Result"
import Lessons from "./pages/Lessons/Lessons";
import Attendance from "./pages/Attendance/Attendance";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />


        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="chats" element={<Chats />} />
            <Route path="profile" element={<Profile />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="todo" element={<ToDoLists />} />
            <Route path="notes" element={<Notes />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="exam/schedule" element={<Schedule />} />
            <Route path="exam/result" element={<Result />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="teacher/:id" element={<TeacherDetaile />} />
            <Route path="student/:id" element={<StudentDetaile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;