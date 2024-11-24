import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ApiContext } from './ApiContext';

const Navbar = () => {
    let history = useHistory();
    const { truevalue, settruevalue } = useContext(ApiContext);

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        settruevalue(!truevalue);
        history.push('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
            <div className="container">
                <Link to="/" className="navbar-brand font-weight-bold text-primary">
                    VRV Assignment
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        {!sessionStorage.getItem('auth-token') && (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/signup" className="nav-link">
                                        Signup
                                    </Link>
                                </li>
                            </>
                        )}
                        {sessionStorage.getItem('auth-token') && (
                            <li className="nav-item">
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline-danger"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
