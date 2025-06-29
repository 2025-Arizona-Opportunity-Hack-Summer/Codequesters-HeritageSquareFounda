import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MessageList from './components/MessageList';
import InputForm from './components/InputForm';
import IngestionFlow from './components/IngestionFlow'; // Import the new component
import { AnimatePresence } from 'framer-motion';

// New helper function to parse the ID from a Google Drive URL
const parseDriveIdFromUrl = (url) => {
  if (!url) return '';
  // Handle case where user might just paste the ID
  if (!url.includes('drive.google.com')) {
    return url; // Assume it's the ID itself
  }
  const regex = /folders\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
};


function App() {
  // Rename state to hold the full URL
  const [driveFolderUrl, setDriveFolderUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // New state for ingestion flow
  const [showIngestionFlow, setShowIngestionFlow] = useState(false);
  const [folderIdForIngestion, setFolderIdForIngestion] = useState(null);
  const [isFolderReady, setIsFolderReady] = useState(false);

  useEffect(() => {
    // Enhanced welcome message
    setMessages([
      { 
        sender: 'ai', 
        text: 'Welcome to Heritage Square AI Assistant! 🏛️\n\nI can help you find information about Heritage Square\'s history, tours, events, and facilities. Please paste the Google Drive folder link above to get started.' 
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkFolderStatus = async () => {
    const folderId = parseDriveIdFromUrl(driveFolderUrl);
    if (!folderId) {
      setIsFolderReady(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/ingestion/check/${folderId}`);
      if (!response.ok) throw new Error('Status check failed');
      const data = await response.json();

      if (data.is_ingested) {
        setIsFolderReady(true);
      } else {
        setIsFolderReady(false);
        setFolderIdForIngestion(folderId);
        setShowIngestionFlow(true);
      }
    } catch (error) {
      console.error("Failed to check folder status:", error);
      setIsFolderReady(false);
    }
  };

  const handleIngestionComplete = () => {
    setShowIngestionFlow(false);
    setIsFolderReady(true);
    setFolderIdForIngestion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parse the ID from the URL state
    const folderId = parseDriveIdFromUrl(driveFolderUrl);

    if (!input.trim() || isLoading || !folderId || !isFolderReady) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/qa/ask`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Send the extracted folderId to the backend
          drive_folder_id: folderId,
          question: input,
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.answer };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Failed to get answer:", error);
      const errorMessage = { 
        sender: 'ai', 
        text: "I apologize, but I encountered an error while processing your request. Please check your connection and try again. If the problem persists, please verify that your Google Drive folder link is correct." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-heritage-green via-heritage-green to-heritage-green/90 font-sans overflow-x-hidden">
      <Header
        driveFolderUrl={driveFolderUrl}
        setDriveFolderUrl={setDriveFolderUrl}
        onBlur={checkFolderStatus} // Pass the check function
        isReady={isFolderReady}
      />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />
      <InputForm
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isChatDisabled={!isFolderReady}
      />
      <AnimatePresence>
        {showIngestionFlow && (
          <IngestionFlow
            folderId={folderIdForIngestion}
            onComplete={handleIngestionComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
