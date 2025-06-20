const CategoryCard = ({ name, onClick, isSelected }) => (
    <div
        onClick={onClick}
        className={`px-4 py-2 rounded-full cursor-pointer text-sm whitespace-nowrap
      ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
    >
        {name}
    </div>
);

export default CategoryCard;
