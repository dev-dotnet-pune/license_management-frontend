import React, { useState, useEffect } from 'react';

/**
 * CONFIGURATION
 * Set DEMO_MODE to false to connect to your local .NET API.
 */
const DEMO_MODE = false; 
const API_BASE_URL = "https://localhost:7132/api/inventory";

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [licenses, setLicenses] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- MOCK DATA FOR DEMO ---
  // const MOCK_LICENSES = [
  //   { licenseId: 1, productName: "Visual Studio Enterprise", vendor: "Microsoft", licenseType: "Per-User", totalEntitlements: 50, cost: 2500.00, expiryDate: "2025-11-01" },
  //   { licenseId: 2, productName: "Adobe Creative Cloud", vendor: "Adobe", licenseType: "Subscription", totalEntitlements: 20, cost: 600.00, expiryDate: "2024-12-15" },
  //   { licenseId: 3, productName: "Jira Data Center", vendor: "Atlassian", licenseType: "Concurrent", totalEntitlements: 100, cost: 15000.00, expiryDate: "2025-05-20" },
  // ];

  // const MOCK_DEVICES = [
  //   // { deviceId: 1, hostname: "LPT-FIN-001", ownerUserId: "jane.doe@corp.com", deviceType: "Laptop", os: "Windows 11", installations: [{ productName: "Office 365" }] },
  //   { deviceId: 2, hostname: "SRV-DB-PROD", ownerUserId: "admin", deviceType: "Server", os: "Ubuntu 22.04", installations: [] },
  //   { deviceId: 3, hostname: "LPT-DEV-099", ownerUserId: "john.smith@corp.com", deviceType: "Laptop", os: "MacOS Ventura", installations: [{ productName: "Visual Studio Enterprise" }, { productName: "Adobe Creative Cloud" }] },
  // ];

  // -- Fetch Data --
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setLicenses(MOCK_LICENSES);
        setDevices(MOCK_DEVICES);
      } else {
        const licRes = await fetch(`${API_BASE_URL}/licenses`);
        const devRes = await fetch(`${API_BASE_URL}/devices`);
        if (!licRes.ok || !devRes.ok) throw new Error("Failed to connect to API");
        setLicenses(await licRes.json());
        setDevices(await devRes.json());
      }
    } catch (err) {
      setError("Error fetching data. Ensure Backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -- CSS Styles (Embedded) --
  const styles = `
    /* --- Global Reset & Fonts --- */
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --bg-color: #f8fafc;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --sidebar-bg: #1e293b;
      --sidebar-hover: #334155;
      --card-bg: #ffffff;
      --border-color: #e2e8f0;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
    }

    /* --- Layout --- */
    .app-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 250px;
      background-color: var(--sidebar-bg);
      color: white;
      display: flex;
      flex-direction: column;
      padding: 1rem;
      flex-shrink: 0;
    }

    .content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    /* --- Sidebar --- */
    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      font-size: 1.2rem;
    }

    .sidebar nav button {
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      color: #94a3b8;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      transition: all 0.2s;
    }

    .sidebar nav button:hover {
      background-color: var(--sidebar-hover);
      color: white;
    }

    .sidebar nav button.active {
      background-color: var(--primary);
      color: white;
    }

    .demo-badge {
      margin-top: auto;
      background: #334155;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      text-align: center;
      color: #fbbf24;
      font-weight: bold;
    }

    /* --- Components --- */
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid var(--border-color);
      margin-bottom: 1.5rem;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn.primary {
      background-color: var(--primary);
      color: white;
    }
    .btn.primary:hover { background-color: var(--primary-hover); }

    .btn.secondary {
      background-color: white;
      border: 1px solid var(--border-color);
      color: var(--text-muted);
    }
    .btn.secondary:hover { background-color: #f1f5f9; }

    /* --- Dashboard --- */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 1.5rem;
    }

    .stat-card.blue .stat-icon { background: #eff6ff; }
    .stat-card.indigo .stat-icon { background: #eef2ff; }
    .stat-card.green .stat-icon { background: #f0fdf4; }

    .stat-info { display: flex; flex-direction: column; }
    .stat-label { font-size: 0.875rem; color: var(--text-muted); }
    .stat-value { font-size: 1.5rem; font-weight: bold; }

    .dashboard-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 768px) {
      .dashboard-row { grid-template-columns: 1fr; }
    }

    /* --- Tables --- */
    .table-card { padding: 0; overflow: hidden; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
    th { background-color: #f8fafc; font-weight: 600; color: var(--text-muted); }
    tr:last-child td { border-bottom: none; }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
    }
    .badge.plain { background: #f1f5f9; color: var(--text-muted); }
    .badge.count { background: var(--primary); color: white; border-radius: 12px; padding: 0.1rem 0.6rem; }

    /* --- Device List --- */
    .device-list { list-style: none; padding: 0; margin: 0; }
    .device-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-bottom: 1px solid var(--border-color);
    }
    .device-item:last-child { border-bottom: none; }
    .device-details { flex: 1; display: flex; flex-direction: column; }

    /* --- Alerts --- */
    .alert {
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .alert.warning { background: #fffbeb; border: 1px solid #fcd34d; color: #92400e; }
    .alert.success { background: #f0fdf4; border: 1px solid #86efac; color: #166534; }

    /* --- Modal --- */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal { width: 400px; background: white; padding: 1.5rem; border-radius: 12px; }
    .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group input, .form-group select {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }

    /* --- Animations --- */
    .animate-fade { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  `;

  // -- Views --

  const Dashboard = () => {
    const totalCost = licenses.reduce((sum, item) => sum + item.cost, 0);
    const expiringSoon = licenses.some(l => new Date(l.expiryDate) < new Date('2025-06-01'));

    return (
      <div className="view-container animate-fade">
        <h2>Dashboard Overview</h2>
        <div className="stats-grid">
          <div className="card stat-card blue">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-label">Total Licenses</span>
              <span className="stat-value">{licenses.length}</span>
            </div>
          </div>
          <div className="card stat-card indigo">
            <div className="stat-icon">🖥️</div>
            <div className="stat-info">
              <span className="stat-label">Managed Devices</span>
              <span className="stat-value">{devices.length}</span>
            </div>
          </div>
          <div className="card stat-card green">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <span className="stat-label">Annual Spend</span>
              <span className="stat-value">${totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="card">
            <h3>Recent Devices</h3>
            <ul className="device-list">
              {devices.slice(0, 3).map(dev => (
                <li key={dev.deviceId} className="device-item">
                  <span className="device-icon">💻</span>
                  <div className="device-details">
                    <strong>{dev.hostname}</strong>
                    <small>{dev.os}</small>
                  </div>
                  <span className="badge">{dev.deviceType}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Inventory Health</h3>
            {expiringSoon ? (
              <div className="alert warning">
                <span className="alert-icon">⚠️</span>
                <div>
                  <strong>Licenses Expiring Soon</strong>
                  <p>Some licenses need attention within the next 90 days.</p>
                </div>
              </div>
            ) : (
              <div className="alert success">
                <span className="alert-icon">✅</span>
                <p>All licenses are healthy.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const LicenseInventory = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ productName: '', vendor: '', type: 'Per-User', cost: 0, count: 1 });

    const handleAdd = async (e) => {
      e.preventDefault();
      const newItem = { 
        ...formData, 
        licenseId: Math.random(), 
        expiryDate: new Date().toISOString(),
        totalEntitlements: formData.count 
      };
      
      if (DEMO_MODE) {
        setLicenses([...licenses, newItem]);
      } else {
        await fetch(`${API_BASE_URL}/licenses`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newItem)
        });
        fetchData();
      }
      setIsFormOpen(false);
    };

    return (
      <div className="view-container animate-fade">
        <div className="header-row">
          <h2>Software Catalog</h2>
          <button className="btn primary" onClick={() => setIsFormOpen(true)}>+ Add License</button>
        </div>

        {isFormOpen && (
          <div className="modal-backdrop">
            <div className="modal card">
              <h3>Add New License</h3>
              <form onSubmit={handleAdd}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input required onChange={e=>setFormData({...formData, productName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Vendor</label>
                  <input required onChange={e=>setFormData({...formData, vendor: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select onChange={e=>setFormData({...formData, type: e.target.value})}>
                      <option>Per-User</option>
                      <option>Per-Device</option>
                      <option>Subscription</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cost</label>
                    <input type="number" required onChange={e=>setFormData({...formData, cost: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
                  <button type="submit" className="btn primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card table-card">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Vendor</th>
                <th>Type</th>
                <th>Entitlements</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((lic) => (
                <tr key={lic.licenseId}>
                  <td>{lic.productName}</td>
                  <td>{lic.vendor}</td>
                  <td><span className="badge plain">{lic.licenseType}</span></td>
                  <td>{lic.totalEntitlements}</td>
                  <td>${lic.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const DeviceManager = () => {
    return (
      <div className="view-container animate-fade">
        <div className="header-row">
          <h2>Device Discovery</h2>
          <div className="actions">
            <button className="btn secondary">Scan Network</button>
            <button className="btn primary">Manual Add</button>
          </div>
        </div>

        <div className="card table-card">
          <table>
            <thead>
              <tr>
                <th>Hostname</th>
                <th>Type</th>
                <th>OS</th>
                <th>Owner</th>
                <th>Apps Installed</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((dev) => (
                <tr key={dev.deviceId}>
                  <td><b>{dev.hostname}</b></td>
                  <td>{dev.deviceType}</td>
                  <td>{dev.os}</td>
                  <td>{dev.ownerUserId}</td>
                  <td>
                    <span className="badge count">
                      {dev.installations ? dev.installations.length : 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --- Main Layout ---
  return (
    <>
      <style>{styles}</style>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-icon">📦</span>
            <h1>LicManager</h1>
          </div>
          <nav>
            <button 
              className={activeTab === 'dashboard' ? 'active' : ''} 
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={activeTab === 'inventory' ? 'active' : ''} 
              onClick={() => setActiveTab('inventory')}
            >
              📂 Software Catalog
            </button>
            <button 
              className={activeTab === 'devices' ? 'active' : ''} 
              onClick={() => setActiveTab('devices')}
            >
              🖥️ Device Discovery
            </button>
          </nav>
          {DEMO_MODE && <div className="demo-badge">⚠️ DEMO MODE</div>}
        </aside>

        <main className="content">
          {loading && <div className="loading">Loading data...</div>}
          {error && <div className="error-banner">{error}</div>}

          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'inventory' && <LicenseInventory />}
          {activeTab === 'devices' && <DeviceManager />}
        </main>
      </div>
    </>
  );
}