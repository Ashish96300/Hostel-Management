
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
  const { isAuthenticated, setAuth, isLoading ,user} = useAuthStore();

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

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
        /> 

        {/* Dashboard Modules wrapped in Layout */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Layout title="System Overview">
                <Overview />
              </Layout>
            ) : <Navigate to="/login" />
          } 
        /> 

              <Route 
        path="/dashboard/complaints" 
        element={
          isAuthenticated ? (
            <Layout title="Facility Complaints">
              <Complaints />
            </Layout>
          ) : <Navigate to="/login" />
        } 
      />
      <Route path="/dashboard/leaves" element={
    isAuthenticated ? (
        <Layout title="Leave Management"><Leaves /></Layout>
    ) : <Navigate to="/login" />
    } />

    {/* Admin Dashboard */}
    <Route 
      path="/admin/dashboard" 
      element={
        isAuthenticated && user?.role === "ADMIN" ? (
          <Layout title="Admin Command Center">
            <AdminDashboard />
          </Layout>
        ) : <Navigate to="/dashboard" />
      } 
/>

       <Route 
          path="/admin/rooms" 
          element={
            isAuthenticated && user?.role === "ADMIN" ? (
              <Layout title="Room Inventory">
                <RoomManagement />
              </Layout>
            ) : <Navigate to="/dashboard" />
          } 
        />

            <Route
      path="/admin/complaints"
      element={
        isAuthenticated && user?.role === "ADMIN" ? (
          <Layout title="Complaint Management">
            <AdminComplaints />
          </Layout>
        ) : <Navigate to="/dashboard" />
      }
    />
        <Route 
      path="/admin/leaves" 
      element={
        isAuthenticated && user?.role === "ADMIN" ? (
          <Layout title="Leave Management">
            <LeaveManagement />
          </Layout>
        ) : <Navigate to="/dashboard" />
      } 
    />
            {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;