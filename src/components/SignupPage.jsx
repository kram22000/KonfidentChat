import React, { useState } from 'react';
import '../Signup.css';

function SignupPage(props) {
  const [newUser, setNewUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleSignUp(event) {
    event.preventDefault();

    fetch('http://localhost:2000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newUser,
        password: newPassword
      })
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 409) {
            throw new Error('Username already exists');
          }
          throw new Error('Houston we have a problem =S');
        }
        return response.json();
      })
      .then(data => {
        console.log('New user created:', data);
        setSuccess(true); // set success to true after user has been added
      })
      .catch(error => {
        console.error('Error adding new user:', error);
        setError(error.message);
      });
  }

  function handleBack() {
    props.setShowSignup(false);
  }

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {!success ? (
        <form onSubmit={handleSignUp}>
          <div>
            <label>Username:</label>
            <input type="text" value={newUser} onChange={(e) => setNewUser(e.target.value)} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="signup-btn">
            <button type="submit">Sign Up</button>
          </div>
        </form>
      ) : (
        <div className="success-message">User added successfully!</div>
      )}
      <button onClick={handleBack}>Back to Login</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default SignupPage;
