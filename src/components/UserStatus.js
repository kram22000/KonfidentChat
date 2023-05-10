import React from 'react';

function UserStatus({ userData, handleSignOut }) {
  return (
    <div className="user-status">
      {userData ? (
        <>
          <span>Signed in as {userData.name}</span>
          <button onClick={handleSignOut}>Sign out</button>
        </>
      ) : (
        <span>Signed out</span>
      )}
    </div>
  );
}

export default UserStatus;
