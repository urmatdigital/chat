import { useState, useEffect } from 'react';
    import { v4 as uuidv4 } from 'uuid';

    const Chat = () => {
      const [messages, setMessages] = useState([]);
      const [inputValue, setInputValue] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [sessionId, setSessionId] = useState('');

      useEffect(() => {
        setSessionId(uuidv4());
      }, []);

      const handleSendMessage = async () => {
        if (inputValue.trim()) {
          const newMessage = { text: inputValue, sender: 'user', timestamp: new Date().toLocaleTimeString() };
          setMessages([...messages, newMessage]);
          setInputValue('');
          setIsLoading(true);

          try {
            const response = await fetch('https://n.urmat.org/webhook/9ba11544-5c4e-4f91-818a-08a4ecb596c5', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // Uncomment the following line if you need to add an authorization header
                // 'Authorization': 'Bearer [Insert your token here]'
              },
              body: JSON.stringify({
                sessionId,
                chatInput: inputValue
              })
            });

            const data = await response.json();
            const botResponse = { text: data.output, sender: 'bot', timestamp: new Date().toLocaleTimeString() };
            setMessages((prevMessages) => [...prevMessages, botResponse]);
          } catch (error) {
            console.error('Error fetching response:', error);
            const errorMessage = { text: 'An error occurred while processing your request.', sender: 'bot', timestamp: new Date().toLocaleTimeString(), isError: true };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
          } finally {
            setIsLoading(false);
          }
        }
      };

      return (
        <div className="chat-container">
          <div className="chat-header">Chat with Bot</div>
          <div className="chat-body" ref={(el) => el && el.scrollTo(0, el.scrollHeight)}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'} ${msg.isError ? 'error-message' : ''}`}>
                {msg.text}
                <div className="timestamp">{msg.timestamp}</div>
              </div>
            ))}
            {isLoading && (
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage} style={{ opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
              Send
            </button>
          </div>
        </div>
      );
    };

    export default Chat;
