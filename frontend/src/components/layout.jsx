import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Calendar, LogOut, Shield, Home } from "lucide-react"; // Added Home
import useAuthStore from "../store/authStore";
import api from "../api/axios";

const Layout = ({ children, title }) => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/user/logout");
            logout();
            navigate("/login");
        } catch (error) { console.error(error); }
    };

    // Define Student Links
    const studentItems = [
        { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={20}/> },
        { name: "Complaints", path: "/dashboard/complaints", icon: <FileText size={20}/> },
        { name: "Leaves", path: "/dashboard/leaves", icon: <Calendar size={20}/> },
    ];

    // Define Admin Links
    const adminItems = [
        { name: "Admin Overview", path: "/admin/dashboard", icon: <LayoutDashboard size={20}/> },
        { name: "Manage Rooms", path: "/admin/rooms", icon: <Home size={20}/> },
        { name: "All Complaints", path: "/admin/complaints", icon: <FileText size={20}/> },
        { name: "Leave Requests", path: "/admin/leaves", icon: <Calendar size={20}/> },
    ];

    // Select the correct menu based on Role
    const menuItems = user?.role === "ADMIN" ? adminItems : studentItems;

    return (
        <div className="flex h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <aside className="w-72 bg-[#0f172a] text-white flex flex-col shadow-2xl">
                <div className="p-8 border-b border-slate-800 flex items-center gap-3">
                    <Shield className="text-blue-500" size={28} />
                    <h1 className="text-xl font-bold tracking-tight">HOSTEL HUB</h1>
                </div>
                
                <nav className="flex-1 px-4 py-8 space-y-2">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${
                                location.pathname === item.path 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold">
                        <LogOut size={20}/> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900 leading-none">{user?.fullName}</p>
                            {/* Dynamically show Role in Header */}
                            <p className="text-[10px] text-blue-600 font-black uppercase mt-1">
                                {user?.role === "ADMIN" ? "Warden / Admin" : "Student"}
                            </p>
                        </div>
                        <img src={user?.avatar} className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm object-cover" />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;