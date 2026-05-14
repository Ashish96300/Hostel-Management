import { useState } from "react";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";
import {
    X, Bed, Users, IndianRupee, Wifi, Wind, ShowerHead,
    Star, Phone, Mail, ChevronRight, CheckCircle, Wrench,
    AlertCircle, Camera, Shield, Calendar, LogOut, ArrowUpRight
} from "lucide-react";

const AMENITY_ICONS = {
    AC: <Wind size={13} />,
    WIFI: <Wifi size={13} />,
    "ATTACHED WASHROOM": <ShowerHead size={13} />,
    BALCONY: <Star size={13} />,
};

const AmenityPill = ({ name }) => (
    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-100">
        {AMENITY_ICONS[name.toUpperCase()] || <Star size={13} />}
        {name}
    </span>
);

const RoommateCard = ({ student }) => (
    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
            {student.fullName?.[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
            <p className="font-bold text-zinc-800 text-sm truncate">{student.fullName}</p>
            <p className="text-[10px] text-zinc-400 font-medium truncate">{student.branch}</p>
        </div>
        <div className="flex gap-2 shrink-0">
            <a href={`tel:${student.phoneNumber}`} className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-indigo-600 hover:border-indigo-300 transition-all">
                <Phone size={12} />
            </a>
            <a href={`mailto:${student.email}`} className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-indigo-600 hover:border-indigo-300 transition-all">
                <Mail size={12} />
            </a>
        </div>
    </div>
);

const StatusChip = ({ status }) => {
    const config = {
        AVAILABLE:   { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle size={11} />, label: "Available" },
        FULL:        { color: "bg-red-50 text-red-600 border-red-200",             icon: <AlertCircle size={11} />, label: "Full" },
        MAINTENANCE: { color: "bg-amber-50 text-amber-700 border-amber-200",       icon: <Wrench size={11} />,      label: "Maintenance" },
    };
    const { color, icon, label } = config[status] || config.AVAILABLE;
    return (
        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${color}`}>
            {icon} {label}
        </span>
    );
};

const RoomDetailModal = ({ roomId, onClose }) => {
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useState(() => {
        api.get(`/room/details/${roomId}`)
            .then((res) => setRoom(res.data.data))
            .catch(onClose)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                        <X size={16} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 rounded-xl"><Bed size={20} /></div>
                        <div>
                            <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Room Details</p>
                            <h2 className="text-2xl font-black">{loading ? "Loading..." : `Room ${room?.roomNumber}`}</h2>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="h-48 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : room ? (
                    <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: <Bed size={15} />, value: room.type, label: "Type" },
                                { icon: <Users size={15} />, value: `${room.occupancy}/${room.capacity}`, label: "Occupancy" },
                                { icon: <IndianRupee size={15} />, value: `₹${room.price}`, label: "/ Month" },
                            ].map(({ icon, value, label }) => (
                                <div key={label} className="bg-zinc-50 p-4 rounded-xl text-center border border-zinc-100">
                                    <div className="flex justify-center mb-1.5 text-indigo-500">{icon}</div>
                                    <p className="text-base font-black text-zinc-800">{value}</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between py-2 border-t border-zinc-100">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</p>
                            <StatusChip status={room.status} />
                        </div>

                        {room.amenities?.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                    {room.amenities.map((a, i) => <AmenityPill key={i} name={a} />)}
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">
                                Roommates ({room.students?.length || 0})
                            </p>
                            {room.students?.length > 0 ? (
                                <div className="space-y-2">
                                    {room.students.map((s) => <RoommateCard key={s._id} student={s} />)}
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-400 italic">No roommates yet.</p>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
        <div className="text-indigo-500 shrink-0">{icon}</div>
        <div className="min-w-0">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{label}</p>
            <p className="text-sm font-semibold text-zinc-800 truncate">{value || "—"}</p>
        </div>
    </div>
);

const ProfileModal = ({ user, onClose }) => {
    const setAuth = useAuthStore((s) => s.setAuth);
    const logout = useAuthStore((s) => s.logout);
    const [uploading, setUploading] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(user?.avatar);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const form = new FormData();
            form.append("avatar", file);
            const res = await api.patch("/user/update-avatar", form);
            setAuth(res.data.data);
            setAvatarSrc(res.data.data.avatar);
        } catch (err) {
            alert(err.response?.data?.message || "Avatar update failed");
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        try { await api.post("/user/logout"); } catch { }
        logout();
    };

    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
        : null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 text-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <X size={16} />
                    </button>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">Profile</p>
                    <div className="flex items-end gap-4">
                        <div className="relative">
                            {avatarSrc ? (
                                <img src={avatarSrc} alt={user?.fullName} onError={() => setAvatarSrc(null)}
                                    className="w-20 h-20 rounded-xl object-cover border-2 border-white/10 shadow-xl" />
                            ) : (
                                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-black shadow-xl">
                                    {user?.fullName?.[0]?.toUpperCase()}
                                </div>
                            )}
                            <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-indigo-500 hover:bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                                {uploading
                                    ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : <Camera size={12} className="text-white" />}
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
                            </label>
                        </div>
                        <div>
                            <h2 className="text-xl font-black">{user?.fullName}</h2>
                            <p className="text-zinc-500 text-sm">@{user?.username}</p>
                            <span className="inline-block mt-1.5 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-md">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-5 space-y-2 max-h-[50vh] overflow-y-auto">
                    <InfoRow icon={<Mail size={14} />}     label="Email"        value={user?.email} />
                    <InfoRow icon={<Phone size={14} />}    label="Phone"        value={user?.phoneNumber} />
                    <InfoRow icon={<Bed size={14} />}      label="Room"         value={user?.room?.roomNumber || "Not assigned"} />
                    <InfoRow icon={<Shield size={14} />}   label="Account ID"   value={`#${user?._id?.slice(-8).toUpperCase()}`} />
                    {joinedDate && <InfoRow icon={<Calendar size={14} />} label="Member Since" value={joinedDate} />}
                </div>

                <div className="px-5 pb-5">
                    <button onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors text-sm border border-red-100">
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, sub, accent }) => (
    <div className={`p-5 rounded-2xl border ${accent} flex flex-col gap-1`}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
        <p className="text-3xl font-black text-zinc-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-zinc-500 font-medium mt-0.5">{sub}</p>}
    </div>
);

const Overview = () => {
    const { user } = useAuthStore();
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">

            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{greeting()}</p>
                    <h1 className="text-2xl font-black text-zinc-900 mt-0.5">{user?.fullName?.split(" ")[0]} 👋</h1>
                </div>
                <button onClick={() => setShowProfileModal(true)} className="relative shrink-0">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.fullName}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-100 shadow-sm hover:shadow-md transition-shadow" />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
                            {user?.fullName?.[0]?.toUpperCase()}
                        </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Room" value={user?.room?.roomNumber || "—"} sub="Allocated room" accent="bg-indigo-50 border-indigo-100" />
                <StatCard label="Status" value="Active" sub="All systems normal" accent="bg-emerald-50 border-emerald-100" />
                <StatCard label="Role" value={user?.role === "STUDENT" ? "Student" : user?.role} sub="Access level" accent="bg-violet-50 border-violet-100" />
                <StatCard label="ID" value={`#${user?._id?.slice(-4).toUpperCase()}`} sub="Account ref" accent="bg-zinc-50 border-zinc-200" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                <div className="lg:col-span-2 space-y-4">

                    <button
                        onClick={() => user?.room && setShowRoomModal(true)}
                        disabled={!user?.room}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-2xl text-left text-white hover:from-indigo-700 hover:to-violet-700 transition-all group shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl"><Bed size={20} /></div>
                                <div>
                                    <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Current Room</p>
                                    <p className="text-3xl font-black">{user?.room?.roomNumber || "Unassigned"}</p>
                                </div>
                            </div>
                            {user?.room && (
                                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <ArrowUpRight size={18} />
                                </div>
                            )}
                        </div>
                        <p className="text-indigo-200 text-xs font-medium mt-3">
                            {user?.room ? "Click to view room details, amenities & roommates" : "Waiting for room allocation by admin"}
                        </p>
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-indigo-50 rounded-lg"><Mail size={14} className="text-indigo-600" /></div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</p>
                            </div>
                            <p className="text-sm font-semibold text-zinc-800 truncate">{user?.email}</p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-indigo-50 rounded-lg"><Phone size={14} className="text-indigo-600" /></div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone</p>
                            </div>
                            <p className="text-sm font-semibold text-zinc-800">{user?.phoneNumber || "—"}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-5 text-white">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-3">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.fullName}
                                        className="w-16 h-16 rounded-xl object-cover border-2 border-white/20 shadow-lg" />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-2xl font-black shadow-lg">
                                        {user?.fullName?.[0]?.toUpperCase()}
                                    </div>
                                )}
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-zinc-800" />
                            </div>
                            <h3 className="font-black text-base">{user?.fullName}</h3>
                            <p className="text-zinc-400 text-xs">@{user?.username}</p>
                        </div>
                    </div>

                    <div className="p-4 space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                            <span className="text-xs text-zinc-400 font-medium">Account</span>
                            <span className="text-xs font-bold text-zinc-700">#{user?._id?.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                            <span className="text-xs text-zinc-400 font-medium">Role</span>
                            <span className="text-xs font-bold text-indigo-600">{user?.role}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-xs text-zinc-400 font-medium">Status</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Active
                            </span>
                        </div>
                    </div>

                    <div className="px-4 pb-4">
                        <button onClick={() => setShowProfileModal(true)}
                            className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5">
                            View Full Profile <ChevronRight size={13} />
                        </button>
                    </div>
                </div>
            </div>

            {showRoomModal && user?.room && (
                <RoomDetailModal roomId={user.room._id || user.room} onClose={() => setShowRoomModal(false)} />
            )}
            {showProfileModal && (
                <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />
            )}
        </div>
    );
};

export default Overview;