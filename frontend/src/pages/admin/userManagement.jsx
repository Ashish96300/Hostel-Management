import { useEffect, useState } from "react";
import api from "../../api/axios";
import { UserCheck, Search ,handlePromote } from "lucide-react";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        let isMounted = true;

        const loadUsers = async () => {
            try {
                const res = await api.get("/admin/all-users");
                // 2. Only update state if the component is still mounted
                if (isMounted && res.data?.data) {
                    setUsers(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load users:", err);
            }
        };

        loadUsers();
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredUsers = users.filter(u => 
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 text-xl">User Management</h3>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search students..." 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-200" />
                                        <div>
                                            <p className="font-bold text-slate-800">{user.fullName}</p>
                                            <p className="text-xs text-slate-400">@{user.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                        user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-5 text-sm text-slate-600 font-medium">{user.email}</td>
                                <td className="p-5 text-right">
                                    {user.role !== "ADMIN" && (
                                        <button 
                                            onClick={() => handlePromote(user._id)}
                                            className="p-2 bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                                            title="Promote to Admin"
                                        >
                                            <UserCheck size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;