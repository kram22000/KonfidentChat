import React, { useState } from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import ChatWindow from './ChatWindow';

import '../Homepage.css';

function UserStatusIndicator({ isOnline }) {
  return (
    <div
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: isOnline ? 'green' : 'red',
        display: 'inline-block',
        marginLeft: '5px',
      }}
    ></div>
  );
}

function HomePage({ userData, handleSignOut }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);

  function handleSearch(event) {
    event.preventDefault();

    fetch(`http://localhost:2000/search?query=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data.results);
        setShowResults(true);
      })
      .catch(error => {
        console.log(error.message);
        setSearchResults([]);
        setShowResults(true);
      });
  }

  function startChatWith(user) {
    setChatUser(user);
    setShowChat(true);
    setOtherUser(user);
    setShowResults(false);
  }

  return (
    <div className="home-page">
      <div className='intro-containers'>
        <h1>
          Welcome, {userData && userData.name}!{' '}
          <UserStatusIndicator isOnline={userData && userData.isOnline} />
        </h1>

        <h2>Search for other users:</h2>

        <form onSubmit={handleSearch}>
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <button type="submit">Search</button>
        </form>
      </div>
      {showResults && searchResults.length > 0 ? (
        <div className='search-result'>
          <h2>Search results:</h2>
          <ul>
          {searchResults.map(user => (
            <li key={user.id}>
              <span>{user.name}</span>
              <UserStatusIndicator isOnline={user.isOnline} />
              <div className="start-chat-button-container">
                <button onClick={() => startChatWith(user)}>Start Chat</button>
              </div>
            </li>
          ))}
          </ul>
        </div>
      ) : showResults ? (
        <p>No user found.</p>
      ) : null}

      {showChat && chatUser && (
        <ChatWindow currentUser={userData} otherUser={otherUser} />
      )}

      <div className="signout-container">
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
}

export default HomePage;

