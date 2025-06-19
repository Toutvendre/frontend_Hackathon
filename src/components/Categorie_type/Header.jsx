import { Search } from 'lucide-react';

const Header = ({ searchTerm, onSearchChange }) => (
    <div className="bg-white p-4">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">
                Assistant <span className="text-orange-500">Digital</span>
            </h1>
            <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                    src="https://via.placeholder.com/40x40/8B4513/FFFFFF?text=👤"
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>

        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Recherches"
                className="w-full pl-10 pr-4 py-3 bg-gray-200 rounded-lg border-none focus:outline-none text-gray-600"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    </div>
);

export default Header;
