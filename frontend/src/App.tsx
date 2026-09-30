import { BrowserRouter, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PathDetails from './pages/PathDetails';
import LearningPaths from './pages/LearningPaths';
import AiRoadmap from './pages/AiRoadmap';
import ChapterLibrary from './pages/ChapterLibrary';
import Activity from './pages/Activity';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Brand from './components/layout/Brand';
import { ThemeToggle } from './components/layout/AppHeader';
import Notification from './components/ui/Notification';

function PublicLayout() {
  return <><header className="public-header"><Brand /><nav className="row" aria-label="Public navigation"><ThemeToggle /><Link to="/login" className="btn-secondary">Sign in</Link></nav></header><main className="public-main"><Outlet /></main><footer className="public-footer">© {new Date().getFullYear()} SkillFlow · Your learning, at your pace.</footer></>;
}

export default function App() {
  return <BrowserRouter><Notification /><Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/paths" element={<LearningPaths />} />
      <Route path="/path/:id" element={<PathDetails />} />
      <Route path="/ai-roadmap" element={<AiRoadmap />} />
      <Route path="/assessments" element={<ChapterLibrary section="assessment" />} />
      <Route path="/challenges" element={<ChapterLibrary section="challenge" />} />
      <Route path="/resources" element={<ChapterLibrary section="resources" />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}
