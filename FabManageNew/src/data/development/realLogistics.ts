// Realne dane logistyczne dla projektów
export const realLogisticsData = {
    routePlanning: [
        // Projekt: Restauracja Industrial Loft
        {
            id: 'route-restaurant-1',
            projectId: 'proj-2024-restaurant-loft',
            fromLocation: 'Fabryka Dekoracji - Warszawa',
            toLocation: 'Restauracja Industrial Loft - ul. Piotrkowska 157',
            distance: 45,
            estimatedTime: 90,
            vehicleType: 'Sprinter 3.5T',
            driver: 'Jan Kowalczyk',
            plannedDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // za tydzień
            status: 'planned' as const,
            notes: 'Transport lady barowych - delikatny załadunek'
        },
        {
            id: 'route-restaurant-2',
            projectId: 'proj-2024-restaurant-loft',
            fromLocation: 'Fabryka Dekoracji - Warszawa',
            toLocation: 'Restauracja Industrial Loft - ul. Piotrkowska 157',
            distance: 45,
            estimatedTime: 90,
            vehicleType: 'Sprinter 3.5T',
            driver: 'Marek Nowak',
            plannedDate: Date.now() + 14 * 24 * 60 * 60 * 1000, // za 2 tygodnie
            status: 'planned' as const,
            notes: 'Transport stołów restauracyjnych'
        },

        // Projekt: Tech Hub Kraków
        {
            id: 'route-office-1',
            projectId: 'proj-2024-office-modern',
            fromLocation: 'Fabryka Dekoracji - Warszawa',
            toLocation: 'Tech Hub - Rondo Mogilskie 1, Kraków',
            distance: 295,
            estimatedTime: 380,
            vehicleType: 'TIR 18T',
            driver: 'Piotr Zieliński',
            plannedDate: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 dni temu
            status: 'completed' as const,
            actualDeparture: Date.now() - 10 * 24 * 60 * 60 * 1000,
            actualArrival: Date.now() - 10 * 24 * 60 * 60 * 1000 + 360 * 60 * 1000,
            notes: 'Transport recepcji i mebli biurowych - projekt zakończony'
        },

        // Projekt: Klinika MediCare
        {
            id: 'route-clinic-1',
            projectId: 'proj-2024-clinic-medical',
            fromLocation: 'Fabryka Dekoracji - Warszawa',
            toLocation: 'Klinika MediCare - ul. Piotrkowska 280, Łódź',
            distance: 135,
            estimatedTime: 180,
            vehicleType: 'Sprinter 3.5T',
            driver: 'Tomasz Wiśniewski',
            plannedDate: Date.now() + 21 * 24 * 60 * 60 * 1000, // za 3 tygodnie
            status: 'planned' as const,
            notes: 'Transport szafek medycznych - wymagane ubezpieczenie'
        }
    ],

    packingLists: [
        {
            id: 'pack-restaurant-bar',
            projectId: 'proj-2024-restaurant-loft',
            itemName: 'Lady Barowe + Regały',
            quantity: 3,
            unit: 'kpl',
            packedBy: 'Zespół Pakowania A',
            packedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 dni temu
            status: 'packed' as const,
            notes: 'Zawinięte w folię + pianką ochronną'
        },
        {
            id: 'pack-office-reception',
            projectId: 'proj-2024-office-modern',
            itemName: 'Recepcja + Elementy LED',
            quantity: 1,
            unit: 'kpl',
            packedBy: 'Zespół Pakowania B',
            packedAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 dni temu
            status: 'delivered' as const,
            notes: 'Dostarczone i zamontowane'
        }
    ]
}

export const realAccommodationData = {
    // Dla projektów wymagających zakwaterowania zespołu montażowego
    'proj-2024-office-modern': [
        {
            id: 'acc-tech-hub-krakow',
            projectId: 'proj-2024-office-modern',
            hotelName: 'Hotel Europejski Kraków',
            address: 'ul. Lubicz 5, 31-503 Kraków',
            fromDate: '2024-11-28',
            toDate: '2024-11-30',
            cost: 1200, // 2 dni x 3 osoby x 200 PLN
            notes: 'Zakwaterowanie dla 3-osobowego zespołu montażowego'
        }
    ],

    'proj-2024-hotel-boutique': [
        {
            id: 'acc-hotel-boutique-wroclaw',
            projectId: 'proj-2024-hotel-boutique',
            hotelName: 'Hotel Monopol Wrocław',
            address: 'ul. Modrzejowska 2, 50-066 Wrocław',
            fromDate: '2025-03-15',
            toDate: '2025-03-20',
            cost: 2500, // 5 dni x 2 osoby x 250 PLN
            notes: 'Planowane zakwaterowanie dla zespołu projektowego i montażowego'
        }
    ]
}
