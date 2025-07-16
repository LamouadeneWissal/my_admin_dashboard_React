import React from 'react';
import { Switch } from './ui/switch';
import { cn } from '../lib/utils';

/**
 * ShadcnToggle Component
 * 
 * Un composant toggle basé sur Shadcn UI Switch avec un libellé 
 * et des styles adaptés pour le mode sombre.
 * 
 * @param {boolean} checked - État actuel du toggle (activé/désactivé)
 * @param {function} onCheckedChange - Fonction appelée quand l'état change
 * @param {string} label - Libellé du toggle (optionnel)
 * @param {string} className - Classes CSS additionnelles
 * @param {Object} props - Autres propriétés du Switch
 * @returns {JSX.Element} - Toggle stylisé
 */
const ShadcnToggle = ({ 
  checked, 
  onCheckedChange, 
  label, 
  className,
  ...props 
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <span className="text-sm">{label}</span>}
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange} 
        {...props} 
      />
    </div>
  );
};

export { ShadcnToggle };
export default ShadcnToggle;
