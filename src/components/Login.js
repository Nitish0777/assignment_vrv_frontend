import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import Navbar from './Nabar';
import { ApiContext } from './ApiContext';

const Login = () => {
    const [value, setValue] = useState({ email: '', password: '', role: 0, active: true });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { truevalue, settruevalue, isAuth, setIsAuth } = useContext(ApiContext);
    const history = useHistory();

    const handleChange = (key, value) => {
        setValue((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        try {
            const res = await axios.post('https://assignment-vrv.vercel.app/login/', value);
            sessionStorage.setItem('auth-token', res.headers['auth-token']);
            const { user, role, active } = res.data;

            if (role === 1) {
                settruevalue(!truevalue);
                setIsAuth(!isAuth);
                history.push({ pathname: '/showdata', state: { datacheck: res.data } });
            } else if (user && active) {
                const userDetails = await axios.get(`https://assignment-vrv.vercel.app/user-details/${user}`);
                settruevalue(!truevalue);
                setIsAuth(!isAuth);
                history.push({ pathname: '/showdata', state: { datacheck: userDetails.data } });
            } else {
                sessionStorage.removeItem('auth-token');
                alert('User is not active or not present.');
            }
        } catch (err) {
            setEmailError(err.response?.data?.errors?.email || 'Invalid email.');
            setPasswordError(err.response?.data?.errors?.password || 'Invalid password.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="col-md-6 mx-auto bg-light p-5 shadow rounded">
                    <h2 className="text-center text-primary mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="text-secondary">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={value.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="form-control"
                                placeholder="Enter your email"
                                required
                            />
                            {emailError && <small className="text-danger">{emailError}</small>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="text-secondary">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={value.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                className="form-control"
                                placeholder="Enter your password"
                                required
                            />
                            {passwordError && <small className="text-danger">{passwordError}</small>}
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary btn-block mt-3">Log In</button>
                        </div>
                    </form>
                    <div className="text-center mt-3">
                        <Link to="/reset" className="text-danger">Forgot Password?</Link>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-secondary">Don't have an account? <Link to="/signup" className="text-primary">Sign up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
