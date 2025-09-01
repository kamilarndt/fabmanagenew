import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Package, Search, Plus, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import {
  DashboardCard,
  StatusBadge,
  ActionButton,
  ConstructorContainer,
  ConstructorSection,
  ConstructorGrid,
  ConstructorFlex
} from "../ui-kit";

export function Magazyn() {
  const inventory = [
    {
      id: "MAT-001",
      name: "Stal nierdzewna 316L",
      category: "Materiały",
      quantity: 250,
      unit: "kg",
      minStock: 100,
      maxStock: 500,
      location: "A-12",
      value: "12,500 PLN",
      lastMovement: "2024-01-22"
    },
    {
      id: "MAT-002",
      name: "Śruby M6x20",
      category: "Łączniki",
      quantity: 45,
      unit: "szt",
      minStock: 100,
      maxStock: 1000,
      location: "B-05",
      value: "180 PLN",
      lastMovement: "2024-01-21"
    },
    {
      id: "MAT-003",
      name: "Płyty aluminiowe 5mm",
      category: "Materiały",
      quantity: 85,
      unit: "m²",
      minStock: 50,
      maxStock: 200,
      location: "C-08",
      value: "3,400 PLN",
      lastMovement: "2024-01-20"
    }
  ];

  const movements = [
    {
      type: "Przyjęcie",
      item: "Stal nierdzewna 316L",
      quantity: "+50 kg",
      date: "2024-01-22 14:30",
      user: "Jan Kowalski"
    },
    {
      type: "Wydanie",
      item: "Śruby M6x20",
      quantity: "-200 szt",
      date: "2024-01-21 09:15",
      user: "Anna Nowak"
    },
    {
      type: "Przyjęcie",
      item: "Płyty aluminiowe 5mm",
      quantity: "+25 m²",
      date: "2024-01-20 11:45",
      user: "Piotr Zieliński"
    }
  ];

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity <= minStock) {
      return { color: "bg-red-100 text-red-800", label: "Niski stan", icon: AlertTriangle };
    } else if (quantity <= minStock * 1.5) {
      return { color: "bg-yellow-100 text-yellow-800", label: "Uwaga", icon: TrendingDown };
    } else {
      return { color: "bg-green-100 text-green-800", label: "OK", icon: TrendingUp };
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case "Przyjęcie": return "text-green-600";
      case "Wydanie": return "text-red-600";
      default: return "text-blue-600";
    }
  };

  return (
    <ConstructorContainer size="xl" padding="lg" className="w-full">
      <ConstructorSection
        title="Magazyn"
        subtitle="Zarządzanie stanami magazynowymi i ruchami towarów"
        spacing="lg"
      >
        {/* Header */}
        <ConstructorFlex direction="row" justify="between" align="center" gap="md">
          <ConstructorFlex direction="row" gap="md">
            <ActionButton action="secondary" size="md">
              Inwentaryzacja
            </ActionButton>
            <ActionButton action="add" size="md">
              Nowy towar
            </ActionButton>
          </ConstructorFlex>
        </ConstructorFlex>

        {/* Search */}
        <ConstructorFlex direction="row" justify="start" align="center" gap="md">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj towarów..."
              className="pl-10"
            />
          </div>
        </ConstructorFlex>

        <ConstructorGrid cols={3} gap="lg">
          <div className="xl:col-span-2">
            <DashboardCard
              title="Stan magazynu"
              subtitle="Aktualne stany magazynowe wszystkich towarów"
              icon={<Package className="w-5 h-5" />}
            >
              {inventory.map((item) => {
                const status = getStockStatus(item.quantity, item.minStock);
                const StatusIcon = status.icon;

                return (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.id} • {item.category} • Lokacja: {item.location}
                        </p>
                      </div>
                      <StatusBadge status={status.label} size="sm" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Stan aktualny</p>
                        <p className="font-semibold">{item.quantity} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min. stan</p>
                        <p className="font-semibold">{item.minStock} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wartość</p>
                        <p className="font-semibold">{item.value}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ostatni ruch</p>
                        <p className="font-semibold">{item.lastMovement}</p>
                      </div>
                    </div>

                    <ConstructorFlex direction="row" gap="sm" className="mt-3">
                      <ActionButton action="secondary" size="sm">
                        Przyjęcie
                      </ActionButton>
                      <ActionButton action="secondary" size="sm">
                        Wydanie
                      </ActionButton>
                      <ActionButton action="ghost" size="sm">
                        Historia
                      </ActionButton>
                    </ConstructorFlex>
                  </div>
                );
              })}
            </DashboardCard>
          </div>

          <div className="space-y-6">
            <DashboardCard
              title="Ostatnie ruchy"
              subtitle="Historia ruchów magazynowych"
              icon={<TrendingUp className="w-5 h-5" />}
            >
              {movements.map((movement, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${getMovementColor(movement.type)}`}>
                      {movement.type}
                    </span>
                    <span className={`text-sm font-semibold ${getMovementColor(movement.type)}`}>
                      {movement.quantity}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{movement.item}</p>
                  <p className="text-xs text-muted-foreground">
                    {movement.date} • {movement.user}
                  </p>
                </div>
              ))}
            </DashboardCard>

            <DashboardCard
              title="Statystyki"
              subtitle="Podsumowanie magazynu"
              icon={<TrendingUp className="w-5 h-5" />}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground">Pozycji w magazynie</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">23</div>
                <p className="text-sm text-muted-foreground">Niski stan magazynowy</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">567,890 PLN</div>
                <p className="text-sm text-muted-foreground">Łączna wartość</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Ruchy w tym miesiącu</p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Przyjęcia: 142</span>
                  <span className="text-red-600">Wydania: 189</span>
                </div>
              </div>
            </DashboardCard>
          </div>
        </ConstructorGrid>
      </ConstructorSection>
    </ConstructorContainer>
  );
}