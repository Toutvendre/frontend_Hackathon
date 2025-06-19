const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => (
    <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button
                onClick={() => onCategoryChange('')}
                className={`px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 ${activeCategory === ''
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                Tout
            </button>
            {Object.keys(categories).map((cat) => (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 ${activeCategory === cat
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    </div>
);

export default CategoryFilter;
