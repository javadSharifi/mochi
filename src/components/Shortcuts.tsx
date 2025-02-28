// src/components/Shortcuts.tsx
import React, { useEffect, useState } from 'react';
import { getShortcuts, removeShortcut } from '../utils/localStorage';
import ModalForm from './ModalForm';


interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon: string;
}

const Shortcuts: React.FC = () => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = getShortcuts();
    setShortcuts(stored);
  }, []);

  const handleDelete = (id: string) => {
    removeShortcut(id);
    setShortcuts(getShortcuts());
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2">میانبرها</h2>
      <div className="flex flex-wrap gap-4">
        {shortcuts.map((sc) => (
          <div key={sc.id} className="group relative p-2 border rounded flex flex-col items-center">
            <img src={sc.icon} alt={sc.name} className="w-10 h-10"/>
            <span className="text-sm mt-1">{sc.name}</span>
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex gap-1">
              <button className="btn btn-xs" onClick={() => {/* منطق ویرایش */}}>ویرایش</button>
              <button className="btn btn-xs btn-error" onClick={() => handleDelete(sc.id)}>حذف</button>
            </div>
          </div>
        ))}
        <button className="btn btn-outline" onClick={() => setShowModal(true)}>
          افزودن
        </button>
      </div>
      {showModal && <ModalForm onClose={() => { setShowModal(false); setShortcuts(getShortcuts()); }} />}
    </div>
  );
};

export default Shortcuts;
