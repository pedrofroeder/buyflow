import { BsSearch, BsX } from "react-icons/bs";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "O que você está procurando?" }: SearchBarProps) {
  return (
    <div className="relative max-w-2xl">
      <BsSearch
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-3 rounded-xl text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg text-base"
        aria-label="Buscar produtos"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Limpar busca"
        >
          <BsX size={20} />
        </button>
      )}
    </div>
  );
}