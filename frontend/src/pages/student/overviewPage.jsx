import { useState } from "react";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";
import {
    X, Bed, Users, IndianRupee, Wifi, Wind, ShowerHead,
    Star, Phone, Mail, BookOpen, Hash, ChevronRight,
    CheckCircle, Wrench, AlertCircle, User, Camera,
    Shield, Calendar, LogOut
} from "lucide-react";
const AMENITY_ICONS = {
    AC:                  <Wind size={14} />,
    WIFI:                <Wifi size={14} />,
    "ATTACHED WASHROOM": <ShowerHead size={14} />,
    BALCONY:             <Star size={14} />,
};

const AmenityPill = ({ name }) => (
    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl">
        {AMENITY_ICONS[name.toUpperCase()] || <Star size={14} />}
        {name}
    </span>
);

const RoommateCard = ({ student }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm shrink-0">
            {student.fullName?.[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm truncate">{student.fullName}</p>
            <p className="text-[10px] text-slate-400 font-semibold truncate">{student.branch} • {student.enrollmentNumber}</p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1 shrink-0">
            <a href={`tel:${student.phoneNumber}`} className="text-slate-400 hover:text-blue-600 transition-colors"><Phone size={13} /></a>
            <a href={`mailto:${student.email}`} className="text-slate-400 hover:text-blue-600 transition-colors"><Mail size={13} /></a>
        </div>
    </div>
);

const StatusChip = ({ status }) => {
    const config = {
        AVAILABLE:   { color: "bg-green-100 text-green-700",   icon: <CheckCircle size={12} />, label: "Available" },
        FULL:        { color: "bg-red-100 text-red-600",       icon: <AlertCircle size={12} />, label: "Full" },
        MAINTENANCE: { color: "bg-yellow-100 text-yellow-700", icon: <Wrench size={12} />,      label: "Maintenance" },
    };
    const { color, icon, label } = config[status] || config.AVAILABLE;
    return (
        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${color}`}>
            {icon} {label}
        </span>
    );
};

const RoomDetailModal = ({ roomId, onClose }) => {
    const [room, setRoom]       = useState(null);
    const [loading, setLoading] = useState(true);

    useState(() => {
        api.get(`/room/details/${roomId}`)
            .then((res) => setRoom(res.data.data))
            .catch(onClose)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-blue-600 p-6 text-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-2xl"><Bed size={22} /></div>
                        <div>
                            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Your Room</p>
                            <h2 className="text-2xl font-black">{loading ? "Loading..." : `Room ${room?.roomNumber}`}</h2>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="h-48 flex items-center justify-center text-slate-400 font-medium">Fetching room details...</div>
                ) : room ? (
                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: <Bed size={16} />,         value: room.type,                           label: "Type" },
                                { icon: <Users size={16} />,       value: `${room.occupancy}/${room.capacity}`, label: "Occupancy" },
                                { icon: <IndianRupee size={16} />, value: `₹${room.price}`,                    label: "/ Month" },
                            ].map(({ icon, value, label }) => (
                                <div key={label} className="bg-slate-50 p-4 rounded-2xl text-center">
                                    <div className="flex justify-center mb-1 text-blue-600">{icon}</div>
                                    <p className="text-lg font-black text-slate-800">{value}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                            <StatusChip status={room.status} />
                        </div>

                        {room.amenities?.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                    {room.amenities.map((a, i) => <AmenityPill key={i} name={a} />)}
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                Roommates ({room.students?.length || 0})
                            </p>
                            {room.students?.length > 0 ? (
                                <div className="space-y-2">
                                    {room.students.map((s) => <RoommateCard key={s._id} student={s} />)}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No roommates yet.</p>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

// ─── Profile Modal ────────────────────────────────────────────

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
        <div className="text-blue-500 shrink-0">{icon}</div>
        <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-800 truncate">{value || "—"}</p>
        </div>
    </div>
);

const ProfileModal = ({ user, onClose }) => {
    const setAuth             = useAuthStore((s) => s.setAuth);
    const logout              = useAuthStore((s) => s.logout);
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
        try { await api.post("/user/logout"); } catch { /* ignore */ }
        logout();
    };

    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
        : null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X size={18} />
                    </button>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">My Profile</p>

                    <div className="flex items-end gap-4">
                        <div className="relative">
                            {avatarSrc ? (
                                <img
                                    src={avatarSrc}
                                    alt={user?.fullName}
                                    onError={() => setAvatarSrc(null)}
                                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl font-black shadow-lg">
                                    {user?.fullName?.[0]?.toUpperCase()}
                                </div>
                            )}
                            <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                                {uploading
                                    ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : <Camera size={13} className="text-white" />
                                }
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
                            </label>
                        </div>

                        <div>
                            <h2 className="text-xl font-black">{user?.fullName}</h2>
                            <p className="text-slate-400 text-sm">@{user?.username}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info rows */}
                <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
                    <InfoRow icon={<Mail size={15} />}     label="Email"             value={user?.email} />
                    <InfoRow icon={<Phone size={15} />}    label="Phone"             value={user?.phoneNumber} />
                    <InfoRow icon={<BookOpen size={15} />} label="Branch"            value={user?.branch} />
                    <InfoRow icon={<Hash size={15} />}     label="Enrollment Number" value={user?.enrollmentNumber} />
                    <InfoRow icon={<Bed size={15} />}      label="Room"              value={user?.room?.roomNumber || "Not assigned"} />
                    <InfoRow icon={<Shield size={15} />}   label="Account ID"        value={`#${user?._id?.slice(-8).toUpperCase()}`} />
                    {joinedDate && (
                        <InfoRow icon={<Calendar size={15} />} label="Member Since" value={joinedDate} />
                    )}
                </div>

                {/* Logout */}
                <div className="px-6 pb-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors text-sm"
                    >
                        <LogOut size={15} /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

const Overview = () => {
    const { user }                              = useAuthStore();
    const [showRoomModal,    setShowRoomModal]    = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Room Card */}
                    <button
                        onClick={() => user?.room && setShowRoomModal(true)}
                        disabled={!user?.room}
                        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-left hover:shadow-md hover:border-blue-200 transition-all group disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-slate-400 text-sm font-bold uppercase mb-2">Current Room</p>
                            {user?.room && (
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            )}
                        </div>
                        <h3 className="text-4xl font-black text-slate-900">{user?.room?.roomNumber || "---"}</h3>
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                            {user?.room ? "Tap to view room details →" : "Waiting for allocation"}
                        </p>
                    </button>

                    {/* Contact Card */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <p className="text-slate-400 text-sm font-bold uppercase mb-2">Contact</p>
                        <h3 className="text-xl font-bold text-slate-900">{user?.phoneNumber}</h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">{user?.email}</p>
                    </div>

                    {/* Academic Info */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">Academic Info</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <BookOpen size={14} className="text-blue-500 shrink-0" />
                                <span className="text-slate-500 font-medium">Branch:</span>
                                <span className="font-bold text-slate-800">{user?.branch || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Hash size={14} className="text-blue-500 shrink-0" />
                                <span className="text-slate-500 font-medium">Enrollment:</span>
                                <span className="font-bold text-slate-800">{user?.enrollmentNumber || "—"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Banner */}
                    <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200 flex justify-between items-center">
                        <div>
                            <h4 className="text-2xl font-bold">Welcome back!</h4>
                            <p className="text-blue-100 mt-1">Everything looks good today.</p>
                        </div>
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
                        >
                            View Profile
                        </button>
                    </div>
                </div>

                {/* Profile Glance */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                    <div className="relative mb-4">
                        <img
                            src={user?.avatar}
                            className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-md object-cover"
                            alt={user?.fullName}
                        />
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            <User size={13} className="text-white" />
                        </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{user?.fullName}</h3>
                    <p className="text-blue-600 text-sm">@{user?.username}</p>

                    <div className="w-full mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 text-center gap-2">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                            <p className="text-xs font-bold text-green-600">Active</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Role</p>
                            <p className="text-xs font-bold text-blue-600">{user?.role}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">ID</p>
                            <p className="text-xs font-bold text-slate-800">#{user?._id?.slice(-4)}</p>
                        </div>
                    </div>

                    <div className="w-full mt-4 space-y-2">
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl">
                            <Mail size={13} className="text-slate-400 shrink-0" />
                            <p className="text-xs text-slate-600 font-medium truncate">{user?.email}</p>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl">
                            <Phone size={13} className="text-slate-400 shrink-0" />
                            <p className="text-xs text-slate-600 font-medium">{user?.phoneNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showRoomModal && user?.room && (
                <RoomDetailModal
                    roomId={user.room._id || user.room}
                    onClose={() => setShowRoomModal(false)}
                />
            )}
            {showProfileModal && (
                <ProfileModal
                    user={user}
                    onClose={() => setShowProfileModal(false)}
                />
            )}
        </div>
    );
};

export default Overview;