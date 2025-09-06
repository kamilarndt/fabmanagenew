// Types for client data based on JSON structure

export interface ClientData {
    logotyp: string;
    nazwa_firmy: string;
    nip: string;
    regon: string;
    ulica: string;
    numer_domu: string;
    numer_lokalu: string;
    kod_pocztowy: string;
    miasto: string;
    adres_strony: string;
    mail_firmowy: string;
    opis_firmy: string;
}

export interface ContactPerson {
    imie: string;
    nazwisko: string;
    adres_email: string;
    telefon_kontaktowy: string;
    opis: string;
}

export interface ClientContactData {
    osoba_1: ContactPerson;
    osoba_2: ContactPerson;
}

export interface AdditionalInfo {
    opis: string;
    pliki: string;
}

export interface FullClientData {
    id: string;
    step_1_dane_firmy: ClientData;
    step_2_dane_kontaktowe: ClientContactData;
    step_3_dodatkowe_informacje: AdditionalInfo;
}

// Project data types
export interface ProjectModules {
    wycena: boolean;
    koncepcja: boolean;
    produkcja: boolean;
    zamowienia: boolean;
    logistyka: boolean;
}

export interface ProjectElements {
    ilosc: number;
    [key: string]: any; // for element_1_nazwa, element_2_nazwa, etc.
}

export interface ProjectMaterials {
    [key: string]: string; // for plik_1_nazwa, plik_2_nazwa, etc.
}

export interface ProjectGeneralData {
    klient: string;
    nazwa_projektu: string;
    miejsce_zlecenia: string;
    data_przyjecia: string;
    deadline: string;
}

export interface FullProjectData {
    id: string;
    dane_ogolne: ProjectGeneralData;
    moduly: ProjectModules;
    elementy: ProjectElements;
    materialy_od_klienta: ProjectMaterials;
}

// Processed types for use in components
export interface ProcessedClient {
    id: string;
    companyName: string;
    logoUrl?: string;
    nip: string;
    regon: string;
    address: {
        street: string;
        houseNumber: string;
        apartmentNumber?: string;
        postalCode: string;
        city: string;
    };
    website: string;
    email: string;
    description: string;
    contacts: ContactPerson[];
    additionalInfo: string;
    files: string[];
    // Legacy compatibility properties
    status?: 'Active' | 'Inactive' | 'Pending';
    segment?: 'Mały' | 'Średni' | 'Duży';
    cardColor?: string;
}

export interface ProcessedProject {
    id: string;
    clientName: string;
    projectName: string;
    location: string;
    dateReceived: string;
    deadline: string;
    modules: ProjectModules;
    elementsCount: number;
    elements: string[];
    materialFiles: string[];
}
