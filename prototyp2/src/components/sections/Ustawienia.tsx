import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react";

export function Ustawienia() {
  const sections = [
    {
      id: "profile",
      title: "Profil użytkownika",
      icon: User,
      description: "Zarządzaj swoimi danymi osobowymi"
    },
    {
      id: "notifications",
      title: "Powiadomienia",
      icon: Bell,
      description: "Konfiguruj preferencje powiadomień"
    },
    {
      id: "security",
      title: "Bezpieczeństwo",
      icon: Shield,
      description: "Ustawienia bezpieczeństwa i hasła"
    },
    {
      id: "system",
      title: "System",
      icon: Database,
      description: "Konfiguracja systemu i integracje"
    },
    {
      id: "appearance",
      title: "Wygląd",
      icon: Palette,
      description: "Personalizacja interfejsu"
    }
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Ustawienia</h1>
        <p className="text-muted-foreground">
          Konfiguracja systemu i preferencji użytkownika
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kategorie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-auto p-3"
                >
                  <section.icon className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-medium">{section.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profil użytkownika
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    KA
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Zmień zdjęcie
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG lub GIF. Max 2MB.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Imię</Label>
                  <Input id="firstName" defaultValue="Kamil" />
                </div>
                <div>
                  <Label htmlFor="lastName">Nazwisko</Label>
                  <Input id="lastName" defaultValue="Arndt" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="k.arndt@fabryka.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" defaultValue="+48 123 456 789" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="position">Stanowisko</Label>
                <Input id="position" defaultValue="Manager Produkcji" />
              </div>
              
              <Button>Zapisz zmiany</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Powiadomienia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Powiadomienia email</p>
                    <p className="text-sm text-muted-foreground">
                      Otrzymuj powiadomienia na adres email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Awarie maszyn</p>
                    <p className="text-sm text-muted-foreground">
                      Natychmiastowe powiadomienia o awariach
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Zakończenie zleceń</p>
                    <p className="text-sm text-muted-foreground">
                      Powiadomienia o ukończonych zadaniach
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Niski stan magazynowy</p>
                    <p className="text-sm text-muted-foreground">
                      Alerty o niskich stanach magazynowych
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Raporty tygodniowe</p>
                    <p className="text-sm text-muted-foreground">
                      Automatyczne raporty co tydzień
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Bezpieczeństwo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Aktualne hasło</Label>
                <Input id="currentPassword" type="password" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">Nowe hasło</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Uwierzytelnianie dwuskładnikowe</p>
                  <p className="text-sm text-muted-foreground">
                    Dodatkowa warstwa bezpieczeństwa
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Konfiguruj
                </Button>
              </div>
              
              <Button>Zmień hasło</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}