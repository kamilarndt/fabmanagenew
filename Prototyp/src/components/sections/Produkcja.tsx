import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Factory, Users, Clock, TrendingUp } from "lucide-react";
import {
  DashboardCard,
  StatusBadge,
  PriorityBadge,
  ActionButton,
  ConstructorContainer,
  ConstructorSection,
  ConstructorGrid,
  ConstructorFlex
} from "../ui-kit";

export function Produkcja() {
  const productionLines = [
    {
      id: "LINIA-A",
      name: "Linia montażowa A",
      status: "Aktywna",
      currentProduct: "Obudowa Alpha",
      dailyTarget: 150,
      produced: 112,
      efficiency: 89,
      workers: 8,
      shift: "Pierwsza zmiana"
    },
    {
      id: "LINIA-B",
      name: "Linia montażowa B",
      status: "Konserwacja",
      currentProduct: "-",
      dailyTarget: 120,
      produced: 0,
      efficiency: 0,
      workers: 0,
      shift: "Przerwa techniczna"
    },
    {
      id: "LINIA-C",
      name: "Linia pakowania",
      status: "Aktywna",
      currentProduct: "Komponenty Beta",
      dailyTarget: 200,
      produced: 167,
      efficiency: 95,
      workers: 6,
      shift: "Pierwsza zmiana"
    }
  ];

  const shifts = [
    {
      name: "Pierwsza zmiana",
      time: "06:00 - 14:00",
      workers: 24,
      status: "Aktywna"
    },
    {
      name: "Druga zmiana",
      time: "14:00 - 22:00",
      workers: 18,
      status: "Planowana"
    },
    {
      name: "Trzecia zmiana",
      time: "22:00 - 06:00",
      workers: 12,
      status: "Planowana"
    }
  ];

  const orders = [
    {
      id: "ZP-001",
      product: "Obudowa Alpha",
      quantity: 500,
      completed: 342,
      deadline: "2024-02-15",
      priority: "Wysoki"
    },
    {
      id: "ZP-002",
      product: "Komponenty Beta",
      quantity: 800,
      completed: 156,
      deadline: "2024-03-01",
      priority: "Średni"
    }
  ];

  return (
    <ConstructorContainer size="xl" padding="lg" className="w-full">
      <ConstructorSection
        title="Produkcja"
        subtitle="Monitoring linii produkcyjnych i zarządzanie zleceniami"
        spacing="lg"
      >
        {/* Header */}
        <ConstructorFlex direction="row" justify="end" align="center" gap="md">
          <ActionButton action="add" size="md">
            Nowe zlecenie
          </ActionButton>
        </ConstructorFlex>

        <ConstructorGrid cols={4} gap="md">
          <DashboardCard
            title="3"
            subtitle="Aktywne linie"
            icon={<Factory className="w-5 h-5 text-blue-600" />}
          />
          <DashboardCard
            title="42"
            subtitle="Pracownicy"
            icon={<Users className="w-5 h-5 text-green-600" />}
          />
          <DashboardCard
            title="279"
            subtitle="Wyprodukowano dziś"
            icon={<Clock className="w-5 h-5 text-orange-600" />}
          />
          <DashboardCard
            title="87%"
            subtitle="Wydajność"
            icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
          />
        </ConstructorGrid>

        <ConstructorGrid cols={3} gap="lg">
          <div className="xl:col-span-2">
            <DashboardCard
              title="Linie produkcyjne"
              subtitle="Status i wydajność linii produkcyjnych"
              icon={<Factory className="w-5 h-5" />}
            >
              {productionLines.map((line) => (
                <div key={line.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{line.name}</h3>
                      <p className="text-sm text-muted-foreground">{line.id}</p>
                    </div>
                    <StatusBadge status={line.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Produkt</p>
                      <p className="font-medium">{line.currentProduct}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Zmiana</p>
                      <p className="font-medium">{line.shift}</p>
                    </div>
                  </div>

                  {line.status === "Aktywna" && (
                    <>
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Dzienny cel: {line.dailyTarget}</span>
                          <span>{line.produced} / {line.dailyTarget}</span>
                        </div>
                        <Progress value={(line.produced / line.dailyTarget) * 100} className="h-2" />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Wydajność: {line.efficiency}%</span>
                        <span>Pracownicy: {line.workers}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </DashboardCard>
          </div>

          <div className="space-y-6">
            <DashboardCard
              title="Zmiany robocze"
              subtitle="Harmonogram zmian produkcyjnych"
              icon={<Clock className="w-5 h-5" />}
            >
              {shifts.map((shift, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{shift.name}</h4>
                    <StatusBadge status={shift.status} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground">{shift.time}</p>
                  <p className="text-sm">Pracownicy: {shift.workers}</p>
                </div>
              ))}
            </DashboardCard>

            <DashboardCard
              title="Aktywne zlecenia"
              subtitle="Zlecenia produkcyjne w toku"
              icon={<TrendingUp className="w-5 h-5" />}
            >
              {orders.map((order) => (
                <div key={order.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{order.product}</h4>
                    <PriorityBadge priority={order.priority} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {order.id} • Termin: {order.deadline}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Postęp</span>
                      <span>{order.completed} / {order.quantity}</span>
                    </div>
                    <Progress value={(order.completed / order.quantity) * 100} className="h-1" />
                  </div>
                </div>
              ))}
            </DashboardCard>
          </div>
        </ConstructorGrid>
      </ConstructorSection>
    </ConstructorContainer>
  );
}