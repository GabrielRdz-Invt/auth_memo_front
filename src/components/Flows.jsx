import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

const init_data = {
    search_key : '',
};

export default function Flows() {
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("");
    const [selectedFlow, setSelectedFlow] = useState(null);

    function getFlows(filter){
        
        setLoading(true);
        setError("");

        let url = "";
        if (filter != null) {
            // url = "http://localhost:5134/ApprovalFlow/GetApprovalFlow?filter=" + filter;
            url = "https://ime-oa.inventec.com:460/AuthMemo/ApprovalFlow/GetApprovalFlow?filter=" + filter;
        }
        else {
            // url = "http://localhost:5134/ApprovalFlow/GetApprovalFlow";
            url = "https://ime-oa.inventec.com:460/AuthMemo/ApprovalFlow/GetApprovalFlow";
        }
        fetch(url, {
            method: "get",
            headers: {"Content-Type" : "application/json"},
            credentials: "include",
        })
        .then((res) => {
            if (!res.ok)
                throw new Error("HTTP Status: " + res.status);
            return res.json();
        })
        .then((data) => {
            if (data.success && Array.isArray(data.data)){
                // console.log(data.data); // debug porpuses
                setFlows(data.data);
            }
            else {
                setFlows([]);
                setError(data.message);
            }
        })
        .catch(error => {
            setFlows([]);
            setError(error.message);
            console.log("Error: " + error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    // esto es lo equivalente a un onLoad() -- carga inicial    
    useEffect(() => {
        getFlows();
    }, []);

    // useEffect para busqueda en tiempo real
    useEffect(() => {
        getFlows(filter);
    }, [filter]);

    return(
        <>
        <div className="container main-container">
            <div className="container">

                {/* page top */}
                <div className="row mb-5">
                    <div className="col-md-8">
                        <h3>Manage Flows</h3>
                    </div>
                    <div className="col-md-4">
                        <small>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb float-end">
                                    <li className="breadcrumb-item active" aria-current="page">Flows</li>
                                </ol>
                            </nav>
                        </small>
                    </div>
                </div>

                {/* page content starts here */}
                <div className="container table-responsive mt-4" style={{fontSize:"87%"}}>
                    <div className="row mb-2">
                        {/* <div className="col-md-6">
                            <button className="btn btn-dark btn-sm" data-bs-toggle="modal" data-bs-target="#modal-add-flow">
                                <i className="bi bi-plus-circle" /> Add Flow
                            </button>
                        </div> */}
                        <div className="col-md-12 mb-3">
                            <input className="form-control form-control-sm" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search Flow Info" />
                        </div>
                    </div>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Plant/Department</th>
                                <th>Approver</th>
                                <th>Approver Employee ID</th>
                                {/* <th>View</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {flows.map((flow) => (
                            <tr key={flow.iD_FLOW}>
                                <td>{flow.filter}</td>
                                <td>{flow.stepName}</td>
                                <td>{flow.director}</td>
                                {/* <td>
                                    <button className="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#modal-edit-flow" onClick={() => setSelectedFlow(flow)}>
                                        Edit
                                    </button>
                                </td> */}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* page content ends here */}

                {/* modal add */}
                <div className="modal fade" id="modal-add-flow" tabIndex="-1" aria-labelledby="modal-add-flow" aria-hidden="true">
                    <form >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Create New Flow</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row container">
                                        <div className="col-md-3">
                                            <label className="form-label">Plant: <strong className="text-danger">*</strong></label>
                                            <select name="plant" id="plant" className="form-control">
                                                <option value="">-- Select Plant --</option>
                                                <option value="IME">IME</option>
                                                <option value="IMP">IMP</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Department: <strong className="text-danger">*</strong></label>
                                            <select name="department" id="department" className="form-control">
                                                <option value="">-- Select Department --</option>
                                                <option value="MRO">MRO</option>
                                                <option value="SECURITY">Security</option>
                                                <option value="IT">IT</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Approver Role:</label>
                                            <input className="form-control" name="approval" placeholder="Approval" />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Order:</label>
                                            <input type="number" className="form-control" name="order_level" placeholder="Order Level" min={0} />
                                        </div>
                                        {/* ------------------------- */}
                                        
                                        <hr className="mt-4" />
                                        <div className="col-md-6">
                                            <button className="btn btn-dark mt-2">
                                                <i className="bi bi-node-plus" /> Create
                                            </button>
                                        </div>
                                        <div className="col-md-6">
                                            <small className="text-muted"></small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                {/* modal add ./ */}

                

                {/* modal edit */}
                <div className="modal fade" id="modal-edit-flow" tabIndex="-1" aria-labelledby="modal-edit-flow" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Edit Flow</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {selectedFlow && (
                                <div className="row container">
                                    <div className="col-md-4">
                                        <label className="form-label">Plant/Department:</label>
                                        <input className="form-control" name="approval" placeholder="Approval"  value={selectedFlow.filter} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Approver Role:</label>
                                        <input className="form-control" name="approval" placeholder="Approval"  value={selectedFlow.stepName} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Order:</label>
                                        <input type="number" className="form-control" name="order_level" placeholder="Order Level" min={0} value={selectedFlow.flow} />
                                    </div>
                                    {/* ------------------------- */}
                                    <hr className="mt-4" />
                                    <div className="col-md-6">
                                        <button className="btn btn-dark mt-2">
                                            <i className="bi bi-node-plus" /> Update Flow
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted"></small>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}