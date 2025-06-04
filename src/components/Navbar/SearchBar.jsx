import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (inputValue.trim()) params.set("q", inputValue);
    if (selectedType) params.set("type", selectedType);
    navigate(`/event?${params.toString()}`);
    setInputValue(""); // kosongkan setelah cari
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 shadow-sm space-x-3 w-full max-w-xl mx-auto text-xs">
      <div className="flex items-center flex-1 space-x-1 text-gray-300 bg-transparent rounded-full px-3 py-1 border border-transparent hover:border-blue-500 focus-within:border-blue-500 transition duration-200">
        <FaSearch className="text-sm text-gray-400" />
        <input
          type="text"
          placeholder="Search events"
          className="bg-transparent focus:outline-none text-gray-700 placeholder-gray-700 text-sm w-full"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

      <div className="w-px h-4 bg-gray-400" />

      <div className="flex items-center space-x-1 text-gray-700">
        <select
          className="bg-transparent text-xs focus:outline-none"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Pilih Tipe Event</option>
          <option value="offline">Offline</option>
          <option value="online">Online</option>
        </select>
      </div>

      <button
        className="ml-2 bg-[#00ADB5] hover:bg-blue-600 text-white p-1.5 rounded-full text-[12px] duration-200 ease-in-out active:scale-90"
        onClick={handleSearch}
      >
        <FaSearch />
      </button>
    </div>
  );
}
