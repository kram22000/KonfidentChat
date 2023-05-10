import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import '../Chatwindow.css';
import EmojiPicker from 'emoji-picker-react'; 

function ChatWindow(props) {
  const { currentUser, otherUser } = props;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  function onEmojiClick(event, emojiObject) {
    const { emoji } = emojiObject;
    setSearchTerm(searchTerm + emoji);
    setNewMessage(newMessage + emoji);
  }

  async function handleSendMessage(event) {
    event.preventDefault();

    const newMessageObject = {
      senderId: currentUser.id,
      receiverId: otherUser.id,
      text: newMessage
    };

    const response = await fetch('http://localhost:2000/chat_messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessageObject)
    });

    if (!response.ok) {
      console.error('Failed to save chat message to database');
      return;
    }

    setMessages([...messages, newMessageObject]);
    setNewMessage('');
  }

  async function fetchMessages() {
    const response = await fetch(`http://localhost:2000/chats/${currentUser.id}/${otherUser.id}`);
    if (response.ok) {
      const messages = await response.json();
      setMessages(messages);
    } else {
      console.error('Failed to fetch chat messages from server');
    }
  }

  useEffect(() => {
    fetchMessages(); // fetch messages on mount

    const interval = setInterval(() => {
      fetchMessages(); // fetch messages every 1 second
    }, 1000);

    return () => clearInterval(interval); // cleanup the interval on unmount
  }, [currentUser.id, otherUser.id]);

  return (
    <div>
      <h2>Chatting with {otherUser.name}</h2>
      <div id='message-container' style={{ height: '400px', overflow: 'scroll' }}>
        <ul>
          {messages.map((message, index) => (
            <li key={index} className={message.senderId === currentUser.id ? 'you' : 'other'}>
              <strong>{message.senderId === currentUser.id ? 'You' : otherUser.name}:</strong> {message.text}
              {message.senderId === currentUser.id && (
                <span className="checkmark">&#10003;</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSendMessage}>
        <div className="chat-input-container">
          <input type="text" value={newMessage} onChange={(event) => setNewMessage(event.target.value)} />
          <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>
          <button type="submit">Send</button>
        </div>
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </form>
    </div>
  );
}

export default ChatWindow;
