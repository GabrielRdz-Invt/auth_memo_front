import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TableFlows from "./TableFlows";

export default function ManageFlows () {
    const {plant} = useParams();
    const [departments, setDepartments] = useState([]);
    const [Flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const getDepartments = useCallback(() => {
        setLoading(true);
        setError("");

         fetch("http://localhost:5134/ApprovalFlow/GetDepartments?plant=" + plant)
        .then(res => res.json())
        .then(data => {
            console.log(data.data);
            setDepartments(data.data);
        })
        .catch((error) => {
            setDepartments([]);
            setError(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [plant]);

    useEffect(() => {
        const cleanup = getDepartments();
        return cleanup;
    }, [getDepartments]);

    return (
        <>
        <div className="container main-container">
            <div className="container">

                {/* page top */}
                <div className="row mb-5">
                    <div className="col-md-8">
                        <h3>Approval Flows</h3>
                    </div>
                    <div className="col-md-4">
                        <small>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb float-end">
                                <li className="breadcrumb-item">Authorization Memos</li>
                                <li className="breadcrumb-item active" aria-current="page">Approval Flows</li>
                            </ol>
                        </nav>
                        </small>
                    </div>
                </div>


                {/* page content starts here */}
                <div className="container">

                    <div className="card">
                        <div className="card-body">

                            <div className="d-flex align-items-start">
                                <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                    {departments.map((dept) => (
                                    <button className="nav-link" id={`dept-${dept.id_dept}-tab`} data-bs-toggle="pill" data-bs-target={`#dept-${dept.id_dept}`} type="button" role="tab" aria-controls={`dept-${dept.id_dept}`}>{dept.dept_name}</button>
                                    ))}
                                </div>

                                <div className="tab-content" id="v-pills-tabContent">
                                    {departments.map((dept) => (
                                    <div className="tab-pane fade" id={`dept-${dept.id_dept}`} role="tabpanel" aria-labelledby={`dept-${dept.id_dept}-tab`} tabIndex="0">
                                        <div className="table-responsive">
                                            <TableFlows deptId={dept.id_dept}/>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
                {/* page content ends here */}

            </div>
        </div>
        </>
    );
}