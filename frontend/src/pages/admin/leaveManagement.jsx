import { Clock, CheckCircle, XCircle, CalendarDays, CalendarCheck } from "lucide-react";
import api from "../../api/axios";
import useFetch from "../../hooks/useFetch";
import useFilters from "../../hooks/useFilter"; // ✅ matches your export

const STATUS_CONFIG = {
    PENDING:  { color: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} /> },
    APPROVED: { color: "bg-green-100 text-green-700",   icon: <CheckCircle size={14} /> },
    REJECTED: { color: "bg-red-100 text-red-700",       icon: <XCircle size={14} /> },
};

const getDayCount = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

const StatusBadge = ({ status }) => {
    const { color, icon } = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${color}`}>
            {icon} {status}
        </span>
    );
};

const LeaveCard = ({ leave, onUpdateStatus }) => {
    const days = getDayCount(leave.startDate, leave.endDate);
    const isPending = leave.status === "PENDING";

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{leave.reason}</h3>

                    {leave.student && (
                        <p className="text-xs text-slate-400 font-semibold mt-1">
                            👤 {leave.student.fullName}
                            {leave.student.room.roomNumber && ` • Room ${leave.student.room.roomNumber}`}
                        </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 font-semibold">
                        <span className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl">
                            <CalendarDays size={13} />
                            {new Date(leave.startDate).toLocaleDateString()}
                        </span>
                        <span className="text-slate-300 self-center">→</span>
                        <span className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl">
                            <CalendarDays size={13} />
                            {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl">
                            <CalendarCheck size={13} />
                            {days} {days === 1 ? "day" : "days"}
                        </span>
                    </div>

                    {leave.adminComment && (
                        <p className="text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2 mt-3 italic">
                            💬 {leave.adminComment}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={leave.status} />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {new Date(leave.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Actions — only shown for pending */}
            {isPending && (
                <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
                    <button
                        onClick={() => onUpdateStatus(leave._id, "APPROVED")}
                        className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-700 font-bold text-xs rounded-xl hover:bg-green-100 transition-colors"
                    >
                        <CheckCircle size={13} /> Approve
                    </button>
                    <button
                        onClick={() => onUpdateStatus(leave._id, "REJECTED")}
                        className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-700 font-bold text-xs rounded-xl hover:bg-red-100 transition-colors"
                    >
                        <XCircle size={13} /> Reject
                    </button>
                </div>
            )}
        </div>
    );
};

const LeaveFilters = ({ filters, updateFilter }) => (
    <div className="flex gap-4 flex-wrap">
        <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
        </select>
    </div>
);

const StatsBar = ({ leaves }) => {
    const counts = leaves.reduce((acc, l) => {
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
    }, {});

    const stats = [
        { label: "Pending",  value: counts.PENDING  || 0, color: "text-yellow-600" },
        { label: "Approved", value: counts.APPROVED || 0, color: "text-green-600"  },
        { label: "Rejected", value: counts.REJECTED || 0, color: "text-red-600"    },
        { label: "Total",    value: leaves.length,         color: "text-blue-600"   },
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

// ─── Main Component ───────────────────────────────────────────

const LeaveManagement = () => {
    const { data: leaves = [], loading, refetch } = useFetch("/leave/admin/all-leaves");
    const { filters, updateFilter } = useFilters({ status: "" }); // ✅ updateFilter not setFilters

    const updateStatus = async (leaveId, status) => {
        try {
            const adminComment = prompt(`Add admin comment for "${status}" (optional)`) || "";
            await api.patch(`/leave/admin/status/${leaveId}`, { status, adminComment });
            refetch();
        } catch (error) {
            alert(error.response?.data?.message || "Update failed");
        }
    };

    const filtered = leaves.filter((l) =>
        !filters.status || l.status === filters.status
    );

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-slate-400 font-medium">
            Loading leave requests...
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Leave Management</h2>
                    <p className="text-sm text-slate-500 font-medium">Review and manage student leave requests</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
                    <CalendarDays size={16} className="text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">{leaves.length} Total</span>
                </div>
            </div>

            {/* Stats */}
            <StatsBar leaves={leaves} />

            {/* Filters */}
            <LeaveFilters filters={filters} updateFilter={updateFilter} />

            {/* List */}
            {filtered.length === 0 ? (
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl">
                    <p className="text-slate-400 font-medium italic">No leave requests found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((leave) => (
                        <LeaveCard
                            key={leave._id}
                            leave={leave}
                            onUpdateStatus={updateStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;