import { Home, UtensilsCrossed, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { SidebarLink } from './SidebarLink';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const { items } = useCart();
    const navigate = useNavigate();

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: UtensilsCrossed, label: 'Menú', path: '/menu' },
        { icon: ShoppingCart, label: 'Carrito', path: '/cart', badge: items.length },
        { icon: User, label: 'Mi Perfil', path: '/profile' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <aside className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">V</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">VITANZA</span>
                </div>
            </div>

            {/* User Profile */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <SidebarLink key={item.path} {...item} />
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Salir</span>
                </button>
            </div>
        </aside>
    );
};
