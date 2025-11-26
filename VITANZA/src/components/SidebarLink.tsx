import { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarLinkProps {
    icon: LucideIcon;
    label: string;
    path: string;
    badge?: number;
}

export const SidebarLink = ({ icon: Icon, label, path, badge }: SidebarLinkProps) => {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`
            }
        >
            <Icon className="w-5 h-5" />
            <span className="flex-1">{label}</span>
            {badge !== undefined && badge > 0 && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                    {badge}
                </span>
            )}
        </NavLink>
    );
};
