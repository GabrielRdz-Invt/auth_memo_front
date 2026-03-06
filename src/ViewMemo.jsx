import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import './assets/css/print.css';

export default function ViewMemo() {
    const {id_memo} = useParams();
    const [memo, setMemo] = useState(null);

    const current = memo && memo.length > 0 ? memo[0] : null;
    const status = current?.status;
    const folio = current?.folio_memo;
    const isCancelled = status === 3;

    function cancelMemo()
    {
        // confirm action
        Swal.fire({
            title: "Confirm action",
            text: "If you cancel this memo, you won't be able to reverse",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#316697",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel"
        }).then((result) =>{
            if (result.isConfirmed)
            {
                fetch("https://ime-oa.inventec.com:460/AuthMemo/AuthMemos/CancelMemo", {
                    method: "put",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({ id_memo: id_memo }),
                    credentials: "include",
                })
                .then(res => res.json())
                .then(data => {
                    Swal.fire({icon: "success", title: "Success", text: "Auth Memo Cancelled"});
                    setMemo(prev => {
                        const updatedMemo = [...prev];
                        updatedMemo[0].status = 3;
                        return updatedMemo;
                    });
                })
                .catch(error => {
                    Swal.fire({icon: "error", title: "Error", text: "Error: "  + error});
                });
            }
        })
    }

    function downloadContract(){
        const fileName = memo?.[0]?._contract_path?.split("/").pop();
        if (!fileName){
            Swal.fire({
                icon: "info",
                title: "No file",
                text: "There is no contract file attached to this memo.",
            });
        }
        const url = "https://ime-oa.inventec.com:460/AuthMemo/AuthMemos/DownloadContract?fileName=" +fileName;
        window.open(url, "_blank");
    }

    // esto es lo equivalente a un onLoad()
    useEffect(() => {
        fetch("https://ime-oa.inventec.com:460/AuthMemo/AuthMemos/GetAuthMemoById?id_memo=" + id_memo, {credentials: "include", headers: {"Content-Type" : "application/json"}})
        .then(res => res.json())
        .then(data => {
            // console.log(data.data)
            setMemo(data.data);
        });
    }, [id_memo]);

    return(
        <div className="container main-container">
            <div className="container">

                {/* page top */}
                <div className="row mb-4">
                    <div className="col-md-8">
                        <h3>{isCancelled ? <span className="text-danger">Cancelled: {folio}</span> : "View Memo: " + folio}</h3>
                    </div>
                    <div className="col-md-4">
                        <small>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb float-end">
                                <li className="breadcrumb-item">Authorization Memos</li>
                                <li className="breadcrumb-item active" aria-current="page">View Memo</li>
                            </ol>
                            </nav>
                        </small>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-10">
                        <button className="btn btn-dark btn-sm mb-4" onClick={() => window.print()} disabled={isCancelled}><i className="bi bi-file-earmark-pdf" /> Export memo to PDF</button>
                        {/* <button className="btn btn-dark btn-sm mb-4 mx-1" onClick={cancelMemo} disabled={isCancelled}><i className="bi bi-file-x" /> Cancel Memo</button> */}
                    </div>
                    <div className="col-md-2">
                        {memo && (<><button className="btn btn-dark btn-sm mb-3" onClick={downloadContract} disabled={isCancelled}>
                            <i className="bi bi-download" /> Download Contract File
                        </button></>)}
                    </div>
                </div>


                {/* page content starts here */}
                <div id="print_area">
                    <div className="card">
                        {!memo && <p>Loading...</p>}

                        {memo && (
                            <>
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <small className="text-muted">
                                            Contract Content: {memo[0]._contract_path.split('/').pop()}
                                        </small>
                                    </div>
                                    <div className="col-sm-6">
                                        <small className="text-muted">
                                            Folio: {memo[0].folio_memo}
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row mb-4">
                                    <div className="col-sm-6"><strong>Contract Name:</strong> {memo[0]._contract_name} </div>
                                    <div className="col-sm-6"><strong>Authorization Level:</strong> {memo[0].auth_level}</div>

                                    <div className="col-sm-6"><strong>Plant: </strong> {memo[0].plant}</div>
                                    <div className="col-sm-6"><strong>Contact Genre: </strong> {memo[0]._contract_genre}</div>
                                </div>
                                <ul className="list-group list-group-flush" style={{ fontSize: "90%" }}>
                                    <li className="list-group-item"><strong>1. Counter Party:</strong> {memo[0].counter_pary}</li>
                                    <li className="list-group-item"><strong>2. Subject:</strong>  {memo[0].auth_subject}</li>
                                    <li className="list-group-item"><strong>3. Price Amount:</strong> ${Number(memo[0].price_amount).toFixed(2)}</li>
                                    <li className="list-group-item"><strong>4. Payment Terms:</strong> {memo[0].payment_terms}</li>
                                    <li className="list-group-item"><strong>5. Delivery Method:</strong> {memo[0].delivery_method}</li>
                                    <li className="list-group-item"><strong>6. IP Belongs To:</strong> {memo[0].ip_belongs_to}</li>
                                    <li className="list-group-item"><strong>7. Contract Terms:</strong> {memo[0]._contract_terms}</li>
                                    <li className="list-group-item"><strong>8. Warranty:</strong> {memo[0].warranty}</li>
                                    <li className="list-group-item"><strong>9. Penalty:</strong> {memo[0].penalty}</li>
                                    <li className="list-group-item"><strong>10. Others:</strong> {memo[0].others}</li>
                                </ul>
                            </div>
                            </>
                        )}
                        
                    </div>

                    {/* <div className="table responsive mt-5 card">

                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Approval</th>
                                        <th>Signed</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>Chief Executive Officer</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Person 2</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Person 3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Person 4</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Finnance Superintendent</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>

                    </div> */}
                </div>
                {/* page content ends in here */}
                
            </div>
        </div>
    );
}