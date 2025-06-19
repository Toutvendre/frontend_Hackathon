import React, { useState } from 'react';
import SidebarRestaurant from '@/components/Dash/Restaurant/SidebarRestaurant';
import MainRestaurant from '@/components/Dash/Restaurant/MainRestaurant';

const DashboardRestaurant = () => {
    const [sidebarOuverte, setSidebarOuverte] = useState(false);

    return (
        <div className="flex h-screen w-full bg-gray-50">
            <SidebarRestaurant
                onExpand={() => setSidebarOuverte(true)}
                onCollapse={() => setSidebarOuverte(false)}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 pt-4 overflow-hidden overflow-y-auto">
                    <MainRestaurant sidebarEtendue={sidebarOuverte} />
                </div>
            </div>
        </div>
    );
};

export default DashboardRestaurant;
