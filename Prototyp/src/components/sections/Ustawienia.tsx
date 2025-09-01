import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react";
import {
  DashboardCard,
  ActionButton,
  ConstructorContainer,
  ConstructorSection,
  ConstructorGrid,
  ConstructorFlex
} from "../ui-kit";

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
    <ConstructorContainer size="xl" padding="lg" className="w-full">
      <ConstructorSection
        title="Ustawienia"
        subtitle="Konfiguracja systemu i preferencji użytkownika"
        spacing="lg"
      >

        <ConstructorGrid cols={4} gap="lg">
          <div>
            <DashboardCard
              title="Kategorie"
              subtitle="Wybierz sekcję do konfiguracji"
              icon={<Settings className="w-5 h-5" />}
            >
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
            </DashboardCard>
          </div>

          <div className="xl:col-span-3 space-y-6">
            <DashboardCard
              title="Profil użytkownika"
              subtitle="Zarządzaj swoimi danymi osobowymi"
              icon={<User className="w-5 h-5" />}
            >
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

              <ActionButton action="save" size="md">
                Zapisz zmiany
              </ActionButton>
            </DashboardCard>

            <DashboardCard
              title="Powiadomienia"
              subtitle="Konfiguruj preferencje powiadomień"
              icon={<Bell className="w-5 h-5" />}
            >
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
            </DashboardCard>

            <DashboardCard
              title="Bezpieczeństwo"
              subtitle="Ustawienia bezpieczeństwa i hasła"
              icon={<Shield className="w-5 h-5" />}
            >
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
                <ActionButton action="secondary" size="sm">
                  Konfiguruj
                </ActionButton>
              </div>

              <ActionButton action="save" size="md">
                Zmień hasło
              </ActionButton>
            </DashboardCard>
          </div>
        </ConstructorGrid>
      </ConstructorSection>
    </ConstructorContainer>
  );
}