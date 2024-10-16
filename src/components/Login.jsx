import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost/discuss/api.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ username, password }),
        });
        const data = await response.json();
        if (data.success) {
            onLogin(data.user);
            navigate('/');
        } else {
            alert(data.error);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <div
            className='
            flex flex-col items-center justify-center
            w-[500px] h-[700px] gap-10
            bg-[#2e2e2e] rounded-3xl shadow-xl
            '>
                <h2 className='text-5xl mb-10'>Login</h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5 items-center'>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className='bg-[#2e2e2e] w-[400px] p-4 border-[#868686] border-b-2 focus:border-[#ffe01b]
                        transition-color duration-300'
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className='bg-[#2e2e2e] w-[400px] p-4 border-[#868686] border-b-2 focus:border-[#ffe01b]
                        transition-color duration-300'
                    />
                    <button type="submit" className='w-[100px] bg-[#ffe01b] text-black rounded'>Login</button>
                    
                </form>
                <p>
                    Don't have an account? <Link to="/register" className='hover:text-white transition-color duration-300'>Register</Link>
                </p>
            </div>
        </div>

    );
};

export default Login;
