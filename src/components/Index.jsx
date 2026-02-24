import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Index() {
    const [memos, setMemos] = useState([]); // lista para guardar registros
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function loadMemos(){
        setLoading(true);
        setError("");

        fetch("http://localhost:5134/AuthMemos/GetAuthMemos", {
            method: "get",
            headers: { "Content-Type" : "application/json" }
        })
        .then((res) => {
            if (!res.ok)
                throw new Error("HTTP Status: " + res.status);
            return res.json();
        })
        .then((data) => {
            if (data.success && Array.isArray(data.data)){
                setMemos(data.data);
            }
            else {
                setMemos([]);
                setError(data.message);
            }
        })
        .catch((error) => {
            setMemos([]);
            setError(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    // esto es lo equivalente a un onLoad()
    useEffect(() => {
        loadMemos();
    }, []);

    return (
        <div className="container main-container">
            <div className="container">

                {/* page top */}
                <div className="row mb-4">
                    <div className="col-md-8">
                        <h3>Welcome to the Auth Memo App</h3>
                    </div>
                    <div className="col-md-4">
                        <small>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb float-end">
                                    <li className="breadcrumb-item active" aria-current="page">Authorization Memos</li>
                                </ol>
                            </nav>
                        </small>
                    </div>
                </div>
                <Link className="btn btn-dark btn-sm mb-3" to="/new-auth-memo">
                    <i className="bi bi-plus-circle" /> Create New Authorization Memo
                </Link>

                {/* loading and error message */}
                {loading && <div className="alert alert-info">Loading...</div>}
                {error && !loading && <div className="alert alert-warning">{error}</div>}

                {/* start of page content */}
                <div className="table-responsive">
                    <table className="table table-bordered table-striped" style={{fontSize:"90%"}}>
                        <thead>
                            <tr>
                                <th>Folio</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {/* si no hay auth memos */}
                        {!loading && memos.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center text-muted">
                                    No memos to show
                                </td>
                            </tr>
                        )}
                        
                        {memos.map((m) => (
                            <tr key={m.id_memo}>
                                <td>{m.folio_memo}</td>
                                <td>{m._contract_name}</td>
                                <td>
                                    {m.status === 1 ?  <span className="badge rounded-pill text-bg-success">Open</span> 
                                    : m.status === 2 ? <span className="badge rounded-pill text-bg-warning">In progress</span> 
                                    : <span className="badge rounded-pill text-bg-danger">Cancelled</span>}
                                </td>
                                <td>
                                    <Link to={`/view-memo/${m.id_memo}`} className="btn btn-light btn-sm me-2">View Memo</Link>
                                    {/* <button className="btn btn-danger btn-sm">Delete</button> */}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            {/* end of page content */}
            </div>
        </div>
    );
}