import { AlertTriangle, Clock, CheckCircle, XCircle, MessagesSquare } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import useFilters from "../../hooks/useFilter";  // ✅ matches your export
import api from "../../api/axios";

const STATUS_CONFIG = {
    PENDING:     { color: "bg-yellow-100 text-yellow-700",  icon: <Clock size={14} /> },
    IN_PROGRESS: { color: "bg-blue-100 text-blue-700",      icon: <AlertTriangle size={14} /> },
    RESOLVED:    { color: "bg-green-100 text-green-700",    icon: <CheckCircle size={14} /> },
    REJECTED:    { color: "bg-red-100 text-red-700",        icon: <XCircle size={14} /> },
};

const CATEGORY_COLOR = {
    ELECTRICITY: "bg-amber-50 text-amber-700",
    WATER:       "bg-cyan-50 text-cyan-700",
    PLUMBING:    "bg-orange-50 text-orange-700",
    CLEANING:    "bg-purple-50 text-purple-700",
    FOOD:        "bg-pink-50 text-pink-700",
    INTERNET:    "bg-indigo-50 text-indigo-700",
    OTHER:       "bg-slate-100 text-slate-600",
};
const StatusBadge = ({ status }) => {
    const { color, icon } = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${color}`}>
            {icon} {status.replace("_", " ")}
        </span>
    );
};

const ComplaintCard = ({ complaint, onUpdateStatus }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-slate-800 truncate">{complaint.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${CATEGORY_COLOR[complaint.category] || "bg-slate-100 text-slate-600"}`}>
                        {complaint.category}
                    </span>
                </div>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{complaint.description}</p>

                {complaint.student && (
                    <p className="text-xs text-slate-400 font-semibold mt-2">
                        👤 {complaint.student.fullName}
                        {complaint.student.room.rommNumber && ` • Room ${complaint.student.room.roomNumber}`}
                    </p>
                )}

                {complaint.commentByAdmin && (
                    <p className="text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2 mt-3 italic">
                        💬 {complaint.commentByAdmin}
                    </p>
                )}
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
                <StatusBadge status={complaint.status} />
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>

        {/* Action buttons — hidden if already resolved/rejected */}
        {!["RESOLVED", "REJECTED"].includes(complaint.status) && (
            <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2 flex-wrap">
                {complaint.status !== "IN_PROGRESS" && (
                    <button
                        onClick={() => onUpdateStatus(complaint._id, "IN_PROGRESS")}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors"
                    >
                        <AlertTriangle size={13} /> Mark In Progress
                    </button>
                )}
                <button
                    onClick={() => onUpdateStatus(complaint._id, "RESOLVED")}
                    className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-700 font-bold text-xs rounded-xl hover:bg-green-100 transition-colors"
                >
                    <CheckCircle size={13} /> Resolve
                </button>
                <button
                    onClick={() => onUpdateStatus(complaint._id, "REJECTED")}
                    className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-700 font-bold text-xs rounded-xl hover:bg-red-100 transition-colors"
                >
                    <XCircle size={13} /> Reject
                </button>
            </div>
        )}
    </div>
);

const ComplaintFilters = ({ filters, updateFilter }) => (
    <div className="flex gap-4 flex-wrap">
        <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
        </select>

        <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
            <option value="">All Categories</option>
            <option value="ELECTRICITY">Electricity</option>
            <option value="WATER">Water</option>
            <option value="PLUMBING">Plumbing</option>
            <option value="CLEANING">Cleaning</option>
            <option value="FOOD">Food</option>
            <option value="INTERNET">Internet</option>
            <option value="OTHER">Other</option>
        </select>
    </div>
);
const StatsBar = ({ complaints }) => {
    const counts = complaints.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
    }, {});

    const stats = [
        { label: "Pending",     value: counts.PENDING     || 0, color: "text-yellow-600" },
        { label: "In Progress", value: counts.IN_PROGRESS || 0, color: "text-blue-600"   },
        { label: "Resolved",    value: counts.RESOLVED    || 0, color: "text-green-600"  },
        { label: "Rejected",    value: counts.REJECTED    || 0, color: "text-red-600"    },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, value, color }) => (
                <div key={label} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <p className={`text-2xl font-black ${color}`}>{value}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{label}</p>
                </div>
            ))}
        </div>
    );
};
const ComplaintManagement = () => {
    const { data: complaints = [], loading, refetch } = useFetch("/complaint/admin/all");

    const { filters, updateFilter } = useFilters({ status: "", category: "" });

    const updateStatus = async (complaintId, status) => {
        try {
            const commentByAdmin = prompt(`Add admin comment for "${status}" (optional)`) || "";
            await api.patch(`/complaint/admin/status/${complaintId}`, { status, commentByAdmin });
            refetch();
        } catch (error) {
            alert(error.response?.data?.message || "Update failed");
        }
    };

    const filtered = complaints.filter((c) => {
        const matchStatus   = !filters.status   || c.status   === filters.status;
        const matchCategory = !filters.category || c.category === filters.category;
        return matchStatus && matchCategory;
    });

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-slate-400 font-medium">
            Loading complaints...
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Complaint Management</h2>
                    <p className="text-sm text-slate-500 font-medium">Review and resolve student issues</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
                    <MessagesSquare size={16} className="text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">{complaints.length} Total</span>
                </div>
            </div>

            {/* Stats */}
            <StatsBar complaints={complaints} />

            {/* Filters */}
            <ComplaintFilters filters={filters} updateFilter={updateFilter} />

            {/* List */}
            {filtered.length === 0 ? (
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl">
                    <p className="text-slate-400 font-medium italic">No complaints found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((complaint) => (
                        <ComplaintCard
                            key={complaint._id}
                            complaint={complaint}
                            onUpdateStatus={updateStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ComplaintManagement;