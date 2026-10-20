import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnalytics } from "../api/urls";
import Navbar from "../components/Navbar";
import { useToast } from "../hooks/useToast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import { ArrowLeft, MousePointerClick, TrendingUp, Calendar } from "lucide-react";

function fmt(dt) {
  if (!dt) return "";
  return new Date(dt).toLocaleString();
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:".6rem .9rem",fontSize:".85rem"}}>
        <p style={{color:"var(--muted)"}}>{label}</p>
        <p style={{color:"var(--accent)",fontWeight:700}}>{payload[0].value} clicks</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { id }          = useParams();
  const nav             = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { show, ToastEl } = useToast();

  useEffect(() => {
    getAnalytics(id)
      .then(r => setData(r.data))
      .catch(() => show("Failed to load analytics", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><Navbar/><div className="spinner"/></div>;
  if (!data)   return <div className="page"><Navbar/><div className="main-content"><p style={{color:"var(--muted)"}}>No data.</p></div></div>;

  const chartData = Object.entries(data.clicksByDay || {}).map(([date, count]) => ({ date, count }));

  return (
    <div className="page">
      <Navbar/>
      {ToastEl}
      <div className="main-content">
        <button className="btn btn-ghost btn-sm" style={{marginBottom:"1.25rem"}} onClick={()=>nav("/dashboard")}>
          <ArrowLeft size={15}/> Back to Dashboard
        </button>

        <h1 style={{fontSize:"1.5rem",fontWeight:800,marginBottom:.25+"rem"}}>Analytics</h1>
        <p style={{color:"var(--accent)",fontFamily:"monospace",marginBottom:"1.5rem",fontSize:"1rem"}}>
          /{data.shortCode}
        </p>
        <p style={{color:"var(--muted)",fontSize:".85rem",marginBottom:"2rem",wordBreak:"break-all"}}>{data.originalUrl}</p>

        <div className="stats-grid" style={{marginBottom:"2rem"}}>
          <div className="stat-card">
            <h3><MousePointerClick size={12}/> Total Clicks</h3>
            <div className="val" style={{color:"var(--accent)"}}>{data.totalClicks.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <h3><Calendar size={12}/> Active Days</h3>
            <div className="val">{chartData.length}</div>
          </div>
          <div className="stat-card">
            <h3><TrendingUp size={12}/> Peak Day</h3>
            <div className="val" style={{fontSize:"1.2rem"}}>
              {chartData.length ? Math.max(...chartData.map(d=>d.count)) : 0}
            </div>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="card" style={{marginBottom:"1.5rem"}}>
            <h2 className="section-title">Clicks Over Time</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{top:5,right:20,left:0,bottom:5}}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6c63ff" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#6c63ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)"/>
                  <XAxis dataKey="date" tick={{fill:"var(--muted)",fontSize:11}} tickLine={false}/>
                  <YAxis tick={{fill:"var(--muted)",fontSize:11}} tickLine={false} axisLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Area type="monotone" dataKey="count" stroke="#6c63ff" strokeWidth={2} fill="url(#colorClicks)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {data.recentClicks?.length > 0 && (
          <div className="card">
            <h2 className="section-title">Recent Clicks</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Referrer</th>
                    <th>User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentClicks.map((c,i) => (
                    <tr key={i}>
                      <td style={{fontSize:".85rem",whiteSpace:"nowrap"}}>{fmt(c.clickedAt)}</td>
                      <td style={{fontSize:".83rem",color:"var(--muted)",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.referrer || "Direct"}</td>
                      <td style={{fontSize:".78rem",color:"var(--muted)",maxWidth:280,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.userAgent || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
