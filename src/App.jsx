import { useAuth } from './context/AuthContext'
import DietPlanBrain from './DietPlanBrain'
import Login from './components/Login'
import './index.css'
import './App.css'

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d", fontFamily: "system-ui" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "5px solid #222", borderTop: "5px solid #E53935", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ color: "#555", fontSize: 14 }}>Loading Step2 Portal...</div>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) return <div className="page-transition"><Login /></div>;

  // Authenticated — show main app
  return <div className="page-transition"><DietPlanBrain /></div>;
}

export default App
