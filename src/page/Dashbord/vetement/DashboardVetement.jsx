import React, { useState } from 'react';
import SidebarVetement from '@/components/Dash/Vetement/SidebarVetement';
import MainVetement from '@/components/Dash/Vetement/MainVetement';

const DashboardVetement = () => {
    const [sidebarOuverte, setSidebarOuverte] = useState(false);

    return (
        <div className="flex h-screen w-full bg-gray-50">
            <SidebarVetement
                onExpand={() => setSidebarOuverte(true)}
                onCollapse={() => setSidebarOuverte(false)}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 pt-4 overflow-hidden overflow-y-auto">
                    <MainVetement sidebarEtendue={sidebarOuverte} />
                </div>
            </div>
        </div>
    );
};

export default DashboardVetement;
