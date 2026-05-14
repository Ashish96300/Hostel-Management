import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import api from "./api/axios";
import useAuthStore from "./store/authStore";
import Layout from "./components/layout";
import Login from "./pages/loginPage";
import Register from "./pages/registerPage";
import Overview from "./pages/student/overviewPage";
import Complaints from "./pages/student/complaintsPage";
import Leaves from "./pages/student/leavePage";
import AdminDashboard from "./pages/admin/adminDashboard";
import RoomManagement from "./pages/admin/roomManagement";
import AdminComplaints from "./pages/admin/complaintManagement";
import LeaveManagement from "./pages/admin/leaveManagement";

function App() {
  const { isAuthenticated, setAuth, isLoading, user } = useAuthStore();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await api.get("/user/current-user");
        setAuth(response.data.data);
      } catch (error) {
        setAuth(null);
        console.log("Auth Check Failed:", error);
      }
    };
    checkUser();
  }, [setAuth]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Initializing Portal...</p>
      </div>
    );
  }

  // Helper: where to send authenticated users by default
  const defaultHome = user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to={defaultHome} />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to={defaultHome} />}
        />

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={
            !isAuthenticated ? <Navigate to="/login" /> :
            user?.role === "ADMIN" ? <Navigate to="/admin/dashboard" /> :  // ✅ kick admin out
            <Layout title="System Overview"><Overview /></Layout>
          }
        />
        <Route
          path="/dashboard/complaints"
          element={
            !isAuthenticated ? <Navigate to="/login" /> :
            user?.role === "ADMIN" ? <Navigate to="/admin/dashboard" /> :
            <Layout title="Facility Complaints"><Complaints /></Layout>
          }
        />
        <Route
          path="/dashboard/leaves"
          element={
            !isAuthenticated ? <Navigate to="/login" /> :
            user?.role === "ADMIN" ? <Navigate to="/admin/dashboard" /> :
            <Layout title="Leave Management"><Leaves /></Layout>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            !isAuthenticated ? <Navigate to="/login" /> :
            user?.role !== "ADMIN" ? <Navigate to="/dashboard" /> :  // ✅ kick student out
            <Layout title="Admin Command Center"><AdminDashboard /></Layout>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            !isAuthenticated ? <Navigate to="/login" /> :
            user?.role !== "ADMIN" ? <Navigate to="/dashboard" /> :
            <Layout title="Room Inventory"><RoomManagement /></Layout>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            !isAuthenticated ? <Navigate to="/login" /> :
            user?.role !== "ADMIN" ? <Navigate to="/dashboard" /> :
            <Layout title="Complaint Management"><AdminComplaints /></Layout>
          }
        />
        <Route
          path="/admin/leaves"
          element={
            !isAuthenticated ? <Navigate to="/login" /> :
            user?.role !== "ADMIN" ? <Navigate to="/dashboard" /> :
            <Layout title="Leave Management"><LeaveManagement /></Layout>
          }
        />

        {/* Root & 404 */}
        <Route path="/" element={<Navigate to={isAuthenticated ? defaultHome : "/login"} />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? defaultHome : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;