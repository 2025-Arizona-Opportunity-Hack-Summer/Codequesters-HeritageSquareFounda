import React, { useState, useEffect } from 'react';
import Stepper, { Step } from './Stepper';
import { motion } from 'framer-motion';

const IngestionFlow = ({ folderId, onComplete }) => {
  const [ingestionStatus, setIngestionStatus] = useState('idle'); // idle, ingesting, polling, complete, error
  const [jobId, setJobId] = useState(null);
  const [progressMessage, setProgressMessage] = useState('Starting ingestion...');

  const startIngestion = async () => {
    setIngestionStatus('ingesting');
    try {
      // REMOVE /ingest from the end of the URL
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/ingestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drive_folder_id: folderId }),
      });
      if (!response.ok) throw new Error('Failed to start ingestion');
      const data = await response.json();
      setJobId(data.job_id);
      setIngestionStatus('polling');
    } catch (error) {
      console.error(error);
      setProgressMessage('Error starting ingestion. Please try again.');
      setIngestionStatus('error');
    }
  };

  useEffect(() => {
    if (ingestionStatus !== 'polling' || !jobId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/ingest/status/${jobId}`);
        const data = await response.json();
        setProgressMessage(data.status);
        if (data.status === 'Complete') {
          setIngestionStatus('complete');
          clearInterval(interval);
        } else if (data.status === 'Error') {
          setIngestionStatus('error');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setProgressMessage('Error checking status.');
        setIngestionStatus('error');
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [ingestionStatus, jobId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <Stepper onFinalStepCompleted={onComplete}>
        <Step>
          <h2 className="text-xl font-bold font-serif">New Folder Detected</h2>
          <p className="mt-2 text-sm text-heritage-off-white/80">
            This Google Drive folder hasn't been indexed yet. We need to process its contents to enable chat.
          </p>
        </Step>
        <Step>
          <h2 className="text-xl font-bold font-serif">Ready to Index</h2>
          <p className="mt-2 text-sm text-heritage-off-white/80">
            Click the button below to start indexing the documents. This may take a few minutes depending on the number of files.
          </p>
          <button
            onClick={startIngestion}
            disabled={ingestionStatus !== 'idle'}
            className="mt-4 w-full rounded-lg bg-heritage-gold px-4 py-2 font-bold text-heritage-green disabled:opacity-50"
          >
            {ingestionStatus === 'idle' ? 'Start Indexing' : 'Indexing...'}
          </button>
        </Step>
        <Step>
          <h2 className="text-xl font-bold font-serif">Indexing in Progress...</h2>
          <div className="flex items-center justify-center gap-4 mt-4 p-4 bg-heritage-green/50 rounded-lg">
            <div className="w-6 h-6 border-2 border-heritage-gold/30 border-t-heritage-gold rounded-full animate-spin" />
            <p className="text-sm text-heritage-off-white">{progressMessage}</p>
          </div>
          <p className="mt-4 text-xs text-center text-heritage-off-white/60">
            You can leave this window open. We'll let you know when it's done.
          </p>
        </Step>
        <Step>
          <h2 className="text-xl font-bold font-serif">Indexing Complete!</h2>
          <p className="mt-2 text-sm text-heritage-off-white/80">
            The folder has been successfully indexed. You can now close this and start asking questions.
          </p>
        </Step>
      </Stepper>
    </motion.div>
  );
};

export default IngestionFlow;