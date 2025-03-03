// src/components/Shortcuts.tsx
import React, { useState } from "react";
import ModalForm from "./ModalForm";
import { useShortcutStore } from "../../store/shortcutStore";
export interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon: string;
}

const Shortcuts: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentShortcut, setCurrentShortcut] = useState<Shortcut | null>(null); // برای ویرایش یک میانبر خاص
  const { shortcuts, deleteShortcut } = useShortcutStore();


  const handleDelete = (id: string) => {
    deleteShortcut(id);
  };

  const handleEdit = (sc: Shortcut) => {
    setCurrentShortcut(sc); // تنظیم میانبر برای ویرایش
    setShowModal(true); // نمایش Modal
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2">میانبرها</h2>
      <div className="flex flex-wrap gap-4">
        {shortcuts.map((sc) => (
          <div
            key={sc.id}
            className="group relative p-2 border rounded flex flex-col items-center"
          >
            <a href={sc.url} target="_blank" rel="noopener noreferrer">
              <img src={sc.icon} alt={sc.name} className="w-10 h-10" />
            </a>
            <span className="text-sm mt-1">{sc.name}</span>
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex gap-1">
              <button className="btn btn-xs" onClick={() => handleEdit(sc)}>
                ویرایش
              </button>
              <button
                className="btn btn-xs btn-error"
                onClick={() => handleDelete(sc.id)}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
        <button className="btn btn-outline" onClick={() => setShowModal(true)}>
          افزودن
        </button>
      </div>
      {showModal && (
        <ModalForm
          onClose={() => {
            setShowModal(false);
            setCurrentShortcut(null); // Reset current shortcut after closing modal
          }}
          initialValues={currentShortcut} // ارسال اطلاعات برای ویرایش
        />
      )}
    </div>
  );
};

export default Shortcuts;
