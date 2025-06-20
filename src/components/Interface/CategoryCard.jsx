const CategoryCard = ({ name, onClick, isSelected }) => (
    <div
        onClick={onClick}
        className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all duration-200 shadow-sm whitespace-nowrap
        ${isSelected
                ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
    >
        {name}
    </div>
);

export default CategoryCard;
