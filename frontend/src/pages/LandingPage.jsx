import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Zap, BarChart2, Shield, Clock } from "lucide-react";

const features = [
  { icon: <Zap size={24} color="var(--accent)"/>, title: "Instant Shortening", desc: "Generate short links in milliseconds with a unique code or your own custom alias." },
  { icon: <BarChart2 size={24} color="var(--accent2)"/>, title: "Deep Analytics", desc: "Track every click with daily trends, referrers, and device breakdown." },
  { icon: <Clock size={24} color="var(--accent3)"/>, title: "Link Expiration", desc: "Set expiry dates so links auto-disable when they are no longer needed." },
  { icon: <Shield size={24} color="#f9ca24"/>, title: "Secure by Default", desc: "JWT auth, BCrypt passwords, and privacy-first click tracking." },
];

export default function LandingPage() {
  return (
    <div className="page">
      <Navbar />
      <section className="hero">
        <h1>Shorten links.<br/><span>Track everything.</span></h1>
        <p>LinkSnap turns long, ugly URLs into smart short links with a powerful analytics dashboard — perfect for your portfolio.</p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary" style={{fontSize:"1.05rem",padding:".8rem 2rem"}}>Start for Free</Link>
          <Link to="/login"    className="btn btn-ghost"   style={{fontSize:"1.05rem",padding:".8rem 2rem"}}>Sign In</Link>
        </div>
      </section>
      <section style={{padding:"4rem 2rem", background:"var(--surface)"}}>
        <h2 style={{textAlign:"center",fontSize:"1.6rem",fontWeight:800,marginBottom:"2.5rem"}}>Everything you need</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:"1.5rem",maxWidth:960,margin:"0 auto"}}>
          {features.map(f=>(
            <div className="card" key={f.title} style={{display:"flex",flexDirection:"column",gap:".75rem"}}>
              <div style={{width:44,height:44,borderRadius:12,background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center"}}>{f.icon}</div>
              <h3 style={{fontWeight:700}}>{f.title}</h3>
              <p style={{color:"var(--muted)",fontSize:".9rem"}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <footer style={{textAlign:"center",padding:"2rem",color:"var(--muted)",fontSize:".85rem"}}>
        Built with Spring Boot + React &bull; Resume Project 2024
      </footer>
    </div>
  );
}
