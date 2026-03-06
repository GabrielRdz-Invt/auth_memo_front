import React from "react";

export default function Unauthorized() {

    function handleLogin(event){
        event.preventDefault();
    }
    // render
    return (
        <div className="container main-container">
            <div className="container">
            {/* start of page content */}

                <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                    {/* <div className="card-body"> */}
                        <h1 className="align-items-center d-flex flex-column mt-5 text-danger" style={{fontSize:'5em'}}>401</h1>
                        <h1 className="align-items-center d-flex flex-column">Unauthorized</h1>
                        <hr />
                        <p className="text-center">You are not authorized to access this page. Please log in with your Inventec account.</p>
                    {/* </div> */}
                </div>

            {/* end of page content */}
            </div>
        </div>
    );
}