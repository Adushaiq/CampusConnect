import { useState } from "react";
import { Navigate, Link } from "react-router-dom"
import toast from 'react-hot-toast';

export default function RegisterPage() {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function register(ev) {
        ev.preventDefault();


        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, username, password }),
            headers: { 'Content-Type': 'application/json' },
        })

        if (response.status === 200) {
            toast.success('Account Created Successfully')
            console.log(response);
            setRedirect(true);
        } else {
            toast.error("Username already taken")
        }
    }



    if (redirect) {
        return <Navigate to={'/login'} />
    }

    return (
        <div className="Form">

            <form className="register" onSubmit={register}>
                <h1>Sign Up</h1>

                <p>Enter Your Name</p>
                <input
                    className="registerInputField"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={ev => setName(ev.target.value)}
                />

                <p>Enter Your Email</p>
                <input
                    className="registerInputField"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                />
                
                <p>Enter Your Username</p>
                <input
                    className="registerInputField"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                />
                
                <p>Enter Your Password</p>
                <input
                    className="registerInputField"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                />
                <button>Register</button>
            </form>

            <p className="loginLink">
                Already a member? <br />
                <Link to={'/login'}> Login Now! </Link>
            </p>

        </div>

    )
}