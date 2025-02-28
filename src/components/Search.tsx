// src/components/Search.tsx
import React, { useState } from 'react';

const searchEngines = ['Google', 'Yandex', 'Yahoo'];

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState(searchEngines[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          placeholder="متن جستجو" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="input input-bordered w-full"
        />
        <select 
          value={engine} 
          onChange={(e) => setEngine(e.target.value)}
          className="select select-bordered"
        >
          {searchEngines.map((eng) => (
            <option key={eng} value={eng}>{eng}</option>
          ))}
        </select>
      </div>
      <div className="mt-2">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview} alt="پیش‌نمایش" className="w-32 h-32 object-cover"/>
            <select className="select select-bordered mt-2">
              {['Google', 'Yandex'].map((eng) => (
                <option key={eng} value={eng}>{eng}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
