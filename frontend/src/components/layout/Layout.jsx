import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
        }
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </NavLink>
);

const Layout = () => {
    return (
        <div className="flex h-screen bg-[#121212] text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex flex-col p-4 bg-[#1e1e1e]">
                <div className="flex items-center gap-2 px-4 py-6 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <span className="font-bold text-black">$</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">SplitWise Clone</h1>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/expenses" icon={Receipt} label="Expenses" />
                    <SidebarItem to="/groups" icon={Users} label="Groups" />
                    <SidebarItem to="/friends" icon={Users} label="Friends" />
                </nav>

                {/* Logout removed as auth is not implemented yet */}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-[#121212]">
                <div className="container mx-auto p-8 max-w-6xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
