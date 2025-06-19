const SubcategoryCard = ({ subcategory, onClick }) => {
    const Icon = subcategory.icon;
    return (
        <div
            onClick={() => onClick(subcategory)}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition transform hover:scale-105 cursor-pointer"
        >
            <div className="flex items-center space-x-3">
                <Icon className="text-gray-600 w-6 h-6" />
                <h3 className="font-medium text-gray-800">{subcategory.name}</h3>
            </div>
        </div>
    );
};

export default SubcategoryCard;
