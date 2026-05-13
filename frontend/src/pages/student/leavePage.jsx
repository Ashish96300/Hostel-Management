import { useState, useEffect } from "react";
import { Calendar as CalIcon, PlaneTakeoff } from "lucide-react";
import api from "../../api/axios";
const Leaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ startDate: "", endDate: "", reason: "" });

    const fetchLeaves = async (isMounted) => {
        try {
            const res = await api.get("/leave/my-requests");
            if (isMounted && res.data?.data) setLeaves(res.data.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/leave/apply", formData);
            setFormData({ startDate: "", endDate: "", reason: "" });
            fetchLeaves(true);
            alert("Leave application sent!");
        } catch (err) {
            alert(err.response?.data?.message || "Error applying for leave");
        } finally { setLoading(false); }
    };

    useEffect(() => {
        let isMounted = true;
        fetchLeaves(isMounted);
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <PlaneTakeoff size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">Apply for Leave</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</label>
                                <input type="date" required className="w-full mt-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</label>
                                <input type="date" required className="w-full mt-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</label>
                            <textarea required className="w-full mt-1 p-3 bg-slate-50 border border-slate-100 rounded-xl h-24 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm" 
                                placeholder="Purpose of leave..." value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} />
                        </div>
                        <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
                            {loading ? "Processing..." : "Submit Application"}
                        </button>
                    </form>
                </div>

                {/* History */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-slate-800 px-2">Leave History</h3>
                    <div className="space-y-4">
                        {leaves.map(l => (
                            <div key={l._id} className="bg-white p-6 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                                <div className="flex gap-4 items-center">
                                    <div className={`p-3 rounded-xl ${l.status === 'Approved' ? 'bg-green-50 text-green-600' : l.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                        <CalIcon size={24}/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</p>
                                        <p className="text-xs text-slate-500">{l.reason}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                    l.status === 'Approved' ? 'bg-green-100 text-green-700' : l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {l.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaves;