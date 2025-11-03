import { CheckCircle, Clock, Leaf } from 'lucide-react';
import { MenuItem } from '../types';
import { formatCurrency, formatTime } from '../utils/format';
import { Badge } from './Badge';
import { Card } from './Card';
import { MacroDisplay } from './MacroDisplay';

interface MenuItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

export const MenuItemCard = ({ item, onClick }: MenuItemCardProps) => {
  return (
    <Card hover onClick={() => onClick(item)}>
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        {item.isValidated && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{item.name}</h3>
          <span className="text-lg font-bold text-emerald-600 ml-2">
            {formatCurrency(item.price)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

        <MacroDisplay macros={item.macros} size="sm" />

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {item.isVegetarian && (
            <Badge variant="success" size="sm">
              <Leaf className="w-3 h-3 inline mr-1" />
              Vegetariano
            </Badge>
          )}
          {item.isGlutenFree && (
            <Badge variant="info" size="sm">
              Sin Gluten
            </Badge>
          )}
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {formatTime(item.preparationTime)}
          </div>
        </div>
      </div>
    </Card>
  );
};
