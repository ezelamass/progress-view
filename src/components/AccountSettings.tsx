import { Monitor, Moon, Sun, Globe, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

interface AccountSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountSettings = ({ open, onOpenChange }: AccountSettingsProps) => {
  const { theme, language, setTheme, setLanguage } = useTheme();

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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettings;