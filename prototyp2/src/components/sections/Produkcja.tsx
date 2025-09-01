import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Factory, Users, Clock, TrendingUp } from "lucide-react";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktywna": return "bg-green-100 text-green-800";
      case "Konserwacja": return "bg-red-100 text-red-800";
      case "Planowana": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Produkcja</h1>
          <p className="text-muted-foreground">
            Monitoring linii produkcyjnych i zarządzanie zleceniami
          </p>
        </div>
        <Button size="sm">
          <Factory className="w-4 h-4 mr-2" />
          Nowe zlecenie
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Aktywne linie</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-sm text-muted-foreground">Pracownicy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">279</p>
                <p className="text-sm text-muted-foreground">Wyprodukowano dziś</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-muted-foreground">Wydajność</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Linie produkcyjne</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {productionLines.map((line) => (
                <div key={line.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{line.name}</h3>
                      <p className="text-sm text-muted-foreground">{line.id}</p>
                    </div>
                    <Badge className={getStatusColor(line.status)}>
                      {line.status}
                    </Badge>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Zmiany robocze</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {shifts.map((shift, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{shift.name}</h4>
                    <Badge className={getStatusColor(shift.status)} size="sm">
                      {shift.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{shift.time}</p>
                  <p className="text-sm">Pracownicy: {shift.workers}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktywne zlecenia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{order.product}</h4>
                    <Badge variant="outline" size="sm">
                      {order.priority}
                    </Badge>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}