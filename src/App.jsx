import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import auth_memo_icon from './assets/auth_memo_icon.svg';
import './App.css';

// includes
import Navbar from './includes/Navbar.jsx';

// pages
import Index from './components/Index.jsx';
import AuthMemo from './components/AuthMemo.jsx';
import ViewMemo from './ViewMemo.jsx';
import Flows from './components/Flows.jsx';
import ManageFlows from './components/ManageFlows.jsx';
import Unauthorized from './components/Unauthorized.jsx';

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [userName, setUserName] = useState("");
  const [badge, setBadge] = useState("");
  const [role, setRole] = useState("");

  // hooks de navegacion
  const navigate = useNavigate();
  const location = useLocation();

  const onUnauthorizedPage = location.pathname === '/unauthorized'; // hook para detectar si estamos en la pagina de unauthorized
  const hideNavbar = onUnauthorizedPage; // ocultar navbar en la pagina de unauthorized

  function checkAuth() {
    return fetch("https://ime-oa.inventec.com:460/OABase/Login/Authorize?program=AuthMemoIMX", {
      method: "get",
      credentials: "include"
    })
    .then(res => {
      // console.log("response status:", res.status);
      if (res.status === 401 || res.status === 403)
      {
        // si no estamos en la pagina de unauthorized, redirigimos a ella
        if (!onUnauthorizedPage)
        {
          navigate('/unauthorized', { replace: true });
        }
        // y rechazamos la promesa para evitar procesar la respuesta como si fuera válida
        return Promise.reject(new Error('Unauthorized'));
      }
      
      if (!res.ok) { throw new Error("HTTP Status: " + res.status); }
      return res.json();

    })
    .then(data => {
      console.log("Auth check response:", data);
      setUserName(data.Data[0].Name);
      setBadge(data.Data[0].ID_USER);
      setRole(data.Data[0].ROLE);
      if (data && data.Success === false)
      {
        // si no estamos en la pagina de unauthorized, redirigimos a ella
        if (!onUnauthorizedPage)
        {
          navigate('/unauthorized', { replace: true });
        }
        return Promise.reject(new Error('Unauthorized'));
        
      }
      // si estamos autirizados pero estamos en la pagina de unauthorized, redirigimos al home
      if (data && data.Success === true && onUnauthorizedPage)
      {
        navigate('/', { replace: true });
      }
    })
    .catch(error => {
      setUserName("");
      console.error("Error during auth check:", error);
      if (!onUnauthorizedPage)
      {
        navigate('/unauthorized', { replace: true });
      }
      return Promise.reject(new Error('Unauthorized'));
    }).finally(() => {
      setAuthChecked(true);
    });
  }

  // al cargar la app, hacemos la verificacion de autenticacion
  // useEffect es el hook que se ejecuta al cargar el componente, equivalente a un onLoad()
  useEffect(() => {
    if (onUnauthorizedPage)
    {
      setAuthChecked(true);
    }
    checkAuth();
  }, []);

  // mientras no se ha verificado la autenticacion, mostramos un mensaje de carga (y evitamos mostrar el contenido de la app)
  if (!authChecked && !onUnauthorizedPage) {
    return (
      <div className="container main-container">
        <p>Checking authentication...</p>
      </div>);
  }

  return (
    <>
      {/* <Navbar /> */}
      {!hideNavbar && <Navbar userName={userName} role={role} />}
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/new-auth-memo" element={<AuthMemo badge={badge} />} />
        <Route path="/view-memo/:id_memo" element={<ViewMemo />} />
        <Route path="/flows" element={<Flows />} />
        <Route path="/manage-flows/:plant" element={<ManageFlows />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default App
