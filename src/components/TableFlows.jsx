import { useState } from "react";

export default function TableFlows({deptId}){
    const [flow, setFlows] = useState([]);
    const [loading, setLoading] = useState(false);

    function loadFlow(){
        fetch("")
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
    }

    return(
        <>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>Lorem</th>
                    <th>Ipsum</th>
                    <th>Dolor</th>
                    <th>Simet</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        </>
    );
}