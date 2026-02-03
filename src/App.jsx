import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import ProtectedRoute from "./components/Ui/ProtectedRoute";
import Chats from "./pages/Chats/Chats";
import Teachers from "./pages/Teachers/Teachers";
import TeacherDetaile from "./pages/Teachers/TeacherDetaile";
import Students from "./pages/Students/Students";
import StudentDetaile from "./pages/Students/StudentDetaile";
import Leads from "./pages/Laeds/Leads";
import LeadDetail from "./pages/Laeds/LeadDetail";
import Groups from "./pages/Groups/Groups";
import GroupDetalie from "./pages/Groups/GroupDetalie";
import Rooms from "./pages/Rooms/Rooms";
import Courses from "./pages/Courses/Courses";
import { ThemeProvider, useTheme } from "./Context/Context";


function App() {

  // Layout wrapper that reads theme from context and passes as props
  const LayoutWithTheme = () => {
    const { theme, setTheme } = useTheme();
    return (
      <Layout
        toggleTheme={theme}
        setToggleTheme={setTheme}
      />
    );
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />


          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<LayoutWithTheme />}>
              <Route index element={<Home />} />
              <Route path="chats" element={<Chats />} />
              <Route path="profile" element={<Profile />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="students" element={<Students />} />
              <Route path="groups" element={<Groups />} />
              <Route path="leads" element={<Leads />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="courses" element={<Courses />} />
              <Route path="groups/:id" element={<GroupDetalie />} />
              <Route path="teachers/:id" element={<TeacherDetaile />} />
              <Route path="students/:id" element={<StudentDetaile />} />
              <Route path="leads/:id" element={<LeadDetail />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;