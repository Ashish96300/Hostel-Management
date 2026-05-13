import { useState } from "react";
import api from "../../api/axios";
import { Bed, Plus, UserPlus, Users, IndianRupee, Wrench } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import useFilters from "../../hooks/useFilter"; // ✅ matches your export name

const RoomCard = ({ room, onAssign, onToggleMaintenance }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 text-blue-600 rounded-2xl">
                <Bed size={22} />
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                room.status === "FULL"        ? "bg-red-100 text-red-600"    :
                room.status === "MAINTENANCE" ? "bg-yellow-100 text-yellow-700" :
                                               "bg-green-100 text-green-600"
            }`}>
                {room.status}
            </span>
        </div>

        <h3 className="text-xl font-bold text-slate-800">Room {room.roomNumber}</h3>
        <p className="text-xs text-slate-400 font-bold uppercase mt-1">{room.type}</p>

        <div className="mt-4 flex justify-between text-sm text-slate-600 font-semibold">
            <span className="flex items-center gap-1">
                <Users size={14} /> {room.occupancy}/{room.capacity}
            </span>
            <span className="flex items-center gap-1">
                <IndianRupee size={14} /> {room.price}
            </span>
        </div>

        <div className="mt-4 flex gap-2">
            <button
                onClick={() => onAssign(room._id)}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
                <UserPlus size={14} /> Assign
            </button>
            <button
                onClick={() => onToggleMaintenance(room._id, room.status)}
                className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-xl hover:bg-yellow-200 transition-colors"
                title="Toggle Maintenance"
            >
                <Wrench size={16} />
            </button>
        </div>
    </div>
);

const RoomFilters = ({ filters, updateFilter }) => (
    <div className="flex gap-4 flex-wrap">
        <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="FULL">Full</option>
            <option value="MAINTENANCE">Maintenance</option>
        </select>

        <select
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
            <option value="">All Types</option>
            <option value="SINGLE">Single</option>
            <option value="DOUBLE">Double</option>
            <option value="TRIPLE">Triple</option>
        </select>
    </div>
);

const AddRoomModal = ({ onClose, onSuccess }) => {
    const [roomData, setRoomData] = useState({
        roomNumber: "", type: "SINGLE", capacity: "", price: "", amenities: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/room/create", {
                ...roomData,
                amenities: roomData.amenities.split(",").map((i) => i.trim()).filter(Boolean)
            });
            onSuccess();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create room");
        }
    };

    const field = (placeholder, key, type = "text") => (
        <input
            type={type}
            placeholder={placeholder}
            value={roomData[key]}
            onChange={(e) => setRoomData({ ...roomData, [key]: e.target.value })}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
    );

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl w-[420px] shadow-2xl space-y-4">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Add New Room</h2>

                {field("Room Number", "roomNumber")}

                <select
                    value={roomData.type}
                    onChange={(e) => setRoomData({ ...roomData, type: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="SINGLE">Single</option>
                    <option value="DOUBLE">Double</option>
                    <option value="TRIPLE">Triple</option>
                </select>

                {field("Capacity", "capacity", "number")}
                {field("Price (₹/month)", "price", "number")}
                {field("Amenities (Ac or Attched WashRoom e.t.c)", "amenities")}

                <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                        Create Room
                    </button>
                    <button type="button" onClick={onClose} className="flex-1 border border-slate-200 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
const RoomManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const { filters, updateFilter, queryString } = useFilters({ status: "", type: "" });
    const { data: rooms = [], loading, refetch } = useFetch(`/room/all?${queryString}`);

    const assignStudent = async (roomId) => {
        const email = prompt("Enter Student Email");
        if (!email) return;
        try {
            await api.post("/room/assign-student", { roomId, email });
            refetch();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to assign student");
        }
    };

    const toggleMaintenance = async (roomId, currentStatus) => {
        const newStatus = currentStatus === "MAINTENANCE" ? "AVAILABLE" : "MAINTENANCE";
        try {
            await api.patch(`/room/update-status/${roomId}`, { status: newStatus });
            refetch();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-slate-400 font-medium">
            Loading rooms...
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Room Management</h2>
                    <p className="text-sm text-slate-500 font-medium">Manage hostel capacity and assignments</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus size={18} /> Add Room
                </button>
            </div>

            {/* Filters */}
            <RoomFilters filters={filters} updateFilter={updateFilter} />

            {/* Grid */}
            {rooms.length === 0 ? (
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl">
                    <p className="text-slate-400 font-medium italic">No rooms found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <RoomCard
                            key={room._id}
                            room={room}
                            onAssign={assignStudent}
                            onToggleMaintenance={toggleMaintenance}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <AddRoomModal
                    onClose={() => setShowModal(false)}
                    onSuccess={refetch}
                />
            )}
        </div>
    );
};

export default RoomManagement;