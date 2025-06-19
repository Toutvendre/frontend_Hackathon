import SubcategoryCard from './SubcategoryCard';

const SubcategoryGrid = ({ subcategories, onSubcategoryClick }) => (
    <div className="grid grid-cols-2 gap-4">
        {subcategories.map((sub, idx) => (
            <SubcategoryCard key={`${sub.name}-${idx}`} subcategory={sub} onClick={onSubcategoryClick} />
        ))}
    </div>
);

export default SubcategoryGrid;
