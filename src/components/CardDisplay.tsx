import React, { useState } from 'react';
import { Button, Modal } from '@mui/material';

interface CardDisplayProps {
  word: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ word }) => {
  const [openDictionary, setOpenDictionary] = useState(false);

  const handlePronounce = async () => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      console.log('داده تلفظ:', data);
      // در صورت نیاز می‌توان صدای تلفظ را نیز پخش کرد
    } catch (error) {
      console.error('خطا در دریافت تلفظ:', error);
    }
  };

  const openVideo = () => {
    // به جای iframe، یک پنجره جدید باز می‌کنیم تا محدودیت iframe رفع شود
    window.open(`https://www.playphrase.me/#/search?q=${word}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button variant="contained" onClick={handlePronounce}>تلفظ</Button>
      <Button variant="contained" onClick={openVideo}>ویدیو</Button>
      <Button variant="contained" onClick={() => setOpenDictionary(true)}>دیکشنری</Button>
      <Modal open={openDictionary} onClose={() => setOpenDictionary(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg">
          <iframe 
            src={`https://dic.b-amooz.com/en/dictionary/w?word=${word}`}
            width="400" height="300" title="دیکشنری"
          ></iframe>
        </div>
      </Modal>
    </div>
  );
};

export default CardDisplay;
