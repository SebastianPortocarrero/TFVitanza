import { Macros } from '../types';
import { formatCalories, formatMacro } from '../utils/format';

interface MacroDisplayProps {
  macros: Macros;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
}

export const MacroDisplay = ({ macros, size = 'md', vertical = false }: MacroDisplayProps) => {
  const containerClass = vertical ? 'flex flex-col gap-2' : 'flex items-center gap-4 flex-wrap';

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const MacroItem = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className={`${textSize[size]} text-gray-600`}>
        {label}: <span className="font-semibold text-gray-900">{value}</span>
      </span>
    </div>
  );

  return (
    <div className={containerClass}>
      <div className={`${textSize[size]} font-semibold text-emerald-700`}>
        {formatCalories(macros.calories)}
      </div>
      <MacroItem label="P" value={formatMacro(macros.protein)} color="bg-blue-500" />
      <MacroItem label="C" value={formatMacro(macros.carbs)} color="bg-orange-500" />
      <MacroItem label="G" value={formatMacro(macros.fat)} color="bg-purple-500" />
      {macros.fiber !== undefined && (
        <MacroItem label="F" value={formatMacro(macros.fiber)} color="bg-green-500" />
      )}
    </div>
  );
};
