import { Monitor, Moon, Sun, Globe, Check, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

interface AccountSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountSettings = ({ open, onOpenChange }: AccountSettingsProps) => {
  const { theme, language, setTheme, setLanguage } = useTheme();
  const [showTutorial, setShowTutorial] = useState(false);

  const themes = [
    { value: 'dark', label: 'Dark', labelEs: 'Oscuro', icon: Moon },
    { value: 'light', label: 'Light', labelEs: 'Claro', icon: Sun },
  ];

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'es' ? 'Configuración de Cuenta' : 'Account Settings'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                {language === 'es' ? 'Tema' : 'Theme'}
              </CardTitle>
              <CardDescription className="text-sm">
                {language === 'es' 
                  ? 'Elige tu tema preferido' 
                  : 'Choose your preferred theme'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.value;
                return (
                  <Button
                    key={themeOption.value}
                    variant={isSelected ? "default" : "outline"}
                    className="w-full justify-start gap-2"
                    onClick={() => setTheme(themeOption.value as 'dark' | 'light')}
                  >
                    <Icon className="h-4 w-4" />
                    {language === 'es' ? themeOption.labelEs : themeOption.label}
                    {isSelected && <Check className="h-4 w-4 ml-auto" />}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {language === 'es' ? 'Idioma' : 'Language'}
              </CardTitle>
              <CardDescription className="text-sm">
                {language === 'es' 
                  ? 'Selecciona tu idioma preferido' 
                  : 'Select your preferred language'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {languages.map((langOption) => {
                const isSelected = language === langOption.value;
                return (
                  <Button
                    key={langOption.value}
                    variant={isSelected ? "default" : "outline"}
                    className="w-full justify-start gap-2"
                    onClick={() => setLanguage(langOption.value as 'en' | 'es')}
                  >
                    <span className="text-lg">{langOption.flag}</span>
                    {langOption.label}
                    {isSelected && <Check className="h-4 w-4 ml-auto" />}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Tutorial Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Play className="h-4 w-4" />
                {language === 'es' ? 'Tutorial' : 'Tutorial'}
              </CardTitle>
              <CardDescription className="text-sm">
                {language === 'es' 
                  ? 'Aprende a usar la plataforma' 
                  : 'Learn how to use the platform'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setShowTutorial(true)}
              >
                <Play className="h-4 w-4" />
                {language === 'es' ? 'Ver Tutorial' : 'View Tutorial'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>

      {/* Tutorial Video Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {language === 'es' ? 'Tutorial de la Plataforma' : 'Platform Tutorial'}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            {/* Video Tutorial Loom */}
            <iframe
              src="https://www.loom.com/embed/fa5dc15b0c4c4c549d110c3b23bbd6c2"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default AccountSettings;