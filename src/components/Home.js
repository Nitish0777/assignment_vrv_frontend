import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const isLoggedIn = !!sessionStorage.getItem('auth-token');

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        console.log('User logged out');
        window.location.reload(); // Reload the page to reflect logout
    };

    return (
        <div className="container mt-5">
            <div className="text-center">
                <h1 className="display-4 text-primary font-weight-bold">VRV Frontend Assignment</h1>
                <p className="lead mt-3 text-secondary">
                    Explore a feature-rich platform with user and role management capabilities.
                </p>
            </div>
            <div className="jumbotron bg-light shadow-sm p-5 mt-4">
                <h2 className="display-5 mb-4 text-dark">Access Information</h2>
                <p className="text-muted">
                    <strong>Normal User:</strong>  
                    Email: <code>nnn@gmail.com</code> | Password: <code>nnn@123</code>
                </p>
                <p className="text-muted">
                    <strong>Admin:</strong>  
                    Email: <code>n@gmail.com</code> | Password: <code>nnn@123</code>
                </p>
                <hr className="my-4" />
                <div className="d-flex justify-content-center mt-4">
                    {isLoggedIn ? (
                        <button
                            className="btn btn-danger btn-lg mx-2"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link className="btn btn-primary btn-lg mx-2" to="/signup" role="button">
                                Signup
                            </Link>
                            <Link className="btn btn-secondary btn-lg mx-2" to="/login" role="button">
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div className="jumbotron bg-light shadow-sm p-5 mt-4">
                <h2 className="display-5 mb-4 text-dark">Implemented Features</h2>
                <p className="text-muted mb-4">
                    - User Management: Add, edit, delete users, and assign roles with active/inactive status.<br />
                    - Role Management: Create roles and assign permissions like Read, Write, or Delete.<br />
                    - Dynamic Permissions: Easily view and modify role-based permissions.
                </p>
                <hr className="my-4" />
                <p className="text-muted">
                    Dive into the application to explore these features in action.
                </p>
            </div>
        </div>
    );
};

export default Home;
