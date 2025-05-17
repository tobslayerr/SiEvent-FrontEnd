import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 shadow-sm space-x-3 w-full max-w-xl mx-auto text-xs">
      {/* Input Pencarian */}
      <div className="flex items-center flex-1 space-x-1 text-gray-300 bg-transparent rounded-full px-3 py-1 border border-transparent hover:border-blue-500 focus-within:border-blue-500 transition duration-200">
        <FaSearch className="text-sm text-gray-400" />
        <input
          type="text"
          placeholder="Search events"
          className="bg-transparent focus:outline-none text-gray-700 placeholder-gray-700 text-sm w-full"
        />
      </div>

      {/* Garis Vertikal */}
      <div className="w-px h-4 bg-gray-400" />

      {/* Dropdown Pilih Tipe Event */}
      <div className="flex items-center space-x-1 text-gray-700">
        <select className="bg-transparent text-xs focus:outline-none">
          <option value="">Pilih Tipe Event</option>
          <option value="konser">Offline</option>
          <option value="seminar">Online</option>
        </select>
      </div>

      {/* Tombol Search */}
      <button className="ml-2 bg-[#00ADB5] hover:bg-blue-600 text-white p-1.5 rounded-full text-[12px] duration-200 ease-in-out active:scale-90">
        <FaSearch />
      </button>
    </div>
  );
}
