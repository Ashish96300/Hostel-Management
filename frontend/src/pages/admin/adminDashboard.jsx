import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, Bed, AlertCircle, Clock } from "lucide-react";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalRooms: 0,
        occupiedRooms: 0,
        pendingComplaints: 0,
        pendingLeaves: 0
    });

        useEffect(() => {

            const fetchStats = async () => {

                try {

                    const res = await api.get("/admin/stats");

                    setStats({
                        totalStudents: res.data.data.totalStudents || 0,
                        totalRooms: res.data.data.totalRooms || 0,
                        occupiedRooms: res.data.data.occupiedRooms || 0,
                        pendingComplaints: res.data.data.pendingComplaints || 0,
                        pendingLeaves: res.data.data.leaveRequests || 0
                    });

                } catch (err) {

                    console.error(err);
                }
            };

            fetchStats();

        }, []);

    const cards = [
        { title: "Total Students", value: stats.totalStudents, icon: <Users />, color: "bg-blue-500" },
        { title: "Rooms Occupied", value: `${stats.occupiedRooms}/${stats.totalRooms}`, icon: <Bed />, color: "bg-emerald-500" },
        { title: "Pending Complaints", value: stats.pendingComplaints, icon: <AlertCircle />, color: "bg-amber-500" },
        { title: "Leave Requests", value: stats.pendingLeaves, icon: <Clock />, color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.title}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Management Table or Activity Feed could go here */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Recent System Activity</h3>
                <div className="text-center py-10 text-slate-400 italic text-sm">
                    Activity logs will appear here as students interact with the portal.
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;