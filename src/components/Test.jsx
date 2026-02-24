import React from "react";

export const Test = () => {
    return (
        <>
            <header class="navbar">
            <div class="container inner">
                <a href="#">
                    <span class="brand-badge"></span>
                    <span>Acme Enterprise</span>
                </a>

                <nav class="nav-links">
                    <a href="#">Dashboard</a>
                    <a href="#">Projects</a>
                    <a href="#">Reports</a>
                    <a href="#">Admin</a>
                </nav>

                <div class="nav-actions">
                    <button class="btn btn-ghost btn-icon nav-toggle" aria-label="menu">☰</button>
                    <button class="btn btn-secondary">Support</button>
                    <button class="btn btn-primary">New</button>
                </div>
            </div>
            </header>

            <main class="container mt-24 stack">
                <section class="grid">
                    <div class="col-8 md-col-12 card">
                        <div class="card-header">
                            <div class="card-title">Create Ticket</div>
                        </div>
                        <div class="card-body stack">
                            <div class="field">
                                <label class="label">Subject</label>
                                <input class="control" placeholder="e.g. VPN access request" />
                                <small class="hint">Short and descriptive helps faster resolution.</small>
                            </div>

                            <div class="field-row">
                                <div class="field">
                                    <label class="label">Category</label>
                                    <select class="control select">
                                    <option>IT</option><option>HR</option><option>Facilities</option>
                                    </select>
                                </div>
                                <button class="btn btn-primary">Submit</button>
                            </div>

                            <label class="checkbox">
                                <input type="checkbox" />
                                Notify me via email
                            </label>
                        </div>
                    </div>

                    <aside class="col-4 md-col-12 stack">
                        <div class="alert alert-info">
                            <strong>Pro tip:</strong> Attach logs for faster triage.
                        </div>
                        <div class="card">
                            <div class="card-header"><div class="card-title">Status</div></div>
                            <div class="card-body row">
                                <span class="badge badge-success">Operational</span>
                                <span class="badge badge-warning">Degraded</span>
                            </div>
                        </div>
                    </aside>
                </section>

                <section class="card">
                    <div class="card-header">
                        <div class="card-title">Recent Requests</div>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Owner</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#1021</td>
                                    <td>VPN Access</td>
                                    <td>G. Rodriguez</td>
                                    <td><span class="badge badge-info">In review</span></td>
                                </tr>
                                <tr>
                                    <td>#1013</td>
                                    <td>Laptop replacement</td>
                                    <td>Ops</td>
                                    <td><span class="badge badge-success">Approved</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
};