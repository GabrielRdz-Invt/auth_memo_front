import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';

// includes
import Navbar from './includes/Navbar.jsx';

// pages
import Index from './components/Index.jsx';
import AuthMemo from './components/AuthMemo.jsx';
import ViewMemo from './ViewMemo.jsx';
import Flows from './components/Flows.jsx';
import ManageFlows from './components/ManageFlows.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/new-auth-memo" element={<AuthMemo />} />
        <Route path="/view-memo/:id_memo" element={<ViewMemo />} />
        <Route path="/flows" element={<Flows />} />
        <Route path="/manage-flows/:plant" element={<ManageFlows />} />
      </Routes>
    </>
  );
}

export default App
