import type { ProcessedClient } from '../../types/clientData.types'

// Realni klienci odpowiadający projektom - uproszczona wersja
export const realClients: ProcessedClient[] = [
    {
        id: 'client-restaurant-group',
        companyName: 'Warsaw Restaurant Group Sp. z o.o.',
        nip: '1234567890',
        regon: '123456789',
        address: {
            street: 'ul. Marszałkowska',
            houseNumber: '15',
            postalCode: '00-626',
            city: 'Warszawa'
        },
        website: 'https://warsawrestaurants.pl',
        email: 'michal.kowalski@warsawrestaurants.pl',
        description: 'Sieć restauracji premium w Warszawie. Planują otwarcie 3 kolejnych lokali w 2025.',
        contacts: [
            {
                imie: 'Michał',
                nazwisko: 'Kowalski',
                adres_email: 'michal.kowalski@warsawrestaurants.pl',
                telefon_kontaktowy: '+48 22 555 0123',
                opis: 'Dyrektor Generalny'
            }
        ],
        additionalInfo: 'Gastronomia - segment premium',
        files: [],
        status: 'Active',
        segment: 'Duży',
        cardColor: '#ff7f50'
    },
    {
        id: 'client-tech-startup',
        companyName: 'InnovateTech Solutions Sp. z o.o.',
        nip: '9876543210',
        regon: '987654321',
        address: {
            street: 'Rondo Mogilskie',
            houseNumber: '1',
            postalCode: '31-516',
            city: 'Kraków'
        },
        website: 'https://innovatetech.io',
        email: 'anna.nowak@innovatetech.io',
        description: 'Startup technologiczny rozwijający AI. Szybko rosnąca firma, planują kolejne biura.',
        contacts: [
            {
                imie: 'Anna',
                nazwisko: 'Nowak',
                adres_email: 'anna.nowak@innovatetech.io',
                telefon_kontaktowy: '+48 12 777 8899',
                opis: 'CTO'
            }
        ],
        additionalInfo: 'IT/Technologie - startup',
        files: [],
        status: 'Active',
        segment: 'Średni',
        cardColor: '#4169e1'
    },
    {
        id: 'client-luxury-investor',
        companyName: 'Premium Living Investments',
        nip: '5555666777',
        regon: '555666777',
        address: {
            street: 'Marina Residence',
            houseNumber: '1',
            postalCode: '80-718',
            city: 'Gdańsk'
        },
        website: 'https://premiumliving.pl',
        email: 'robert.wisniewski@premiumliving.pl',
        description: 'Inwestor w nieruchomości premium. Portfolio apartamentów luksusowych nad morzem.',
        contacts: [
            {
                imie: 'Robert',
                nazwisko: 'Wiśniewski',
                adres_email: 'robert.wisniewski@premiumliving.pl',
                telefon_kontaktowy: '+48 58 333 4455',
                opis: 'Investor Relations Manager'
            }
        ],
        additionalInfo: 'Nieruchomości Luxury',
        files: [],
        status: 'Active',
        segment: 'Duży',
        cardColor: '#ffd700'
    },
    {
        id: 'client-boutique-hotels',
        companyName: 'Boutique Hotels Network Sp. z o.o.',
        nip: '1111222333',
        regon: '111222333',
        address: {
            street: 'ul. Świdnicka',
            houseNumber: '20',
            postalCode: '50-068',
            city: 'Wrocław'
        },
        website: 'https://boutiquehotels.eu',
        email: 'katarzyna.zielinska@boutiquehotels.eu',
        description: 'Sieć hoteli boutique w zabytkowych budynkach. Ciekawy projekt w centrum Wrocławia.',
        contacts: [
            {
                imie: 'Katarzyna',
                nazwisko: 'Zielińska',
                adres_email: 'katarzyna.zielinska@boutiquehotels.eu',
                telefon_kontaktowy: '+48 71 999 1122',
                opis: 'Project Manager'
            }
        ],
        additionalInfo: 'Hotelarstwo',
        files: [],
        status: 'Pending',
        segment: 'Duży',
        cardColor: '#da70d6'
    },
    {
        id: 'client-fashion-chain',
        companyName: 'Elegance Fashion Chain S.A.',
        nip: '4444555666',
        regon: '444555666',
        address: {
            street: 'ul. Półwiejska',
            houseNumber: '42',
            postalCode: '61-888',
            city: 'Poznań'
        },
        website: 'https://elegancefashion.com',
        email: 'tomasz.adamski@elegancefashion.com',
        description: 'Sieć sklepów z modą premium. Planują ekspansję do 5 miast w Polsce.',
        contacts: [
            {
                imie: 'Tomasz',
                nazwisko: 'Adamski',
                adres_email: 'tomasz.adamski@elegancefashion.com',
                telefon_kontaktowy: '+48 61 444 7788',
                opis: 'Retail Operations Director'
            }
        ],
        additionalInfo: 'Retail/Moda',
        files: [],
        status: 'Active',
        segment: 'Średni',
        cardColor: '#ff1493'
    },
    {
        id: 'client-medicare-clinic',
        companyName: 'MediCare Prywatna Klinika Sp. z o.o.',
        nip: '7777888999',
        regon: '777888999',
        address: {
            street: 'ul. Piotrkowska',
            houseNumber: '280',
            postalCode: '90-361',
            city: 'Łódź'
        },
        website: 'https://medicare-clinic.pl',
        email: 'agnieszka.kowal@medicare-clinic.pl',
        description: 'Prywatna klinika wielospecjalistyczna. Wysokie standardy, focus na jakość.',
        contacts: [
            {
                imie: 'Agnieszka',
                nazwisko: 'Kowal',
                adres_email: 'agnieszka.kowal@medicare-clinic.pl',
                telefon_kontaktowy: '+48 42 666 9900',
                opis: 'Dr - Dyrektor Medyczny'
            }
        ],
        additionalInfo: 'Medycyna/Zdrowie',
        files: [],
        status: 'Active',
        segment: 'Średni',
        cardColor: '#32cd32'
    }
]