import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Switch } from './ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import ShadcnStatCard from './ShadcnStatCard';
import ShadcnButton from './ShadcnButton';
import ShadcnToggle from './ShadcnToggle';
import ShadcnTabs from './ShadcnTabs';
import { useToast } from './ui/toast-container';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from './ui/dropdown-menu';

/**
 * ShadcnDemo Component
 * 
 * Page de démonstration présentant tous les composants Shadcn UI
 * utilisés dans l'application, avec des exemples d'utilisation.
 * 
 * Cette page sert de référence visuelle pour la cohérence du design system
 * et de documentation pour l'équipe de développement.
 * 
 * @returns {JSX.Element} - Composant de démonstration Shadcn UI
 */
const ShadcnDemo = () => {
  const [switchValue, setSwitchValue] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('stats');
  
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Shadcn UI + Tailwind CSS</h1>
        <p className="text-gray-600 dark:text-gray-400">Démonstration complète des composants réutilisables pour assurer la cohérence visuelle</p>
      </div>
      
      <ShadcnTabs
        tabs={[
          {
            value: 'stats',
            label: 'Stat Cards',
            content: (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ShadcnStatCard Component</CardTitle>
                    <CardDescription>
                      Cartes de statistiques pour afficher les métriques clés avec différentes variantes de couleur.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <ShadcnStatCard 
                        title="Total Users" 
                        value="1,234"
                        icon="👥"
                        color="blue"
                        progress={85}
                      />
                      <ShadcnStatCard 
                        title="Active Users" 
                        value="891"
                        icon="✅"
                        color="green"
                        progress={72}
                      />
                      <ShadcnStatCard 
                        title="Revenue" 
                        value="$12,345"
                        icon="💰"
                        color="purple"
                        progress={92}
                      />
                      <ShadcnStatCard 
                        title="Bounce Rate" 
                        value="12.5%"
                        icon="📉"
                        color="red"
                        progress={25}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Couleurs disponibles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <ShadcnStatCard title="Blue" value="Default" icon="🔵" color="blue" progress={60} />
                        <ShadcnStatCard title="Green" value="Success" icon="🟢" color="green" progress={80} />
                        <ShadcnStatCard title="Red" value="Error" icon="🔴" color="red" progress={40} />
                        <ShadcnStatCard title="Purple" value="Special" icon="🟣" color="purple" progress={75} />
                        <ShadcnStatCard title="Yellow" value="Warning" icon="🟡" color="yellow" progress={55} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4 bg-muted/50">
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded p-2 w-full">
                      {`<ShadcnStatCard title="Total Users" value="1,234" icon="👥" color="blue" progress={85} />`}
                    </code>
                  </CardFooter>
                </Card>
              </div>
            )
          },
          {
            value: 'buttons',
            label: 'Buttons',
            content: (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ShadcnButton Component</CardTitle>
                    <CardDescription>
                      Boutons réutilisables avec différentes variantes et tailles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Variantes</h3>
                      <div className="flex flex-wrap gap-4">
                        <ShadcnButton>Default</ShadcnButton>
                        <ShadcnButton variant="secondary">Secondary</ShadcnButton>
                        <ShadcnButton variant="outline">Outline</ShadcnButton>
                        <ShadcnButton variant="destructive">Destructive</ShadcnButton>
                        <ShadcnButton variant="ghost">Ghost</ShadcnButton>
                        <ShadcnButton variant="link">Link</ShadcnButton>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Tailles</h3>
                      <div className="flex flex-wrap gap-4 items-center">
                        <ShadcnButton size="lg">Large</ShadcnButton>
                        <ShadcnButton>Default</ShadcnButton>
                        <ShadcnButton size="sm">Small</ShadcnButton>
                        <ShadcnButton size="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </ShadcnButton>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Avec icônes</h3>
                      <div className="flex flex-wrap gap-4">
                        <ShadcnButton 
                          icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          }
                        >
                          Left Icon
                        </ShadcnButton>
                        
                        <ShadcnButton 
                          variant="outline"
                          rightIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          }
                        >
                          Right Icon
                        </ShadcnButton>

                        <ShadcnButton disabled>Disabled</ShadcnButton>
                        
                        <ShadcnButton 
                          onClick={() => toast({
                            title: "Button Clicked",
                            description: "You clicked a button with an integrated toast notification",
                          })}
                          icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M15 17h5l-1.4-1.4a6 6 0 0 0 0-8.4A6 6 0 0 0 8.4 4.8L7 6.2V2H2v5l1.4-1.4a9 9 0 0 1 15.4 6.8 9 9 0 0 1-15.4 6.8L2 18v5h5v-4.2l-1.4 1.4A6 6 0 0 0 15 17Z" />
                            </svg>
                          }
                        >
                          Show Toast
                        </ShadcnButton>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4 bg-muted/50">
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded p-2 w-full overflow-auto">
                      {`<ShadcnButton 
  variant="default|secondary|outline|destructive|ghost|link"
  size="default|sm|lg|icon"
  icon={<IconComponent />}
  rightIcon={<IconComponent />}
>
  Button Text
</ShadcnButton>`}
                    </code>
                  </CardFooter>
                </Card>
              </div>
            )
          },
          {
            value: 'cards',
            label: 'Cards',
            content: (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Components</CardTitle>
                    <CardDescription>
                      Composants de base pour construire des conteneurs de contenu.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Card Title</CardTitle>
                          <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Card content goes here. This is a basic example of a card.</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <ShadcnButton variant="ghost">Cancel</ShadcnButton>
                          <ShadcnButton>Submit</ShadcnButton>
                        </CardFooter>
                      </Card>
                      
                      <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                          <CardTitle>Custom Card</CardTitle>
                          <CardDescription>With custom styling</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Cards can be customized with additional classes.</p>
                        </CardContent>
                        <CardFooter className="border-t">
                          <ShadcnButton className="w-full">Full Width Button</ShadcnButton>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4 bg-muted/50">
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded p-2 w-full overflow-auto">
                      {`<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>Content here...</CardContent>
  <CardFooter>Footer content...</CardFooter>
</Card>`}
                    </code>
                  </CardFooter>
                </Card>
              </div>
            )
          },
          {
            value: 'toggle',
            label: 'Toggle',
            content: (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Toggle Components</CardTitle>
                    <CardDescription>
                      Composant toggle pour activer/désactiver des fonctionnalités.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Switch de base</h3>
                        <div className="flex items-center justify-between max-w-md">
                          <span className="font-medium">Switch état: {switchValue ? 'Activé' : 'Désactivé'}</span>
                          <Switch 
                            checked={switchValue} 
                            onCheckedChange={(value) => {
                              setSwitchValue(value);
                              toast({
                                title: value ? "Switch Activé" : "Switch Désactivé",
                                description: value ? "La fonctionnalité est maintenant active." : "La fonctionnalité est maintenant inactive.",
                              });
                            }} 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">ShadcnToggle avec libellé</h3>
                        <div className="space-y-4 max-w-md">
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Notifications Email</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des mises à jour par email</p>
                                </div>
                                <ShadcnToggle 
                                  checked={switchValue} 
                                  onCheckedChange={setSwitchValue} 
                                />
                              </div>
                            </CardContent>
                          </Card>
                          
                          <ShadcnToggle 
                            checked={switchValue} 
                            onCheckedChange={setSwitchValue} 
                            label="Toggle avec libellé" 
                            className="ml-4"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4 bg-muted/50">
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded p-2 w-full">
                      {`<ShadcnToggle 
  checked={isActive} 
  onCheckedChange={setIsActive} 
  label="Option Label" 
/>`}
                    </code>
                  </CardFooter>
                </Card>
              </div>
            )
          },
          {
            value: 'tabs',
            label: 'Tabs',
            content: (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tabs Components</CardTitle>
                    <CardDescription>
                      Composants d'onglets pour organiser le contenu.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Tabs de base</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <Tabs defaultValue="tab1">
                          <TabsList className="w-full">
                            <TabsTrigger value="tab1">Tableau de bord</TabsTrigger>
                            <TabsTrigger value="tab2">Paramètres</TabsTrigger>
                            <TabsTrigger value="tab3">Notifications</TabsTrigger>
                          </TabsList>
                          <TabsContent value="tab1" className="p-4">
                            <h3 className="text-lg font-medium mb-2">Tableau de bord</h3>
                            <p>Contenu du tableau de bord</p>
                          </TabsContent>
                          <TabsContent value="tab2" className="p-4">
                            <h3 className="text-lg font-medium mb-2">Paramètres</h3>
                            <p>Contenu des paramètres</p>
                          </TabsContent>
                          <TabsContent value="tab3" className="p-4">
                            <h3 className="text-lg font-medium mb-2">Notifications</h3>
                            <p>Contenu des notifications</p>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">ShadcnTabs personnalisés</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <ShadcnTabs 
                          tabs={[
                            { 
                              value: 'profile', 
                              label: 'Profil', 
                              content: (
                                <div className="p-4">
                                  <h3 className="text-lg font-medium mb-2">Profil</h3>
                                  <p>Information de profil et préférences</p>
                                </div>
                              ) 
                            },
                            { 
                              value: 'security', 
                              label: 'Sécurité', 
                              content: (
                                <div className="p-4">
                                  <h3 className="text-lg font-medium mb-2">Sécurité</h3>
                                  <p>Paramètres de sécurité et authentification</p>
                                </div>
                              ) 
                            }
                          ]}
                          variant="underline"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4 bg-muted/50">
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded p-2 w-full overflow-auto">
                      {`<ShadcnTabs 
  tabs={[
    { value: 'profile', label: 'Profil', content: <ProfileContent /> },
    { value: 'security', label: 'Sécurité', content: <SecurityContent /> }
  ]}
  defaultValue="profile" 
  onValueChange={setActiveTab} 
  variant="underline"
/>`}
                    </code>
                  </CardFooter>
                </Card>
              </div>
            )
          },
          {
            value: 'dropdown',
            label: 'Dropdown',
            content: (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dropdown Menus</CardTitle>
                    <CardDescription>
                      Menus déroulants pour les actions et options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-8">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <ShadcnButton>Ouvrir Menu</ShadcnButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Mon Profil</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                              <path d="M10 2c1 .5 2 2 2 5"></path>
                            </svg>
                            <span>Paramètres</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16 17 21 12 16 7"></polyline>
                              <line x1="21" x2="9" y1="12" y2="12"></line>
                            </svg>
                            <span>Déconnexion</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4 bg-muted/50">
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded p-2 w-full overflow-auto">
                      {`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <ShadcnButton>Ouvrir Menu</ShadcnButton>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Mon Profil</DropdownMenuItem>
    <DropdownMenuItem>Paramètres</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Déconnexion</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
                    </code>
                  </CardFooter>
                </Card>
              </div>
            )
          },
          {
            value: 'toast',
            label: 'Toast',
            content: (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Toast Notifications</CardTitle>
                    <CardDescription>
                      Notifications toast pour informer l'utilisateur.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-8">
                    <div className="flex flex-wrap gap-4 justify-center">
                      <ShadcnButton
                        onClick={() => toast({
                          title: "Succès!",
                          description: "L'action a été effectuée avec succès.",
                        })}
                      >
                        Toast de succès
                      </ShadcnButton>
                      
                      <ShadcnButton
                        variant="destructive"
                        onClick={() => toast({
                          title: "Erreur!",
                          description: "Une erreur s'est produite lors de l'action.",
                          variant: "destructive",
                        })}
                      >
                        Toast d'erreur
                      </ShadcnButton>
                      
                      <ShadcnButton
                        variant="outline"
                        onClick={() => toast({
                          title: "Information",
                          description: "Voici quelques informations importantes.",
                        })}
                      >
                        Toast d'information
                      </ShadcnButton>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4 bg-muted/50">
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded p-2 w-full overflow-auto">
                      {`// Importer le hook
const { toast } = useToast();

// Utiliser dans un gestionnaire d'événements
toast({
  title: "Titre de la notification",
  description: "Description détaillée de la notification.",
  variant: "default | destructive",
})`}
                    </code>
                  </CardFooter>
                </Card>
              </div>
            )
          }
        ]}
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        variant="underline"
      />
    </div>
  );
};

export default ShadcnDemo;
