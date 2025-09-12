import type { Project } from '../../types/projects.types'
import { PROJECT_MODULES } from '../../types/enums'

// Realne projekty meblarskie/dekoracyjne z prawdziwymi danymi
export const realProjects: Project[] = [
    {
        id: 'proj-2024-restaurant-loft',
        numer: 'FB-2024/11/01',
        name: 'Restauracja "Industrial Loft" - Warszawa',
        typ: 'Event' as any,
        lokalizacja: 'Warszawa, ul. Piotrkowska 157',
        clientId: 'client-restaurant-group',
        client: 'Warsaw Restaurant Group Sp. z o.o.',
        status: 'active' as any,
        data_utworzenia: '2024-11-15',
        deadline: '2025-01-20',
        postep: 65,
        modules: [PROJECT_MODULES.CONCEPT, PROJECT_MODULES.TECHNICAL_DESIGN, PROJECT_MODULES.MATERIALS, PROJECT_MODULES.PRODUCTION, PROJECT_MODULES.LOGISTICS_ASSEMBLY, PROJECT_MODULES.PRICING, PROJECT_MODULES.MODEL_3D],
        link_model_3d: 'https://speckle.xyz/streams/3ed8357f29/commits/604bea8cc6',
        groups: [
            {
                id: 'group-bar-area',
                name: 'Strefa Barowa',
                description: 'Lady barowe, regały na alkohole, oświetlenie',
                thumbnail: '',
                files: []
            },
            {
                id: 'group-dining-area',
                name: 'Strefa Jadalna',
                description: 'Stoły, krzesła, dekoracje ścienne',
                thumbnail: '',
                files: []
            }
        ]
    },
    {
        id: 'proj-2024-office-modern',
        numer: 'FB-2024/10/15',
        name: 'Biuro "Tech Hub" - Kraków',
        typ: 'Event' as any,
        lokalizacja: 'Kraków, Rondo Mogilskie 1',
        clientId: 'client-tech-startup',
        client: 'InnovateTech Solutions Sp. z o.o.',
        status: 'Zakończony',
        data_utworzenia: '2024-10-15',
        deadline: '2024-12-10',
        postep: 100,
        modules: [PROJECT_MODULES.TECHNICAL_DESIGN, PROJECT_MODULES.MATERIALS, PROJECT_MODULES.PRODUCTION, PROJECT_MODULES.LOGISTICS_ASSEMBLY, PROJECT_MODULES.PRICING, PROJECT_MODULES.ACCOMMODATION, PROJECT_MODULES.MODEL_3D],
        link_model_3d: 'https://speckle.xyz/streams/4f2b1a8e17/commits/891def2b45',
        groups: [
            {
                id: 'group-reception',
                name: 'Recepcja',
                description: 'Biurko recepcyjne, ściana z logo, oświetlenie',
                thumbnail: '',
                files: []
            },
            {
                id: 'group-openspace',
                name: 'Open Space',
                description: 'Biurka modułowe, separatory, szafy',
                thumbnail: '',
                files: []
            },
            {
                id: 'group-conference',
                name: 'Sale Konferencyjne',
                description: 'Stoły konferencyjne, krzesła, meble AV',
                thumbnail: '',
                files: []
            }
        ]
    },
    {
        id: 'proj-2024-apartment-luxury',
        numer: 'FB-2024/12/03',
        name: 'Apartament Luxury - Gdańsk',
        typ: 'Event' as any,
        lokalizacja: 'Gdańsk, Marina Residence',
        clientId: 'client-luxury-investor',
        client: 'Premium Living Investments',
        status: 'Nowy',
        data_utworzenia: '2024-12-03',
        deadline: '2025-03-15',
        postep: 15,
        modules: [PROJECT_MODULES.CONCEPT, PROJECT_MODULES.TECHNICAL_DESIGN, PROJECT_MODULES.MATERIALS, PROJECT_MODULES.PRICING, PROJECT_MODULES.MODEL_3D],
        groups: [
            {
                id: 'group-living-room',
                name: 'Salon',
                description: 'Meble wypoczynkowe, ściana TV, kominek',
                thumbnail: '',
                files: []
            },
            {
                id: 'group-kitchen',
                name: 'Kuchnia',
                description: 'Zabudowa kuchenna, wyspa, sprzęt AGD',
                thumbnail: '',
                files: []
            },
            {
                id: 'group-master-bedroom',
                name: 'Sypialnia Główna',
                description: 'Szafa wnękowa, łóżko tapicerowane, toaletka',
                thumbnail: '',
                files: []
            }
        ]
    },
    {
        id: 'proj-2024-hotel-boutique',
        numer: 'FB-2024/11/28',
        name: 'Hotel Boutique "Old Town" - Wrocław',
        typ: 'Event' as any,
        lokalizacja: 'Wrocław, Stare Miasto',
        clientId: 'client-boutique-hotels',
        client: 'Boutique Hotels Network Sp. z o.o.',
        status: 'new' as any,
        data_utworzenia: '2024-11-28',
        deadline: '2025-04-30',
        postep: 5,
        modules: [PROJECT_MODULES.CONCEPT, PROJECT_MODULES.TECHNICAL_DESIGN, PROJECT_MODULES.MODEL_3D],
        groups: [
            {
                id: 'group-lobby',
                name: 'Lobby',
                description: 'Recepcja, strefa lobby, dekoracje',
                thumbnail: '',
                files: []
            },
            {
                id: 'group-rooms',
                name: 'Pokoje Hotelowe',
                description: 'Meble do 25 pokoi, łazienki, dekoracje',
                thumbnail: '',
                files: []
            },
            {
                id: 'group-restaurant',
                name: 'Restauracja Hotelowa',
                description: 'Wyposażenie restauracji dla 80 osób',
                thumbnail: '',
                files: []
            }
        ]
    },
    {
        id: 'proj-2024-retail-fashion',
        numer: 'FB-2024/12/01',
        name: 'Salon Mody "Elegance" - Poznań',
        typ: 'Retail',
        lokalizacja: 'Poznań, Galeria Malta',
        clientId: 'client-fashion-chain',
        client: 'Elegance Fashion Chain S.A.',
        status: 'active' as any,
        data_utworzenia: '2024-12-01',
        deadline: '2025-02-14',
        postep: 35,
        modules: [PROJECT_MODULES.CONCEPT, PROJECT_MODULES.TECHNICAL_DESIGN, PROJECT_MODULES.MATERIALS, PROJECT_MODULES.PRODUCTION, PROJECT_MODULES.PRICING, PROJECT_MODULES.MODEL_3D],
        groups: [
            {
                id: 'group-storefront',
                name: 'Witryna',
                description: 'Ekspozytory witrynowe, oświetlenie LED',
                thumbnail: '',
                files: []
            },
            {
                id: 'group-interior',
                name: 'Wnętrze Sklepu',
                description: 'Wieszaki, lady kasowe, kabiny przymierzalni',
                thumbnail: '',
                files: []
            }
        ]
    },
    {
        id: 'proj-2024-clinic-medical',
        numer: 'FB-2024/11/22',
        name: 'Klinika Medyczna "MediCare" - Łódź',
        typ: 'Event' as any,
        lokalizacja: 'Łódź, ul. Piotrkowska 280',
        clientId: 'client-medicare-clinic',
        client: 'MediCare Prywatna Klinika Sp. z o.o.',
        status: 'active' as any,
        data_utworzenia: '2024-11-22',
        deadline: '2025-01-31',
        postep: 45,
        modules: [PROJECT_MODULES.CONCEPT, PROJECT_MODULES.TECHNICAL_DESIGN, PROJECT_MODULES.MATERIALS, PROJECT_MODULES.PRODUCTION, PROJECT_MODULES.LOGISTICS_ASSEMBLY, PROJECT_MODULES.PRICING, PROJECT_MODULES.MODEL_3D],
        groups: [
            {
                id: 'group-reception-medical',
                name: 'Recepcja',
                description: 'Biurko recepcyjne, poczekalnia, info-kiosk',
                thumbnail: '',
                files: []
            },
            {
                id: 'group-treatment-rooms',
                name: 'Gabinety',
                description: 'Meble medyczne do 8 gabinetów',
                thumbnail: '',
                files: []
            },
            {
                id: 'group-lab',
                name: 'Laboratorium',
                description: 'Specjalistyczne meble laboratoryjne',
                thumbnail: '',
                files: []
            }
        ]
    }
]
