// src/components/common/HorizontalScroll.jsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HorizontalScroll = ({ items = [], renderItem, title = '', link = '/all' }) => {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
        }
    };

    return (
        <div className="my-4">
            <div className="flex justify-between items-center px-3">
                <h2 className="text-md font-semibold">{title}</h2>
                <Link to={link} className="text-sm text-blue-500 hover:underline">
                    Voir tout
                </Link>
            </div>

            <div className="relative mt-2">
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow z-10"
                    aria-label="Scroll gauche"
                >
                    <ChevronLeft size={16} />
                </button>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide space-x-3 px-6 py-2 snap-x snap-mandatory"
                >
                    {Array.isArray(items) && items.length > 0 ? (
                        items.map((item) => renderItem(item))
                    ) : (
                        <p className="text-sm text-gray-500">Aucun élément à afficher.</p>
                    )}
                </div>

                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow z-10"
                    aria-label="Scroll droite"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default HorizontalScroll;
