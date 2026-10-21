import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUrls, createUrl, updateUrl, deleteUrl } from "../api/urls";
import Navbar from "../components/Navbar";
import { useToast } from "../hooks/useToast";
import { Copy, ExternalLink, BarChart2, Trash2, ToggleLeft, ToggleRight, Plus, Calendar } from "lucide-react";

function fmt(dt) { return dt ? new Date(dt).toLocaleDateString() : "-"; }

export default function DashboardPage() {
  const [urls, setUrls]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm]         = useState({ originalUrl:"", customCode:"", expiresAt:"" });
  const [showForm, setShowForm] = useState(false);
  const { show, ToastEl }       = useToast();
  const nav                     = useNavigate();

  const load = useCallback(async () => {
    try { const { data } = await getUrls(); setUrls(data); }
    catch { show("Failed to load URLs", "error"); }
    finally { setLoading(false); }
  }, [show]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async e => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = { originalUrl: form.originalUrl };
      if (form.customCode) payload.customCode = form.customCode;
      if (form.expiresAt)  payload.expiresAt  = new Date(form.expiresAt).toISOString().slice(0,19);
      await createUrl(payload);
      show("Short link created!");
      setForm({ originalUrl:"", customCode:"", expiresAt:"" });
      setShowForm(false);
      load();
    } catch (err) {
      const msg = err.response?.data;
      show(typeof msg === "object" ? Object.values(msg)[0] : (msg || "Error creating link"), "error");
    } finally { setCreating(false); }
  };

  const toggleActive = async (u) => {
    try {
      await updateUrl(u.id, { isActive: !u.active });
      show(u.active ? "Link deactivated" : "Link activated");
      load();
    } catch { show("Failed to update", "error"); }
  };

  const handleDelete = async (u) => {
    if (!window.confirm("Delete this link?")) return;
    try { await deleteUrl(u.id); show("Deleted"); load(); }
    catch { show("Failed to delete", "error"); }
  };

  const copy = (text) => { navigator.clipboard.writeText(text); show("Copied!"); };

  const totalClicks = urls.reduce((a,u) => a + u.totalClicks, 0);
  const activeCount = urls.filter(u => u.active).length;

  return (
    <div className="page">
      <Navbar/>
      {ToastEl}
      <div className="main-content">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
          <div>
            <h1 style={{fontSize:"1.6rem",fontWeight:800}}>My Links</h1>
            <p style={{color:"var(--muted)",fontSize:".9rem"}}>Manage and track all your short links</p>
          </div>
          <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}>
            <Plus size={17}/> {showForm ? "Cancel" : "New Link"}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{marginBottom:"1.5rem"}}>
            <h3 className="section-title">Create Short Link</h3>
            <form onSubmit={handleCreate}>
              <div className="shorten-form">
                <div className="input-group" style={{flex:2,minWidth:260,marginBottom:0}}>
                  <label>Long URL *</label>
                  <input id="new-url" className="input" type="url" placeholder="https://your-long-url.com/path" value={form.originalUrl}
                    onChange={e=>setForm(p=>({...p,originalUrl:e.target.value}))} required/>
                </div>
                <div className="input-group" style={{flex:1,minWidth:140,marginBottom:0}}>
                  <label>Custom code (optional)</label>
                  <input id="custom-code" className="input" placeholder="mylink" value={form.customCode}
                    onChange={e=>setForm(p=>({...p,customCode:e.target.value}))}/>
                </div>
                <div className="input-group" style={{flex:1,minWidth:160,marginBottom:0}}>
                  <label><Calendar size={13}/> Expires at (optional)</label>
                  <input id="expires-at" className="input" type="datetime-local" value={form.expiresAt}
                    onChange={e=>setForm(p=>({...p,expiresAt:e.target.value}))}/>
                </div>
              </div>
              <button id="create-btn" className="btn btn-primary" disabled={creating}>
                {creating ? "Creating..." : "Generate Link"}
              </button>
            </form>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Links</h3>
            <div className="val">{urls.length}</div>
          </div>
          <div className="stat-card">
            <h3>Active</h3>
            <div className="val" style={{color:"var(--success)"}}>{activeCount}</div>
          </div>
          <div className="stat-card">
            <h3>Total Clicks</h3>
            <div className="val" style={{color:"var(--accent)"}}>{totalClicks.toLocaleString()}</div>
          </div>
        </div>

        {loading ? <div className="spinner"/> : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Short Link</th>
                    <th>Original URL</th>
                    <th>Clicks</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.length === 0 && (
                    <tr><td colSpan={6} style={{textAlign:"center",color:"var(--muted)",padding:"2rem"}}>No links yet. Create your first one!</td></tr>
                  )}
                  {urls.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:".4rem"}}>
                          <span style={{color:"var(--accent)",fontWeight:600,fontSize:".9rem"}}>{u.shortCode}</span>
                          <button className="copy-btn" style={{position:"static",transform:"none"}} onClick={()=>copy(u.shortUrl)} title="Copy"><Copy size={13}/></button>
                          <a href={u.shortUrl} target="_blank" rel="noreferrer" title="Open"><ExternalLink size={13} color="var(--muted)"/></a>
                        </div>
                      </td>
                      <td style={{maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        <span title={u.originalUrl} style={{color:"var(--muted)",fontSize:".85rem"}}>{u.originalUrl}</span>
                      </td>
                      <td><span className="badge badge-purple">{u.totalClicks}</span></td>
                      <td style={{fontSize:".85rem",color:"var(--muted)"}}>{fmt(u.expiresAt)}</td>
                      <td>
                        <span className={`badge ${u.active ? "badge-green" : "badge-red"}`}>
                          {u.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="btn btn-ghost btn-sm" onClick={()=>nav(`/analytics/${u.id}`)} title="Analytics">
                            <BarChart2 size={14}/>
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={()=>toggleActive(u)} title={u.active?"Deactivate":"Activate"}>
                            {u.active ? <ToggleRight size={14} color="var(--success)"/> : <ToggleLeft size={14} color="var(--muted)"/>}
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={()=>handleDelete(u)} title="Delete">
                            <Trash2 size={14} color="var(--danger)"/>
                          </button>
                        </div>
                      </td>
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
