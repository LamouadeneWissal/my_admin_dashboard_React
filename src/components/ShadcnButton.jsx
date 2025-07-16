import React from 'react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

/**
 * ShadcnButton Component
 * 
 * Un composant bouton réutilisable basé sur Shadcn UI avec des variantes 
 * de couleur cohérentes et une prise en charge des icônes.
 * 
 * @param {string} variant - Variante du bouton (default, outline, ghost, destructive, link)
 * @param {string} size - Taille du bouton (default, sm, lg, icon)
 * @param {ReactNode} children - Contenu du bouton
 * @param {ReactNode} icon - Icône à afficher avant le texte du bouton (optionnel)
 * @param {ReactNode} rightIcon - Icône à afficher après le texte du bouton (optionnel)
 * @param {string} className - Classes CSS additionnelles
 * @param {Object} props - Autres propriétés du bouton
 * @returns {JSX.Element} - Bouton stylisé
 */
const ShadcnButton = ({ 
  variant = 'default', 
  size = 'default', 
  children, 
  icon, 
  rightIcon, 
  className, 
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "font-medium transition-all duration-200",
        className
      )}
      {...props}
    >
      {icon && <span className={cn("mr-2", !children && "mr-0")}>{icon}</span>}
      {children}
      {rightIcon && <span className={cn("ml-2", !children && "ml-0")}>{rightIcon}</span>}
    </Button>
  );
};

export { ShadcnButton };
export default ShadcnButton;
