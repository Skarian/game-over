
import React, { useState, useEffect } from 'react';

interface KeyInfo {
  key: string;
  keyCode: number | string;
}

const KeyCodeDisplay: React.FC = () => {
  const [keyInfo, setKeyInfo] = useState<KeyInfo>({ key: '', keyCode: '' });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeyInfo({ key: event.key, keyCode: event.keyCode });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Press Any Key</h1>
      <p>
        <strong>Key:</strong> {keyInfo.key || 'None'}
      </p>
      <p>
        <strong>KeyCode:</strong> {keyInfo.keyCode || 'None'}
      </p>
    </div>
  );
};

export default KeyCodeDisplay;
