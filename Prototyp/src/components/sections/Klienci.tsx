import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Plus, Search, Phone, Mail, Building, Edit, Eye, MoreHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  DashboardCard,
  StatusBadge,
  ActionButton,
  ConstructorContainer,
  ConstructorSection,
  ConstructorFlex
} from "../ui-kit";

export function Klienci() {
  const clients = [
    {
      id: "C-001",
      name: "ABC Corporation",
      nip: "123-456-78-90",
      contact: "Jan Kowalski",
      email: "jan.kowalski@abc-corp.com",
      phone: "+48 123 456 789",
      status: "Aktywny",
      projects: 3,
      value: "450,000 PLN",
      lastContact: "2024-01-20",
      address: "ul. Przemysłowa 15, Warszawa"
    },
    {
      id: "C-002",
      name: "XYZ Manufacturing",
      nip: "987-654-32-10",
      contact: "Anna Nowak",
      email: "a.nowak@xyz-mfg.com",
      phone: "+48 234 567 890",
      status: "Potencjalny",
      projects: 1,
      value: "120,000 PLN",
      lastContact: "2024-01-18",
      address: "ul. Fabryczna 8, Kraków"
    },
    {
      id: "C-003",
      name: "Tech Solutions Ltd",
      nip: "456-789-12-34",
      contact: "Piotr Wiśniewski",
      email: "p.wisniewski@techsol.com",
      phone: "+48 345 678 901",
      status: "Nieaktywny",
      projects: 0,
      value: "0 PLN",
      lastContact: "2023-12-15",
      address: "ul. Technologiczna 22, Gdańsk"
    },
    {
      id: "C-004",
      name: "MediaCorp",
      nip: "321-654-98-76",
      contact: "Katarzyna Zielińska",
      email: "k.zielinska@mediacorp.pl",
      phone: "+48 456 789 012",
      status: "Aktywny",
      projects: 2,
      value: "850,000 PLN",
      lastContact: "2024-01-22",
      address: "al. Mediowa 5, Warszawa"
    },
    {
      id: "C-005",
      name: "Industrial Partners",
      nip: "789-123-45-67",
      contact: "Marek Kowalczyk",
      email: "m.kowalczyk@industrial.com",
      phone: "+48 567 890 123",
      status: "Potencjalny",
      projects: 0,
      value: "0 PLN",
      lastContact: "2024-01-15",
      address: "ul. Przemysłowa 45, Wrocław"
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <ConstructorContainer size="xl" padding="lg" className="w-full">
      <ConstructorSection
        title="Klienci (CRM)"
        subtitle="Zarządzaj relacjami z klientami i kontaktami biznesowymi"
        spacing="lg"
      >
        {/* Header */}
        <ConstructorFlex direction="row" justify="end" align="center" gap="md">
          <ActionButton action="add" size="md">
            Nowy Klient
          </ActionButton>
        </ConstructorFlex>

        <DashboardCard
          title="Baza Klientów"
          subtitle="Wszyscy klienci i kontakty biznesowe"
          icon={<Building className="w-5 h-5" />}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj klientów..."
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nazwa Klienta</TableHead>
                    <TableHead>NIP</TableHead>
                    <TableHead>Osoba Kontaktowa</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Liczba Projektów</TableHead>
                    <TableHead>Wartość</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ostatni kontakt</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {getInitials(client.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{client.nip}</span>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[150px]">
                          <p className="font-medium truncate">{client.contact}</p>
                          <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">{client.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="text-lg font-semibold">{client.projects}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{client.value}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={client.status} size="sm" />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{client.lastContact}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Szczegóły
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edytuj
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Zadzwoń
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Wyślij email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DashboardCard>
      </ConstructorSection>
    </ConstructorContainer>
  );
}