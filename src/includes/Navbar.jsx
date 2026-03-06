import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/img/logo.png';

export default function Navbar({userName, role}) {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary py-3">
        <div className="container">
            <a className="navbar-brand" href="#">
                <img src={logo} alt="Logo" height="30" className="d-inline-block align-text-top me-2"/>
                {/* Shipping App */}
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item me-3">
                        <Link className="nav-link active" aria-current="page" to="/"><i className="bi bi-file-text" /> View Memos</Link>
                    </li>
                    <li className="nav-item me-3">
                        <Link className="nav-link" to="/new-auth-memo"><i className="bi bi-folder-plus" /> Add Auth Memo</Link>
                    </li>
                    {role.includes("A") && (
                        <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/flows"><i className="bi bi-ui-radios" /> Flows</Link>
                        </li>
                        </>
                    )}
                    
                    <li className="nav-item d-flex">
                        <div className="vr mx-3"></div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link"><i className="bi bi-person-circle" /> Hi {userName}!</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
}