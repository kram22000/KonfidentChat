import React, { useState } from 'react';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';
import './App.css';

function LoginPage() {
  const [userid, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [userData, setUserData] = useState(null);

// New function to handle sign out
function handleSignOut() {
  setUserFound(false);
  setUsername('');
  setPassword('');
  setUserData(null);
}


  function handleSubmit(event) {
    event.preventDefault();
  
    fetch(`http://localhost:2000/authenticate?name=${userid}&password=${password}`)
      .then(response => {
        if (response.status === 401) {
          throw new Error("Incorrect password");
        }
        if (response.status === 404) {
          throw new Error("User not found");
        }
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        return response.json();
      })
      .then(data => {
        console.log('User Found:', data);
        setUserFound(true);
        setShowSignup(false);
        setUserData(data);
        setError('');
      })
      .catch(error => {
        console.log(error.message);
        setError(error.message);
      });
  }
  

  return (
    
    <div className='main'>
      <style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Ubuntu&display=swap');
</style>
  <h1>KMK Chat</h1>
  {showSignup ? (
    <SignupPage setShowSignup={setShowSignup} />
  ) : userFound ? (
    <HomePage userData={userData} handleSignOut={handleSignOut} />
  ) : (
    <div className='login-container'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={userid} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='login-btn'>
        <button type="submit">Login</button>
        </div>
        
      </form>
      <button onClick={() => setShowSignup(true)}>Sign Up</button>
    </div>
  )}
  {error && <div className='error'>{error}</div>}
</div>
  );
}

export default LoginPage;
