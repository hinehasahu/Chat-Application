import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserSearch = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce); // Cleanup previous timer
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://chattr-app.onrender.com/api/users/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="p-4 border-b">
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {results.length > 0 && (
        <div className="mt-2 max-h-60 overflow-y-auto">
          {results.map((user) => (
            <div
              key={user._id}
              className="p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => onSelectUser(user)}
            >
              {user.name} ({user.email})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
