import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm]       = useState({ email:"", password:"" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const { loginUser }         = useAuth();
  const nav                   = useNavigate();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await register(form);
      loginUser(data);
      nav("/dashboard");
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === "object") setError(Object.values(msg)[0]);
      else setError(msg || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{fontSize:"2.5rem"}}>⚡</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Join LinkSnap - it is free forever</p>
        </div>
        <form onSubmit={submit} className="card">
          <div className="input-group">
            <label>Email</label>
            <input id="reg-email" className="input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handle} required/>
          </div>
          <div className="input-group" style={{position:"relative"}}>
            <label>Password (min 8 chars)</label>
            <input id="reg-password" className="input" type={showPw?"text":"password"} name="password" placeholder="..." value={form.password} onChange={handle} required style={{paddingRight:"2.8rem"}}/>
            <button type="button" className="copy-btn" style={{top:"auto",bottom:".7rem",position:"absolute"}} onClick={()=>setShowPw(!showPw)}>
              {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          {error && <p style={{color:"var(--danger)",fontSize:".85rem",marginBottom:".75rem"}}>{error}</p>}
          <button id="reg-submit" className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
          <p style={{textAlign:"center",marginTop:"1rem",fontSize:".85rem",color:"var(--muted)"}}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
