import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [form, setForm]         = useState({ email:"", password:"" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const { loginUser }           = useAuth();
  const nav                     = useNavigate();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data);
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{fontSize:"2.5rem"}}>⚡</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to your LinkSnap account</p>
        </div>
        <form onSubmit={submit} className="card">
          <div className="input-group">
            <label>Email</label>
            <input id="login-email" className="input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handle} required/>
          </div>
          <div className="input-group" style={{position:"relative"}}>
            <label>Password</label>
            <input id="login-password" className="input" type={showPw?"text":"password"} name="password" placeholder="..." value={form.password} onChange={handle} required style={{paddingRight:"2.8rem"}}/>
            <button type="button" className="copy-btn" style={{top:"auto",bottom:".7rem",position:"absolute"}} onClick={()=>setShowPw(!showPw)}>
              {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          {error && <p style={{color:"var(--danger)",fontSize:".85rem",marginBottom:".75rem"}}>{error}</p>}
          <button id="login-submit" className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p style={{textAlign:"center",marginTop:"1rem",fontSize:".85rem",color:"var(--muted)"}}>
            No account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
