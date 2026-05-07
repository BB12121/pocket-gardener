import { BrowserRouter, Routes, Route, useLocation, NavLink } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import PlantDetail from './pages/PlantDetail';
import AddLog from './pages/AddLog';
import Tasks from './pages/Tasks';
import AiSuggestions from './pages/AiSuggestions';
import Community from './pages/Community';
import NewPost from './pages/NewPost';
import UserProfile from './pages/UserProfile';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import AddPlant from './pages/AddPlant';

const TAB_ROUTES = ['/', '/tasks', '/community', '/profile'];

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionClass, setTransitionClass] = useState('');
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      const wasTab = TAB_ROUTES.includes(prevPath.current);
      const isTab = TAB_ROUTES.includes(location.pathname);

      if (wasTab && isTab) {
        setDisplayLocation(location);
        prevPath.current = location.pathname;
        return;
      }

      if (!wasTab && isTab) {
        setTransitionClass('slide-out');
      } else {
        setDisplayLocation(location);
        setTransitionClass('slide-in');
      }

      prevPath.current = location.pathname;
    }
  }, [location]);

  const handleAnimationEnd = () => {
    if (transitionClass === 'slide-out') {
      setDisplayLocation(location);
    }
    setTransitionClass('');
  };

  const isTabRoute = TAB_ROUTES.includes(location.pathname);

  return (
    <>
      <div className={`page-wrap ${transitionClass}`} onAnimationEnd={handleAnimationEnd}>
        <Routes location={displayLocation}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="community" element={<Community />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/plant/:id/log" element={<AddLog />} />
          <Route path="/ai/:id" element={<AiSuggestions />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/add-plant" element={<AddPlant />} />
          <Route path="/community/new-post" element={<NewPost />} />
          <Route path="/community/user/:id" element={<UserProfile />} />
        </Routes>
      </div>
      {isTabRoute && <FixedTabBar />}
    </>
  );
}

function FixedTabBar() {
  return (
    <nav className="tab-bar">
      <NavLink to="/" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`} end>
        <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        </svg>
        <span>首页</span>
      </NavLink>
      <NavLink to="/tasks" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}>
        <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="16" rx="2"/>
          <path d="M8 9h8M8 13h5"/>
        </svg>
        <span>任务</span>
      </NavLink>
      <NavLink to="/community" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}>
        <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/>
        </svg>
        <span>社区</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}>
        <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 4-7 8-7s8 3 8 7"/>
        </svg>
        <span>我的</span>
      </NavLink>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
