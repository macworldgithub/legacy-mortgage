import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import AnalyticsPage from "./pages/AnalyticsPage";
// import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./protectedRoute";
import ChatWidget from "../pages/ChatScreen";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/" element={<ChatWidget/>} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <SidebarLayout>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/inventory"
                    element={<InventoryScreen />}
                  />
                  {/* <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} /> */}
                </Routes>
              </SidebarLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
