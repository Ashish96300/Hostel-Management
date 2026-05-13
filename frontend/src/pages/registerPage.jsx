import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "", email: "", username: "", password: "",
        phoneNumber: "", role: "STUDENT"
    });
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (avatar) data.append("avatar", avatar);

        try {
            await api.post("/user/register", data);
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10 border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900">Student Registration</h1>
                    <p className="text-slate-500 mt-2">Fill in your details to get started</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                            <input type="text" required className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                            <input type="text" required className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                                onChange={(e) => setFormData({...formData, username: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                            <input type="email" required className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                            <input type="text" required className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                        <input type="password" required className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <label className="block text-xs font-bold text-blue-700 uppercase mb-2">Upload Profile Picture</label>
                        <input type="file" accept="image/*" className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
                            onChange={(e) => setAvatar(e.target.files[0])} />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all mt-6 shadow-lg disabled:opacity-50">
                        {loading ? "Creating Account..." : "Register Now"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already a member? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;