import { useState } from "react";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";
import {
    X, Bed, Users, IndianRupee, Wifi, Wind, ShowerHead,
    Star, Phone, Mail, ChevronRight, CheckCircle, Wrench,
    AlertCircle, Camera, Shield, Calendar, LogOut
} from "lucide-react";

const AMENITY_ICONS = {
    AC: <Wind size={13} />,
    WIFI: <Wifi size={13} />,
    "ATTACHED WASHROOM": <ShowerHead size={13} />,
    BALCONY: <Star size={13} />,
};

const AmenityPill = ({ name }) => (
    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
        {AMENITY_ICONS[name.toUpperCase()] || <Star size={13} />}
        {name}
    </span>
);

const RoommateCard = ({ student }) => (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold text-sm shrink-0">
            {student.fullName?.[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-800 text-sm truncate">{student.fullName}</p>
            <p className="text-xs text-gray-400 truncate">{student.branch}</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
            <a href={`tel:${student.phoneNumber}`} className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
                <Phone size={12} />
            </a>
            <a href={`mailto:${student.email}`} className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
                <Mail size={12} />
            </a>
        </div>
    </div>
);

const StatusChip = ({ status }) => {
    const config = {
        AVAILABLE:   { color: "text-green-600 bg-green-50",  icon: <CheckCircle size={11} />, label: "Available" },
        FULL:        { color: "text-red-500 bg-red-50",      icon: <AlertCircle size={11} />, label: "Full" },
        MAINTENANCE: { color: "text-amber-600 bg-amber-50",  icon: <Wrench size={11} />,      label: "Maintenance" },
    };
    const { color, icon, label } = config[status] || config.AVAILABLE;
    return (
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${color}`}>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Room Details</p>
                        <h2 className="text-lg font-bold text-gray-900">{loading ? "Loading..." : `Room ${room?.roomNumber}`}</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                        <X size={16} />
                    </button>
                </div>

                {loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                    </div>
                ) : room ? (
                    <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: <Bed size={14} />, value: room.type, label: "Type" },
                                { icon: <Users size={14} />, value: `${room.occupancy}/${room.capacity}`, label: "Occupancy" },
                                { icon: <IndianRupee size={14} />, value: `₹${room.price}`, label: "/ Month" },
                            ].map(({ icon, value, label }) => (
                                <div key={label} className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                                    <div className="flex justify-center mb-1 text-gray-500">{icon}</div>
                                    <p className="text-sm font-bold text-gray-800">{value}</p>
                                    <p className="text-[10px] text-gray-400 uppercase mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">Status</span>
                            <StatusChip status={room.status} />
                        </div>

                        {room.amenities?.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-500 font-medium mb-2">Amenities</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {room.amenities.map((a, i) => <AmenityPill key={i} name={a} />)}
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">
                                Roommates ({room.students?.length || 0})
                            </p>
                            {room.students?.length > 0 ? (
                                <div>{room.students.map((s) => <RoommateCard key={s._id} student={s} />)}</div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No roommates yet.</p>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
        <div className="flex items-center gap-2">
            <span className="text-gray-400">{icon}</span>
            <span className="text-sm text-gray-500">{label}</span>
        </div>
        <span className="text-sm font-medium text-gray-800">{value || "—"}</span>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">Profile</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 py-5 flex items-center gap-4 border-b border-gray-100">
                    <div className="relative shrink-0">
                        {avatarSrc ? (
                            <img src={avatarSrc} alt={user?.fullName} onError={() => setAvatarSrc(null)}
                                className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                                {user?.fullName?.[0]?.toUpperCase()}
                            </div>
                        )}
                        <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
                            {uploading
                                ? <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                : <Camera size={11} className="text-gray-500" />}
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
                        </label>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{user?.fullName}</p>
                        <p className="text-sm text-gray-400">@{user?.username}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">
                            {user?.role}
                        </span>
                    </div>
                </div>

                <div className="px-6 py-1">
                    <InfoRow icon={<Mail size={13} />}     label="Email"      value={user?.email} />
                    <InfoRow icon={<Phone size={13} />}    label="Phone"      value={user?.phoneNumber} />
                    <InfoRow icon={<Bed size={13} />}      label="Room"       value={user?.room?.roomNumber || "Not assigned"} />
                    <InfoRow icon={<Shield size={13} />}   label="Account ID" value={`#${user?._id?.slice(-8).toUpperCase()}`} />
                    {joinedDate && <InfoRow icon={<Calendar size={13} />} label="Joined" value={joinedDate} />}
                </div>

                <div className="px-6 py-4">
                    <button onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-red-500 hover:bg-red-50 font-medium rounded-lg transition-colors text-sm border border-red-100">
                        <LogOut size={14} /> Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

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
        <div className="max-w-2xl mx-auto space-y-5 py-2">

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400">{greeting()}</p>
                    <h1 className="text-xl font-bold text-gray-900 mt-0.5">{user?.fullName}</h1>
                </div>
                <button onClick={() => setShowProfileModal(true)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                            {user?.fullName?.[0]?.toUpperCase()}
                        </div>
                    )}
                    <span className="text-sm text-gray-600 font-medium">Profile</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                    onClick={() => user?.room && setShowRoomModal(true)}
                    disabled={!user?.room}
                    className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-gray-300 hover:shadow-sm transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center justify-between mb-3">
                        <Bed size={16} className="text-gray-400" />
                        {user?.room && <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />}
                    </div>
                    <p className="text-xs text-gray-400 mb-0.5">Room</p>
                    <p className="text-2xl font-bold text-gray-900">{user?.room?.roomNumber || "—"}</p>
                    <p className="text-xs text-gray-400 mt-1">{user?.room ? "Click to view details" : "Not assigned"}</p>
                </button>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <Mail size={16} className="text-gray-400 mb-3" />
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <Phone size={16} className="text-gray-400 mb-3" />
                    <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{user?.phoneNumber || "—"}</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Account</p>
                <InfoRow icon={<Shield size={13} />}   label="Account ID" value={`#${user?._id?.slice(-8).toUpperCase()}`} />
                <InfoRow icon={<span className="text-xs font-bold text-gray-400">R</span>} label="Role" value={user?.role} />
                <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                        <span className="text-sm text-gray-500">Status</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">Active</span>
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