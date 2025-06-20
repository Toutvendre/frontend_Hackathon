import { Link } from 'react-router-dom';

const HorizontalScroll = ({ items = [], renderItem, title = '', link = '/all' }) => {
    return (
        <div className="my-6">
            {/* En-tête avec titre + lien */}
            <div className="flex justify-between items-center px-4">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <Link
                    to={link}
                    className="text-sm font-medium text-orange-600 hover:underline transition-colors"
                >
                    Voir tout
                </Link>
            </div>

            {/* Liste horizontale sans flèches */}
            <div className="mt-3 px-4">
                <div className="flex overflow-x-auto space-x-4 scrollbar-hide snap-x snap-mandatory py-2">
                    {Array.isArray(items) && items.length > 0 ? (
                        items.map((item) => renderItem(item))
                    ) : (
                        <p className="text-sm text-gray-500">Aucun élément à afficher.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HorizontalScroll;
