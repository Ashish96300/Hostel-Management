import { useState, useEffect } from "react";
import api from "../../api/axios";
import { AlertCircle, CheckCircle, Clock, Send, } from "lucide-react";

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    // Added 'title' to the state
    const [formData, setFormData] = useState({ 
        title: "", 
        category: "Electricity", 
        description: "" 
    });

    const fetchComplaints = async () => {
        try {
            const res = await api.get("/complaint/my-complaints");
            setComplaints(res.data.data);
        } catch (err) {
            console.error("Error fetching complaints", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            
            await api.post("/complaint/submit", formData);
            setFormData({ title: "", category: "Electricity", description: "" });
            fetchComplaints();
            alert("Complaint registered successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Error submitting complaint");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            try {
                const res = await api.get("/complaint/my-complaints");
                if (isMounted && res.data?.data) setComplaints(res.data.data);
            } catch (err) { console.log(err); }
        };
        loadData();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">Raise Issue</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New Title Field */}
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Complaint Title</label>
                            <input 
                                type="text"
                                required
                                className="w-full mt-1 p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                                placeholder="e.g. Fan not working"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                            <select 
                                className="w-full mt-1 p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option>Electricity</option>
                                <option>Water</option>
                                <option>Cleaning</option>
                                <option>Internet</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                            <textarea 
                                required
                                className="w-full mt-1 p-3 bg-slate-50 border border-slate-100 rounded-xl h-24 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700" 
                                placeholder="Details about the problem..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                        >
                            {loading ? "Submitting..." : <><Send size={18}/> Submit Complaint</>}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="font-bold text-slate-800">Recent Updates</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{complaints.length} Records</span>
                    </div>

                    <div className="space-y-4">
                        {complaints.length === 0 ? (
                            <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-200 text-center">
                                <p className="text-slate-400 font-medium italic">No issues reported yet.</p>
                            </div>
                        ) : (
                            complaints.map(c => (
                                <div key={c._id} className="bg-white p-6 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex gap-4 items-center">
                                        <div className={`p-3 rounded-xl ${c.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {c.status === 'Resolved' ? <CheckCircle size={24}/> : <Clock size={24}/>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{c.title}</p>
                                            <p className="text-xs text-blue-600 font-semibold">{c.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                            c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {c.status}
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{new Date(c.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Complaints;