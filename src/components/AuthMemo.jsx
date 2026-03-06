import React, { use, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const init_data = {
    folio_memo : '',
    _contract_name : '',
    auth_level : '',
    _contract_genre : '',
    _contract_genre_other: '', 
    counter_pary : '',
    auth_subject : '',
    price_amount : '',
    payment_terms : '',
    delivery_method : '',
    ip_belongs_to : '',
    _contract_terms : '',
    warranty : '',
    penalty : '',
    others : '',
    _contract_path : '',
    expiration_date : '',
    plant: '',
    department: '',
    added_by: '',
};

const departments_by_plant = {
    IME: ["MRO", "EHS", "IT", "SECURITY", "LOGISTICS"],
    IMP: ["MRO"],
}

export default function AuthMemo({badge}) {
    const [form, setForm] = useState(init_data);
    const [folio, setFolio] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [contractFile, setContractFile] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    // cambio de valores en inputs
    function inputChange (e){
        const name = e.target.name;
        const value = e.target.value;
        // console.log(name+": "+value);
        if(name === "plant")
        {
            const allowed = departments_by_plant[value] || [];
            const next_department = allowed.includes(form.department) ? form.department : "";
            setForm({...form, plant: value, department: next_department});
            return;
        }
        setForm({...form, [name]:value});
    }

    // subir form - test 05
    function submitForm (e){
        e.preventDefault();
        setLoading(true);

        if (form.plant === "")
        {
            Swal.fire({icon: "error", title: "Error", text: "Please select a valid plant"});
            setLoading(false);
        }
        else
        {
            if (form._contract_name === "" ||  form._contract_genre === "" || form.auth_level === "" ||   form.counter_pary === "" ||  form.auth_subject === "" ||  form.price_amount === "" ||  form.payment_terms === "" ||  form._contract_terms === "")
            {
                Swal.fire({icon: "warning", title: "Error", text: "Please fill all the mandatory fileds"});
                setLoading(false);
            }
            else
            {
                if (form._contract_genre === "Other" && form._contract_genre_other.trim() === "" )
                {
                    Swal.fire({icon: "warning", title: "Error", text: "Please specify the contract genre"});
                    setLoading(false);
                }
                else
                {
                    
                    const genre_to_send = form._contract_genre === "Other" ? form._contract_genre_other : form._contract_genre;
                    
                    uploadContractFile().then((path) => {
                    
                        const payload = {...form, 
                            _contract_genre : genre_to_send,
                            price_amount: Number(form.price_amount),
                            _contract_path: path,
                            added_by: badge,
                        }
                        
                        fetch("https://ime-oa.inventec.com:460/AuthMemo/AuthMemos/PostAuthMemo", {
                            method: "post",
                            headers: {"Content-Type" : "application/json"},
                            body: JSON.stringify(payload),
                            credentials: "include",
                        })
                        .then(res => res.json())
                        .then(data => {
                            setLoading(false);
                            Swal.fire({icon: "success", title: "Success", text: "Auth Memo Created Successfully"});
                            loadFolio(); // volver a poner el folio
                            setContractFile(null);
                            setForm(init_data); // limpiar el form al terminar de usarse
                            if (fileInputRef.current) {
                                fileInputRef.current.value = ""; // limpiar el input de tipo file
                            }
                        })
                        .catch(error => {
                            setLoading(false);
                            Swal.fire({icon: "error", title: "Error", text: "Error: "  + error});
                            setForm(init_data); // limpiar el form al terminar de usarse
                        });

                    });
                }
            }
        }
    }

    // esto es lo equivalente a un onLoad()
    useEffect(() => {
        setShowInput(false);
        loadFolio();

        if(form._contract_genre != "Other" && form._contract_genre_other != "")
        {
            setForm(prev => ({ ...prev, _contract_genre_other: "" }));
        }

        if (form._contract_genre === "Other"){
            setShowInput(true);
        }
    }, [form._contract_genre]);

    // helpers
    function loadFolio(){
        fetch("https://ime-oa.inventec.com:460/AuthMemo/AuthMemos/GetMemoFolio", {
            method: "get",
            headers: { "Content-Type" : "application/json" },
            credentials: "include",
        })
        .then(res => res.json())
        .then((data) => {
            const alisa_meu_pelo = data.data;
            // console.log(alisa_meu_pelo);
            setFolio(alisa_meu_pelo);
            setForm(prev => ({...prev, folio_memo: alisa_meu_pelo}));
        })
        .catch((error) => {
            console.log(error.message);
        })
    }

    function uploadContractFile()
    {
        return new Promise((resolve, reject) => {
            if (!contractFile)
            {
                Swal.fire({icon: "warning", title: "Missing File", text: "Please select a file to upload"});
                resolve("");
            }
            const form_data = new FormData();
            form_data.append("contract_file", contractFile);
            form_data.append("folio_memo", folio);
            
            fetch("https://ime-oa.inventec.com:460/AuthMemo/AuthMemos/UploadContract", {
                method: "post",
                body: form_data,
                credentials: "include",
            })
            .then(res => res.json())
            .then(data => {
                if (data.success)
                {
                    setForm(prev => ({ ...prev, _contract_path: data.data }));  // se guarda el string del path en la base de datos
                    resolve(data.data);
                }
                else
                {
                    reject(data.message);
                    Swal.fire({icon: "error", title: "Upload Failed", text: "Error uploading file: \n"  + data.message});
                    console.log("Error IN UPLOAD FILE: " + data.message);
                }
            })
            .catch(error => {
                Swal.fire({ icon: "error", title: "Error", text: "Upload error: " + err });
                console.log("Error IN UPLOAD FILE: " + err);
                reject(error);
            });
        });
    }

    return (
        <div className="container main-container">
            <div className="container">
                
                {/* page top */}
                <div className="row mb-5">
                    <div className="col-md-8">
                        <h3>New Authorization Memo Form</h3>
                    </div>
                    <div className="col-md-4">
                        <small>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb float-end">
                                <li className="breadcrumb-item">Authorization Memos</li>
                                <li className="breadcrumb-item active" aria-current="page">New Authorization Memo</li>
                            </ol>
                        </nav>
                        </small>
                    </div>
                </div>
                
                {/* page content starts here */}
                <form onSubmit={submitForm}>
                    <div className="row container mb-5 g-3">

                        <div className="col-md-6">
                            <h5>Please fill in the form below:</h5>
                            <small className="text-muted">Mandatory fields are marked with <strong className="text-danger">*</strong>.</small>
                        </div>
                        <div className="col-md-3">
                            <small className="form-label">Plant: <strong className="text-danger">*</strong></small>
                            <select name="plant" id="plant" className="form-control form-control-sm" value={form.plant} onChange={inputChange}>
                                <option value="">-- Select Plant --</option>
                                <option value="IME">IME</option>
                                <option value="IMP">IMP</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <small className="form-label">Department: <strong className="text-danger">*</strong></small>
                            <select name="department" id="department" className="form-control form-control-sm" value={form.department} onChange={inputChange} disabled={form.plant === ""}>
                                <option value="">-- Select Department --</option>
                                {(departments_by_plant[form.plant] || []).map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row container mt-2 g-3">
                        {/* ----------------- */}
                        <div className="col-sm-2">
                            <label className="form-label">Contract Folio: <strong className="text-danger">*</strong></label>
                            <input className="form-control" name="folio_memo" placeholder="Contract Folio" value={folio} onChange={inputChange} disabled/>
                        </div>
                        <div className="col-sm-7">
                            <label className="form-label">Contract Name: <strong className="text-danger">*</strong></label>
                            <input className="form-control" name="_contract_name" placeholder="Contract Name" value={form._contract_name} onChange={inputChange}/>
                        </div>
                        <div className="col-sm-3">
                            <label className="form-label mb-3">Authorization level: <strong className="text-danger">*</strong></label>
                            <br />
                            <input className="form-check-input" type="radio" name="auth_level" value="GM" checked={form.auth_level === "GM"} id="gm_check" onChange={inputChange} />
                            <label className="form-check-label mx-2" htmlFor="gm_check">
                                GM
                            </label>

                            <input className="form-check-input" type="radio" name="auth_level" value="Operation" checked={form.auth_level === "Operation"} id="operation_check" onChange={inputChange} />
                            <label className="form-check-label mx-2" htmlFor="operation_check">
                                Operation
                            </label>

                            <input className="form-check-input" type="radio" name="auth_level" value="Administration" checked={form.auth_level === "Administration"} id="administration_check" onChange={inputChange} />
                            <label className="form-check-label mx-2" htmlFor="administration_check">
                                Administration
                            </label>
                        </div>
                        {/* ----------------- */}
                        <div className="col-sm-3">
                            <label className="form-label">Contract Genre: <strong className="text-danger">*</strong></label>
                            <br />
                            <input className="form-check-input" type="radio" name="_contract_genre" value="MRO" checked={form._contract_genre === "MRO"} id="mro_check" onChange={inputChange} />
                            <label className="form-check-label mx-2" htmlFor="mro_check">
                                MRO
                            </label>
                            
                            <input className="form-check-input" type="radio" name="_contract_genre" value="SOI" checked={form._contract_genre === "SOI"} id="soi_check" onChange={inputChange} />
                            <label className="form-check-label mx-2" htmlFor="soi_check">
                                SOI
                            </label>

                            <input className="form-check-input" type="radio" name="_contract_genre" value="Other" checked={form._contract_genre === "Other"} id="other_check" onChange={inputChange} />
                            <label className="form-check-label mx-2" htmlFor="other_check">
                                Other
                            </label>
                        </div>
                        {showInput ? 
                        <div className="col-md-3">
                            <label className="form-label">Sepecify Contract Genre: <strong className="text-danger">*</strong></label>
                            <input className="form-control" name="_contract_genre_other" placeholder="Specify Contract Genre" value={form._contract_genre_other} onChange={inputChange}/> 
                        </div>
                        : null}
                        <div className="col-sm-6">
                            <label className="form-label">Counter Party: <strong className="text-danger">*</strong></label>
                            <input className="form-control" name="counter_pary" placeholder="Counter Party" value={form.counter_pary} onChange={inputChange}/>
                        </div>
                        {/* ---------------- */}
                        <div className="col-sm-8">
                            <label className="form-label">Subject: <strong className="text-danger">*</strong></label>
                            <input className="form-control" name="auth_subject" placeholder="Subject" value={form.auth_subject} onChange={inputChange}/>
                        </div>
                        <div className="col-sm-4">
                            <label className="form-label">Price Amount: <strong className="text-danger">*</strong></label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input className="form-control" type="number" min={0.01} step={"any"} name="price_amount" placeholder="Price Amount" value={form.price_amount} onChange={inputChange}/>
                            </div>
                        </div>
                        {/* ---------------- */}
                        <div className="col-sm-6">
                            <label className="form-label">Payment Terms: <strong className="text-danger">*</strong></label>
                            <input className="form-control" name="payment_terms" placeholder="Payment Terms" value={form.payment_terms} onChange={inputChange}/>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Delivery Method:</label>
                            <input className="form-control" name="delivery_method" placeholder="Delivery Method" value={form.delivery_method} onChange={inputChange}/>
                        </div>
                        {/* ---------------- */}
                        <div className="col-sm-6">
                            <label className="form-label">IP Belongs To:</label>
                            <input className="form-control" name="ip_belongs_to" placeholder="IP Belongs To" value={form.ip_belongs_to} onChange={inputChange}/>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Contract Terms: <strong className="text-danger">*</strong></label>
                            <input className="form-control" name="_contract_terms" placeholder="Contract Terms" value={form._contract_terms} onChange={inputChange}/>
                        </div>
                        {/* ---------------- */}
                        <div className="col-sm-6">
                            <label className="form-label">Warranty:</label>
                            <input className="form-control" name="warranty" placeholder="Warranty" value={form.warranty} onChange={inputChange}/>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Penalty:</label>
                            <input className="form-control" name="penalty" placeholder="Penalty" value={form.penalty} onChange={inputChange}/>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Others:</label>
                            <input className="form-control" name="others" placeholder="Others" value={form.others} onChange={inputChange}/>
                        </div>
                        {/* ---------------- */}
                        {/* <div className="col-sm-6">
                            <label className="form-label">Expiration Date:</label>
                            <input className="form-control" type="date" name="expiration_date" placeholder="00/00/0000" value={form.expiration_date} onChange={inputChange}/>
                        </div> */}
                        <div className="col-md-6">
                            <label className="form-label">Upload File: <strong className="text-danger">*</strong></label>
                            <div className="input-group">
                                <input ref={fileInputRef} type="file" className="form-control" name="contract_file"
                                    onChange={(e) => setContractFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />
                            </div>
                            {form._contract_path ? (
                                <small className="text-success d-block mt-1">Uploaded: {form._contract_path}</small>
                            ) : null}
                        </div>
                        {/* ---------------- */}
                        <div className="col-sm-12 mt-3">
                            <hr/>
                            {loading ? (
                            <>
                            <button className="btn btn-dark mt-2" disabled>
                                <img src="https://media.tenor.com/GK8PJ1qKfLIAAAAi/kr%C3%A9ta-loading.gif" width={25}/> Loading...
                            </button>
                            </>)
                            :
                            (<>
                            <button className="btn btn-dark mt-2" >
                                <i className="bi bi-file-earmark-plus" /> Submit Authorization Memo
                            </button>
                            </>)}
                        </div>
                    </div>
                </form>
                {/* end of page content */}
            </div>
        </div>
    );
}