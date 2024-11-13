import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NavBar } from './components/NavBar';
import { LandingPage } from './pages/LandingPage';
import { StoryCapture } from './pages/StoryCapture';
import { Assessment } from './pages/Assessment';
import Processing from './pages/Processing';
import { Results } from './pages/Results';
import { Profile } from './pages/Profile';
import { History } from './pages/History';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen gradient-bg">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/story" element={<StoryCapture />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
