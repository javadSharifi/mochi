import React, { useState } from "react";
import { Button, Modal } from "@mui/material";

interface CardDisplayProps {
  word: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ word }) => {
  const [openDictionary, setOpenDictionary] = useState(false);

  const openVideo = () => {
    window.open(`https://www.playphrase.me/#/search?q=${word}`, "_blank");
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button variant="contained" onClick={openVideo}>
        ویدیو
      </Button>
      <Button variant="contained" onClick={() => setOpenDictionary(true)}>
        دیکشنری
      </Button>
      <Modal open={openDictionary} onClose={() => setOpenDictionary(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg">
          <iframe
            src={`https://dic.b-amooz.com/en/dictionary/w?word=${word}`}
            width="800"
            height="700"
            title="دیکشنری"
          ></iframe>
        </div>
      </Modal>
    </div>
  );
};

export default CardDisplay;
