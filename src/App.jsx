import React, { useState, useEffect } from 'react';

/**
 * CONFIGURATION
 * Set DEMO_MODE to false to connect to your local .NET API.
 */
const DEMO_MODE = false; 
const API_ROOT = "https://localhost:7132/api"; // Points to the root to access both /inventory and /compliance

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Group 1 Data (Inventory)
  const [licenses, setLicenses] = useState([]);
  const [devices, setDevices] = useState([]);

  // Group 2 Data (Compliance)
  const [complianceReport, setComplianceReport] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [renewals, setRenewals] = useState([]);

  // --- MOCK DATA (Fallback) ---
  const MOCK_DATA = {
    licenses: [
      { licenseId: 1, productName: "Visual Studio 2022", vendor: "Microsoft", licenseType: "Per-Device", totalEntitlements: 2, cost: 500, expiryDate: "2025-12-31" }
    ],
    devices: [
      { deviceId: 1, hostname: "DEV-LAPTOP-01", deviceType: "Laptop", os: "Windows 11", installations: [{ productName: "Visual Studio 2022" }] }
    ],
    compliance: [
      { productName: "Visual Studio 2022", licenseType: "Per-Device", totalEntitlements: 2, usedLicenses: 3, status: "Over-Licensed", gap: -1 }
    ],
    alerts: [
      { eventId: 1, eventType: "OverUsage", severity: "High", details: "Detected 3 installs but only 2 licenses owned.", detectedAt: new Date().toISOString() }
    ],
    renewals: [
      { taskId: 1, status: "QuoteRequested", assignedTo: "procurement@corp.com", dueDate: "2024-06-01", costEstimate: 1000 }
    ]
  };

  // -- Fetch Data --
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setLicenses(MOCK_DATA.licenses);
        setDevices(MOCK_DATA.devices);
        setComplianceReport(MOCK_DATA.compliance);
        setAlerts(MOCK_DATA.alerts);
        setRenewals(MOCK_DATA.renewals);
      } else {
        // Group 1 Endpoints
        const licRes = await fetch(`${API_ROOT}/inventory/licenses`);
        const devRes = await fetch(`${API_ROOT}/inventory/devices`);
        
        // Group 2 Endpoints
        const compRes = await fetch(`${API_ROOT}/compliance/report`);
        const alertRes = await fetch(`${API_ROOT}/compliance/alerts`);
        const renewRes = await fetch(`${API_ROOT}/compliance/renewals`);

        if (!licRes.ok || !compRes.ok) throw new Error("Failed to connect to API");

        setLicenses(await licRes.json());
        setDevices(await devRes.json());
        setComplianceReport(await compRes.json());
        setAlerts(await alertRes.json());
        setRenewals(await renewRes.json());
      }
    } catch (err) {
      setError("Error fetching data. Ensure .NET Backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -- CSS Styles (Plain CSS - No Tailwind) --
  const styles = `
    :root { 
      --primary: #4f46e5; 
      --bg: #f8fafc; 
      --text: #0f172a; 
      --sidebar: #1e293b; 
      --sidebar-hover: #334155;
      --card: #ffffff; 
      --border: #e2e8f0; 
      --danger: #ef4444; 
      --warning: #f59e0b; 
      --success: #10b981; 
    }
    
    * { box-sizing: border-box; }
    
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); }
    
    .app-layout { display: flex; height: 100vh; overflow: hidden; }
    
    .sidebar { width: 260px; background: var(--sidebar); color: white; display: flex; flex-direction: column; padding: 1.5rem; flex-shrink: 0; }
    
    .content { flex: 1; padding: 2rem; overflow-y: auto; }
    
    .brand { font-size: 1.25rem; font-weight: bold; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem; }
    
    .nav-group { margin-bottom: 1.5rem; }
    .nav-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 0.5rem; font-weight: 600; }
    
    .nav-btn { 
      width: 100%; text-align: left; background: none; border: none; color: #cbd5e1; 
      padding: 0.75rem 1rem; cursor: pointer; border-radius: 6px; margin-bottom: 0.25rem; 
      transition: 0.2s; font-size: 0.95rem; 
    }
    .nav-btn:hover { background: var(--sidebar-hover); color: white; }
    .nav-btn.active { background: var(--primary); color: white; }
    
    .card { background: var(--card); border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid var(--border); margin-bottom: 1.5rem; }
    
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
    
    .stat-value { font-size: 2rem; font-weight: 700; margin-top: 0.5rem; }
    .stat-label { color: #64748b; font-size: 0.875rem; }
    
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th { text-align: left; padding: 1rem; background: #f8fafc; color: #64748b; font-weight: 600; border-bottom: 1px solid var(--border); }
    td { padding: 1rem; border-bottom: 1px solid var(--border); }
    
    .badge { padding: 0.25rem 0.6rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
    .badge.red { background: #fee2e2; color: #991b1b; }
    .badge.green { background: #d1fae5; color: #065f46; }
    .badge.yellow { background: #fef3c7; color: #92400e; }
    
    .btn { padding: 0.5rem 1rem; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; background: var(--primary); color: white; font-size: 0.9rem; }
    .btn:hover { opacity: 0.9; }
    .btn-outline { background: white; border: 1px solid var(--border); color: var(--text); }
    .btn-outline:hover { background: #f1f5f9; }
    
    .alert-row { border-left: 4px solid transparent; }
    .alert-row.High { border-left-color: var(--danger); background: #fef2f2; }
    .alert-row.Medium { border-left-color: var(--warning); }
    
    /* Form Styles */
    .form-grid { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; }
    input, select { padding: 0.5rem; border: 1px solid var(--border); border-radius: 6px; width: 100%; font-size: 0.9rem; }
    
    /* Animation */
    .animate-fade { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    /* Utility */
    .flex-between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .text-center { text-align: center; }
    .text-muted { color: #64748b; }
  `;

  // --- Components ---

  const Dashboard = () => {
    const totalCost = licenses.reduce((sum, item) => sum + item.cost, 0);
    const criticalIssues = complianceReport.filter(c => c.status === "Over-Licensed").length;

    return (
      <div className="animate-fade">
        <h2>Executive Overview</h2>
        <div className="grid-3">
          <div className="card">
            <div className="stat-label">Total Annual Spend</div>
            <div className="stat-value" style={{color: '#10b981'}}>${totalCost.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="stat-label">Compliance Risks</div>
            <div className="stat-value" style={{color: criticalIssues > 0 ? '#ef4444' : '#10b981'}}>
              {criticalIssues} <span style={{fontSize: '1rem', fontWeight: 'normal'}}>Critical</span>
            </div>
          </div>
          <div className="card">
            <div className="stat-label">Active Renewals</div>
            <div className="stat-value">{renewals.length}</div>
          </div>
        </div>
        
        <div className="card">
          <h3>Recent Compliance Alerts</h3>
          {alerts.length === 0 ? <p className="text-muted">No recent alerts.</p> : (
            <div style={{overflowX: 'auto'}}>
              <table>
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.slice(0, 5).map(a => (
                    <tr key={a.eventId} className={`alert-row ${a.severity}`}>
                      <td><span className={`badge ${a.severity === 'High' ? 'red' : 'yellow'}`}>{a.severity}</span></td>
                      <td>{a.eventType}</td>
                      <td>{a.details}</td>
                      <td>{new Date(a.detectedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ComplianceView = () => (
    <div className="animate-fade">
      <div className="flex-between">
        <h2>Compliance Report</h2>
        <button className="btn btn-outline" onClick={fetchData}>Refresh Report</button>
      </div>
      <div className="card" style={{padding: 0, overflow: 'hidden', overflowX: 'auto'}}>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Entitlements</th>
              <th>Used</th>
              <th>Gap</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complianceReport.map((row, idx) => (
              <tr key={idx}>
                <td><b>{row.productName}</b></td>
                <td>{row.licenseType}</td>
                <td>{row.totalEntitlements}</td>
                <td>{row.usedLicenses}</td>
                <td style={{fontWeight: 'bold', color: row.gap < 0 ? '#ef4444' : '#10b981'}}>
                  {row.gap > 0 ? `+${row.gap}` : row.gap}
                </td>
                <td>
                  <span className={`badge ${row.status === 'Over-Licensed' ? 'red' : row.status === 'Compliant' ? 'green' : 'yellow'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {complianceReport.length === 0 && <div style={{padding: '2rem'}} className="text-center text-muted">No data available. Add licenses and devices first.</div>}
      </div>
    </div>
  );

  const RenewalsView = () => {
    const [showForm, setShowForm] = useState(false);
    const [task, setTask] = useState({ licenseId: 1, status: 'Pending', assignedTo: '', dueDate: '', costEstimate: 0 });

    const handleSave = async (e) => {
      e.preventDefault();
      if (!DEMO_MODE) {
        await fetch(`${API_ROOT}/compliance/renewals`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(task)
        });
        fetchData();
      }
      setShowForm(false);
    };

    return (
      <div className="animate-fade">
         <div className="flex-between">
            <h2>Renewal Workflows</h2>
            <button className="btn" onClick={() => setShowForm(true)}>+ New Renewal Task</button>
         </div>

         {showForm && (
            <div className="card" style={{border: '2px solid var(--primary)'}}>
                <h3>Create Renewal Task</h3>
                <form onSubmit={handleSave} className="form-grid">
                    <input placeholder="License ID" type="number" required onChange={e => setTask({...task, licenseId: parseInt(e.target.value)})} />
                    <select onChange={e => setTask({...task, status: e.target.value})}>
                        <option>Pending</option>
                        <option>QuoteRequested</option>
                        <option>Approved</option>
                    </select>
                    <input placeholder="Assigned To (Email)" onChange={e => setTask({...task, assignedTo: e.target.value})} />
                    <input type="date" required onChange={e => setTask({...task, dueDate: e.target.value})} />
                    <input placeholder="Est. Cost" type="number" onChange={e => setTask({...task, costEstimate: parseFloat(e.target.value)})} />
                    <div style={{gridColumn:'1/-1', textAlign:'right'}}>
                        <button type="button" className="btn btn-outline" style={{marginRight:'1rem'}} onClick={()=>setShowForm(false)}>Cancel</button>
                        <button type="submit" className="btn">Save Task</button>
                    </div>
                </form>
            </div>
         )}

         <div className="card" style={{padding:0, overflow:'hidden', overflowX: 'auto'}}>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>License ID</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Due Date</th>
                        <th>Est. Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {renewals.map(r => (
                        <tr key={r.taskId}>
                            <td>#{r.taskId}</td>
                            <td>Lic-{r.licenseId}</td>
                            <td><span className="badge yellow">{r.status}</span></td>
                            <td>{r.assignedTo}</td>
                            <td>{new Date(r.dueDate).toLocaleDateString()}</td>
                            <td>${r.costEstimate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>
    );
  };

  const InventoryView = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ productName: '', vendor: '', licenseType: 'Per-User', cost: 0, totalEntitlements: 1 });

    const handleAdd = async (e) => {
        e.preventDefault();
        
        // Prepare payload with default expiry date of today
        const payload = { 
            ...formData, 
            expiryDate: new Date().toISOString() 
        };

        if (DEMO_MODE) {
            // For Demo Mode, we manually add a fake ID
            const demoItem = { ...payload, licenseId: Math.random() };
            setLicenses([...licenses, demoItem]);
        } else {
            // For Real API, DO NOT send licenseId. Let DB generate it.
            try {
                const res = await fetch(`${API_ROOT}/inventory/licenses`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                });
                
                if(!res.ok) {
                    const errorText = await res.text();
                    console.error("API Error:", errorText);
                    alert("Failed to save license. Check console.");
                    return; 
                }
                fetchData();
            } catch (err) {
                console.error(err);
                alert("Network error.");
                return;
            }
        }
        setIsFormOpen(false);
    };

    return (
        <div className="animate-fade">
            <div className="flex-between">
                <h2>Software Catalog</h2>
                <button className="btn" onClick={() => setIsFormOpen(true)}>+ Add License</button>
            </div>

            {isFormOpen && (
                <div className="card" style={{border: '2px solid var(--primary)'}}>
                    <h3>Add New License</h3>
                    <form onSubmit={handleAdd} className="form-grid">
                        <input placeholder="Product Name" required onChange={e => setFormData({...formData, productName: e.target.value})} />
                        <input placeholder="Vendor" required onChange={e => setFormData({...formData, vendor: e.target.value})} />
                        <select onChange={e => setFormData({...formData, licenseType: e.target.value})}>
                            <option>Per-User</option>
                            <option>Per-Device</option>
                            <option>Subscription</option>
                        </select>
                        <input type="number" placeholder="Entitlements" required onChange={e => setFormData({...formData, totalEntitlements: parseInt(e.target.value)})} />
                        <input type="number" placeholder="Cost" required onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})} />
                        <div style={{gridColumn:'1/-1', textAlign:'right'}}>
                            <button type="button" className="btn btn-outline" style={{marginRight:'1rem'}} onClick={()=>setIsFormOpen(false)}>Cancel</button>
                            <button type="submit" className="btn">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card" style={{padding:0, overflowX: 'auto'}}>
                <table>
                    <thead><tr><th>Product</th><th>Vendor</th><th>Type</th><th>Count</th><th>Cost</th></tr></thead>
                    <tbody>{licenses.map(l => <tr key={l.licenseId}><td>{l.productName}</td><td>{l.vendor}</td><td>{l.licenseType}</td><td>{l.totalEntitlements}</td><td>${l.cost}</td></tr>)}</tbody>
                </table>
            </div>
        </div>
    );
  };

  const DeviceView = () => (
    <div className="animate-fade">
        <h2>Device Discovery</h2>
        <div className="card" style={{padding:0, overflowX: 'auto'}}>
            <table>
                <thead><tr><th>Hostname</th><th>Type</th><th>OS</th><th>Installs</th></tr></thead>
                <tbody>{devices.map(d => <tr key={d.deviceId}><td>{d.hostname}</td><td>{d.deviceType}</td><td>{d.os}</td><td>{d.installations?.length || 0} Apps</td></tr>)}</tbody>
            </table>
        </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="brand">📦 LicManager</div>
          
          <div className="nav-group">
            <div className="nav-label">Overview</div>
            <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
          </div>

          <div className="nav-group">
            <div className="nav-label">Group 1: Inventory</div>
            <button className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>📂 Software Catalog</button>
            <button className={`nav-btn ${activeTab === 'devices' ? 'active' : ''}`} onClick={() => setActiveTab('devices')}>🖥️ Device Discovery</button>
          </div>

          <div className="nav-group">
            <div className="nav-label">Group 2: Compliance</div>
            <button className={`nav-btn ${activeTab === 'compliance' ? 'active' : ''}`} onClick={() => setActiveTab('compliance')}>🛡️ Compliance Report</button>
            <button className={`nav-btn ${activeTab === 'renewals' ? 'active' : ''}`} onClick={() => setActiveTab('renewals')}>🔄 Renewals & Tasks</button>
          </div>

          {DEMO_MODE && <div style={{marginTop:'auto', background:'#334155', padding:'.5rem', borderRadius:'6px', fontSize:'.8rem', color:'#fcd34d', textAlign:'center'}}>⚠️ Demo Mode</div>}
        </aside>

        <main className="content">
            {loading && <div style={{color:'var(--primary)', marginBottom:'1rem'}}>Loading System Data...</div>}
            {error && <div style={{background:'#fef2f2', color:'#b91c1c', padding:'1rem', borderRadius:'8px', marginBottom:'1rem', border:'1px solid #fecaca'}}>{error}</div>}

            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'inventory' && <InventoryView />}
            {activeTab === 'devices' && <DeviceView />}
            {activeTab === 'compliance' && <ComplianceView />}
            {activeTab === 'renewals' && <RenewalsView />}
        </main>
      </div>
    </>
  );
}