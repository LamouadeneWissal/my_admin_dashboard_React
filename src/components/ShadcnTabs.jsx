import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { cn } from '../lib/utils';

/**
 * ShadcnTabs Component
 * 
 * Un composant de navigation par onglets basé sur Shadcn UI,
 * avec différentes variantes de style et supportant le contenu dynamique.
 * 
 * @param {Object[]} tabs - Tableau d'objets définissant les onglets (value, label, content)
 * @param {string} defaultValue - Valeur de l'onglet actif par défaut
 * @param {function} onValueChange - Fonction appelée quand l'onglet actif change
 * @param {string} className - Classes CSS additionnelles
 * @returns {JSX.Element} - Composant d'onglets stylisé
 */
const ShadcnTabs = ({ 
  tabs = [], 
  defaultValue, 
  onValueChange,
  variant = "default", 
  className
}) => {
  // Allow manual or automatic defaultValue
  const activeTab = defaultValue || (tabs.length > 0 ? tabs[0].value : '');

  return (
    <Tabs 
      defaultValue={activeTab} 
      onValueChange={onValueChange}
      className={cn("w-full", className)}
    >
      <TabsList className={cn(
        "w-full justify-start border-b rounded-none bg-transparent p-0 h-auto",
        variant === "underline" && "border-b border-gray-200"
      )}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "px-6 py-4 text-sm font-medium rounded-none data-[state=active]:shadow-none",
              variant === "underline" 
                ? "data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary" 
                : "data-[state=active]:bg-background data-[state=active]:text-foreground"
            )}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="p-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export { ShadcnTabs };
export default ShadcnTabs;
