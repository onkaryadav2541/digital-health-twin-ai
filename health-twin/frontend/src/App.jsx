import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Activity, Moon, Footprints, MessageSquare, Info, Database, Menu, X, ChevronRight, User } from 'lucide-react';

// --- CONFIGURATION ---
// I have updated this to your live Render link
const API_URL = "https://digital-health-twin-ai.onrender.com";

const App = () => {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    
    // FETCH PATIENTS FROM RENDER
    axios.get(`${API_URL}/patients`)
      .then(res => {
        setPatients(res.data);
        if (res.data.length > 0) setSelected(res.data[0]);
      })
      .catch(err => console.error("API Error:", err));
      
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAsk = async () => {
    if (!query.trim() || !selected) return;
    setChat(prev => [...prev, { role: 'user', text: query }]);
    setLoading(true);
    try {
      // POST QUERY TO RENDER
      const res = await axios.post(`${API_URL}/ask`, {
        patient_id: selected.patient_id,
        query: query
      });
      setChat(prev => [...prev, { 
        role: 'ai', 
        text: res.data.answer,
        retrievedData: res.data.retrieved_data,
        reasoning: res.data.reasoning
      }]);
    } catch (err) {
      setChat(prev => [...prev, { role: 'ai', text: "Error: Engine Connection Offline. The backend may be 'sleeping' on the free tier. Please wait 60 seconds and try again." }]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const selectPatient = (p) => {
    setSelected(p);
    setChat([]);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 }} 
        />
      )}

      {/* SIDEBAR */}
      <aside style={{ 
        width: isSidebarOpen ? (isMobile ? '80%' : '300px') : '0px', 
        position: isMobile ? 'absolute' : 'relative',
        height: '100%',
        backgroundColor: '#0f172a', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        zIndex: 100,
        boxShadow: isMobile && isSidebarOpen ? '10px 0 30px rgba(0,0,0,0.5)' : 'none'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: isMobile ? '70vw' : '250px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity color="#38bdf8" size={24} />
            <span style={{ fontWeight: '800', fontSize: '18px' }}>TwinCore AI</span>
          </div>
          {isMobile && <X onClick={() => setSidebarOpen(false)} style={{ cursor: 'pointer' }} />}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', minWidth: isMobile ? '70vw' : '250px' }}>
          <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px', paddingLeft: '10px' }}>Patients List</p>
          {patients.map(p => (
            <div key={p.patient_id} onClick={() => selectPatient(p)} style={{
              padding: '14px 16px', marginBottom: '10px', cursor: 'pointer', borderRadius: '12px',
              backgroundColor: selected?.patient_id === p.patient_id ? '#3b82f6' : 'transparent',
              color: selected?.patient_id === p.patient_id ? 'white' : '#94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: '0.2s'
            }}>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{p.name}</span>
              <ChevronRight size={14} opacity={selected?.patient_id === p.patient_id ? 1 : 0.3} />
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
        
        <header style={{ 
          minHeight: '64px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', 
          display: 'flex', alignItems: 'center', padding: '10px 20px', justifyContent: 'space-between', zIndex: 50,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
              {isSidebarOpen && !isMobile ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#64748b" />
              <h2 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>{selected?.name}</h2>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '6px', 
            flexWrap: 'wrap', 
            justifyContent: 'flex-end',
            marginTop: isMobile ? '5px' : '0' 
          }}>
            {selected?.alerts.map((a, i) => (
              <span key={i} style={{ 
                backgroundColor: '#fee2e2', 
                color: '#b91c1c', 
                padding: '4px 10px', 
                borderRadius: '6px', 
                fontSize: '10px', 
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}>
                {a}
              </span>
            ))}
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '32px' }}>
          <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
              gap: '16px', 
              marginBottom: '24px' 
            }}>
              <StatCard icon={<Heart color="#ef4444" size={20}/>} label="Heart" value={selected?.heart_rate} unit="bpm" />
              <StatCard icon={<Activity color="#3b82f6" size={20}/>} label="BP" value={selected?.blood_pressure} unit="sys/dia" />
              <StatCard icon={<Moon color="#8b5cf6" size={20}/>} label="Sleep" value={selected?.sleep_hours} unit="hrs" />
              <StatCard icon={<Footprints color="#10b981" size={20}/>} label="Steps" value={selected?.daily_steps.toLocaleString()} unit="steps" />
            </div>

            <div style={{ 
              backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', 
              display: 'flex', flexDirection: 'column', height: isMobile ? '450px' : '600px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={18} color="#3b82f6" />
                <span style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '14px' }}>AI Medical Assistant</span>
              </div>

              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fcfcfd' }}>
                {chat.map((m, i) => (
                  <div key={i} style={{ marginBottom: '24px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                    <div style={{ 
                      display: 'inline-block', padding: '12px 16px', borderRadius: '15px', maxWidth: '85%',
                      backgroundColor: m.role === 'user' ? '#3b82f6' : 'white',
                      color: m.role === 'user' ? 'white' : '#1e293b',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                      textAlign: 'left'
                    }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '13px', lineHeight: '1.5' }}>{m.text}</pre>
                    </div>
                    {m.role === 'ai' && m.reasoning && (
                      <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7', fontSize: '11px' }}>
                        <div style={{ fontWeight: 'bold', color: '#166534', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                          <Database size={14} /> VECTOR DATA
                        </div>
                        <div style={{ color: '#15803d', fontStyle: 'italic', marginBottom: '8px' }}>{m.retrievedData}</div>
                        <div style={{ color: '#166534' }}><strong>Reasoning:</strong> {m.reasoning}</div>
                      </div>
                    )}
                  </div>
                ))}
                {loading && <div style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}>Analyzing Knowledge Base...</div>}
              </div>

              <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                <input 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder="Ask a question..." 
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} 
                />
                <button onClick={handleAsk} style={{ padding: '0 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Analyze</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, unit }) => (
  <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>{icon}</div>
    <div style={{ overflow: 'hidden' }}>
      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', whiteSpace: 'nowrap' }}>{value} <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#94a3b8' }}>{unit}</span></div>
    </div>
  </div>
);

export default App;