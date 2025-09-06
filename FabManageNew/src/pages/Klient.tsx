import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClientDataStore } from '../stores/clientDataStore';
import type { ProcessedClient, ProcessedProject } from '../types/clientData.types';

export default function Klient() {
    const { id } = useParams<{ id: string }>();
    const {
        getClientById,
        getProjectsByClient,
        loadData,
        loading
    } = useClientDataStore();

    const [client, setClient] = useState<ProcessedClient | null>(null);
    const [projects, setProjects] = useState<ProcessedProject[]>([]);
    const [activeTab, setActiveTab] = useState<'contacts' | 'projects' | 'invoices'>('contacts');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const loadClientData = async () => {
            if (!id) return;

            await loadData();
            const clientData = getClientById(id);
            if (clientData) {
                setClient(clientData);
                const clientProjects = getProjectsByClient(clientData.companyName);
                setProjects(clientProjects);
            }
        };

        loadClientData();
    }, [id, getClientById, getProjectsByClient, loadData]);

    if (loading || !client) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Ładowanie danych klienta...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white content-stretch flex items-start justify-start relative min-h-screen w-full">
            {/* Side Navigation */}
            <div className="bg-[#f8f8fc] box-border content-stretch flex flex-col gap-6 h-screen sticky top-0 items-start justify-start px-6 py-4 w-[280px] border-r border-[#cbcee1]">
                {/* Logo */}
                <div className="content-stretch flex gap-2 h-12 items-center justify-start overflow-clip relative shrink-0 w-full">
                    <div className="bg-black bg-center bg-cover bg-no-repeat shrink-0 size-12 rounded-lg"></div>
                    <div className="font-['Inter'] font-semibold text-[16px] text-black leading-[24px]">
                        Fabryka Dekoracji
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="basis-0 content-stretch flex flex-col gap-3 grow items-start justify-start min-h-px min-w-px relative shrink-0 w-full">
                    <Link to="/" className="box-border content-stretch flex gap-2 items-center justify-start px-0 py-1 relative shrink-0 w-full hover:bg-gray-100 rounded-lg">
                        <div className="basis-0 content-stretch flex gap-2 grow items-start justify-start min-h-px min-w-px relative shrink-0">
                            <div className="overflow-clip relative shrink-0 size-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                </svg>
                            </div>
                            <div className="basis-0 content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative shrink-0">
                                <div className="font-['Inter'] font-semibold text-[16px] text-[rgba(0,0,0,0.8)] leading-[24px] w-full">
                                    Home
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link to="/klienci" className="box-border content-stretch flex gap-2 items-center justify-start px-0 py-1 relative shrink-0 w-full bg-[rgba(79,70,229,0.1)] rounded-lg">
                        <div className="basis-0 content-stretch flex gap-2 grow items-start justify-start min-h-px min-w-px relative shrink-0">
                            <div className="overflow-clip relative shrink-0 size-6">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px relative shrink-0">
                                <div className="font-['Inter'] font-semibold text-[16px] text-indigo-600 leading-[24px] w-full">
                                    Klienci
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* User section at bottom */}
                <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0 w-full">
                    <div className="h-0 relative shrink-0 w-full border-t border-[#160d82]"></div>
                    <div className="box-border content-stretch flex gap-2 items-center justify-start px-0 py-1 relative shrink-0 w-full">
                        <div className="basis-0 content-stretch flex gap-2 grow items-start justify-start min-h-px min-w-px relative shrink-0">
                            <div className="bg-gray-300 relative rounded-full shrink-0 size-6"></div>
                            <div className="basis-0 content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative shrink-0">
                                <div className="font-['Inter'] font-semibold text-[16px] text-[#030217] leading-[24px] w-full">
                                    Marcin Pietuch
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="basis-0 content-stretch flex flex-col grow items-center justify-start min-h-px min-w-px relative shrink-0">
                {/* Header */}
                <div className="bg-[#f8f8fc] box-border content-stretch flex items-center justify-between px-8 py-2 relative shrink-0 w-full border-b border-[#cbcee1]">
                    {/* Breadcrumbs */}
                    <div className="content-stretch flex gap-1 items-center justify-start relative shrink-0">
                        <Link to="/" className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px] underline hover:text-indigo-600">
                            Home
                        </Link>
                        <div className="overflow-clip relative shrink-0 size-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <Link to="/klienci" className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px] underline hover:text-indigo-600">
                            Klienci
                        </Link>
                        <div className="overflow-clip relative shrink-0 size-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <span className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px]">
                            {client.companyName}
                        </span>
                    </div>

                    {/* Search */}
                    <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-[585px]">
                        <div className="bg-white relative rounded-lg shrink-0 w-full border border-[rgba(22,13,130,0.12)]">
                            <div className="box-border content-stretch flex gap-2 items-center justify-start overflow-clip pl-4 pr-0 py-0 relative w-full">
                                <div className="basis-0 font-['Inter'] font-normal grow leading-[24px] min-h-px min-w-px text-[#474b69] text-[16px] overflow-ellipsis overflow-hidden">
                                    Search...
                                </div>
                                <div className="box-border content-stretch flex gap-2 items-center justify-center p-3 relative rounded-lg shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="content-stretch flex gap-1 items-center justify-end relative shrink-0">
                        <div className="bg-[rgba(22,22,155,0.06)] box-border content-stretch flex gap-2 items-center justify-center p-3 relative rounded-full shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="bg-[rgba(22,22,155,0.06)] box-border content-stretch flex gap-2 items-center justify-center p-3 relative rounded-full shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="bg-[rgba(22,22,155,0.06)] box-border content-stretch flex gap-2 items-center justify-center p-3 relative rounded-full shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM5 12V7a5 5 0 1110 0v5l-5 5-5-5z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="box-border content-stretch flex flex-col gap-2.5 h-full items-center justify-start overflow-clip px-32 py-4 relative shrink-0 w-full">
                    {/* Page Header */}
                    <div className="box-border content-stretch flex gap-2.5 items-start justify-start px-0 py-4 relative shrink-0 w-full">
                        <Link
                            to="/klienci"
                            className="box-border content-stretch flex gap-2 items-center justify-center p-1 relative rounded-full shrink-0 hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start max-w-[640px] px-0 py-1 relative shrink-0 w-[640px]">
                            <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full">
                                <div className="font-['Inter'] font-semibold text-[20px] text-[#030217] leading-[24px] w-full">
                                    {client.companyName}
                                </div>
                                <div className="font-['Inter'] font-normal text-[12px] text-[#64698b] leading-[16px] w-full">
                                    Tutaj sprawdzisz szczegółowe informacje o swoim kliencie
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Layout */}
                    <div className="content-stretch flex gap-2.5 items-start justify-start relative shrink-0 w-full">
                        {/* Left Panel - Company Information */}
                        <div className="bg-[#f8f8fc] box-border content-stretch flex flex-col gap-4 items-start justify-start max-w-[400px] p-4 relative rounded-lg shrink-0 w-[350px]">
                            {/* Company Logo */}
                            <div className="aspect-[318/171] bg-center bg-cover bg-no-repeat shrink-0 w-full rounded-lg bg-gray-200 flex items-center justify-center">
                                {client.logoUrl ? (
                                    <img
                                        src={client.logoUrl}
                                        alt={`${client.companyName} logo`}
                                        className="w-full h-full object-contain rounded-lg"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <div className={`text-4xl font-bold text-gray-400 ${client.logoUrl ? 'hidden' : ''}`}>
                                    {client.companyName.substring(0, 2).toUpperCase()}
                                </div>
                            </div>

                            {/* Company Details Form */}
                            <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start px-1 py-0 relative shrink-0 w-full">

                                {/* Company Name */}
                                <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full">
                                    <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                        NAZWA FIRMY
                                    </div>
                                    <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis overflow-hidden">
                                            {client.companyName}
                                        </div>
                                    </div>
                                </div>

                                {/* NIP and REGON */}
                                <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full">
                                    <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-[148px]">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                            NIP
                                        </div>
                                        <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                            <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis overflow-hidden">
                                                {client.nip}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="basis-0 content-stretch flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                            REGON
                                        </div>
                                        <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                            <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis overflow-hidden">
                                                {client.regon}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="content-stretch flex gap-3 items-center justify-start relative shrink-0 w-full">
                                    <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                            ULICA
                                        </div>
                                        <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                            <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis overflow-hidden">
                                                {client.address.street}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                            NR DOMU
                                        </div>
                                        <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                            <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis overflow-hidden">
                                                {client.address.houseNumber}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                            NR LOKALU
                                        </div>
                                        <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                            <div className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px] overflow-ellipsis overflow-hidden">
                                                {client.address.apartmentNumber || '—'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Postal Code and City */}
                                <div className="content-stretch flex gap-2.5 items-center justify-start relative shrink-0 w-full">
                                    <div className="basis-0 content-stretch flex flex-col gap-1 grow items-start justify-start max-w-[250px] min-h-px min-w-px relative shrink-0">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                            KOD POCZTOWY
                                        </div>
                                        <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                            <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis overflow-hidden">
                                                {client.address.postalCode}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="basis-0 content-stretch flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                            MIASTO
                                        </div>
                                        <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                            <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis overflow-hidden">
                                                {client.address.city}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Website */}
                                <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full">
                                    <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                        ADRES STRONY
                                    </div>
                                    <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis overflow-hidden">
                                            {client.website}
                                        </div>
                                    </div>
                                </div>

                                {/* Company Email */}
                                <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full">
                                    <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                        MAIL FIRMOWY
                                    </div>
                                    <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis overflow-hidden">
                                            {client.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="content-stretch flex flex-col gap-1 h-[100px] items-start justify-start min-h-[100px] relative shrink-0 w-full">
                                    <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                        OPIS
                                    </div>
                                    <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis">
                                            {client.description}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full">
                                    <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                        Dodatkowe informacje
                                    </div>
                                    <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] overflow-ellipsis">
                                            {client.additionalInfo}
                                        </div>
                                    </div>
                                </div>

                                {/* Files */}
                                <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full">
                                    <div className="font-['Inter'] font-normal text-[12px] text-[rgba(1,9,65,0.61)] leading-[16px]">
                                        Dodatkowe Pliki
                                    </div>
                                    <div className="box-border content-stretch flex gap-1 items-start justify-start px-1 py-2 relative rounded-lg shrink-0 w-full">
                                        <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px]">
                                            {client.files.join(', ') || '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Tabs and Content */}
                        <div className="basis-0 content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative shrink-0">
                            {/* Tab Header */}
                            <div className="bg-white content-stretch flex items-center justify-between relative shrink-0 w-full">
                                <div className="content-stretch flex gap-1.5 items-center justify-start relative shrink-0">
                                    <button
                                        className={`box-border content-stretch flex flex-col gap-4 items-start justify-center px-4 py-3 relative shrink-0 ${activeTab === 'contacts' ? 'border-b-2 border-[#030217]' : ''
                                            }`}
                                        onClick={() => setActiveTab('contacts')}
                                    >
                                        <div className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px] text-center">
                                            Osoba Kontaktowa
                                        </div>
                                    </button>
                                    <button
                                        className={`box-border content-stretch flex flex-col gap-4 items-start justify-center px-4 py-3 relative shrink-0 ${activeTab === 'projects' ? 'border-b-2 border-[#030217]' : ''
                                            }`}
                                        onClick={() => setActiveTab('projects')}
                                    >
                                        <div className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px] text-center">
                                            Projekty
                                        </div>
                                    </button>
                                    <button
                                        className={`box-border content-stretch flex flex-col gap-4 items-start justify-center px-4 py-3 relative shrink-0 ${activeTab === 'invoices' ? 'border-b-2 border-[#030217]' : ''
                                            }`}
                                        onClick={() => setActiveTab('invoices')}
                                    >
                                        <div className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px] text-center">
                                            Faktury
                                        </div>
                                    </button>
                                </div>

                                {/* View Mode Toggle */}
                                <button className="bg-[#ffad4d] box-border content-stretch flex gap-2.5 items-end justify-end p-1 relative rounded-full shrink-0 w-16">
                                    <div className="basis-0 flex flex-row grow items-end self-stretch shrink-0">
                                        <div className="basis-0 box-border content-stretch flex grow h-full items-center justify-between min-h-px min-w-px p-0.5 relative shrink-0">
                                            <div
                                                className={`content-stretch flex gap-2 items-center justify-start relative rounded-full shrink-0 size-5 cursor-pointer ${viewMode === 'list' ? 'bg-[#fff4e5] shadow-sm' : ''
                                                    }`}
                                                onClick={() => setViewMode('list')}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                </svg>
                                            </div>
                                            <div
                                                className={`content-stretch flex gap-2 items-center justify-start relative rounded-full shrink-0 size-5 cursor-pointer ${viewMode === 'grid' ? 'bg-[#fff4e5] shadow-sm' : ''
                                                    }`}
                                                onClick={() => setViewMode('grid')}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="bg-[#f8f8fc] box-border content-stretch flex flex-col gap-4 h-[889px] items-start justify-start p-4 relative rounded-lg shrink-0 w-full">
                                {activeTab === 'contacts' && (
                                    <div className="basis-0 bg-[#f8f8fc] box-border content-start flex flex-wrap gap-4 grow items-start justify-start min-h-px min-w-px p-4 relative rounded-lg shrink-0 w-full">
                                        {client.contacts.map((contact, index) => (
                                            <div key={index} className="bg-[rgba(255,255,255,0.9)] box-border content-stretch flex gap-2 h-[132px] items-center justify-start p-4 relative rounded-lg shrink-0 w-[352px] border border-[rgba(7,22,112,0.21)]">
                                                {/* Avatar */}
                                                <div className="bg-gray-200 overflow-clip relative rounded-sm shrink-0 size-[100px] flex items-center justify-center">
                                                    <div className="text-2xl font-bold text-gray-500">
                                                        {contact.imie.charAt(0)}{contact.nazwisko.charAt(0)}
                                                    </div>
                                                </div>

                                                {/* Contact Info */}
                                                <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start justify-between min-h-px min-w-px px-0 py-2 relative shrink-0">
                                                    <div className="basis-0 content-stretch flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0 w-full">
                                                        {/* Name */}
                                                        <div className="box-border content-stretch flex font-['Inter'] font-normal gap-2 items-start justify-start leading-[24px] px-1 py-0 relative shrink-0 text-[#030217] text-[16px]">
                                                            <div className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px]">
                                                                {contact.imie}
                                                            </div>
                                                            <div className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px]">
                                                                {contact.nazwisko}
                                                            </div>
                                                        </div>

                                                        {/* Role */}
                                                        <div className="basis-0 box-border content-stretch flex grow items-start justify-start min-h-px min-w-px overflow-clip px-1 py-0 relative rounded-lg shrink-0 w-full">
                                                            <div className="basis-0 font-['Inter'] font-normal grow h-full leading-[normal] min-h-px min-w-px text-[#64698b] text-[10px]">
                                                                {contact.opis}
                                                            </div>
                                                        </div>

                                                        {/* Contact Details */}
                                                        <div className="content-stretch flex flex-col items-start justify-end relative shrink-0">
                                                            <div className="box-border content-stretch flex gap-2 items-center justify-start overflow-clip px-0.5 py-0 relative rounded-lg shrink-0">
                                                                <div className="relative shrink-0 size-[18px]">
                                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] text-center">
                                                                    {contact.adres_email}
                                                                </div>
                                                            </div>
                                                            <div className="box-border content-stretch flex gap-2 items-center justify-start overflow-clip px-0.5 py-0 relative rounded-lg shrink-0">
                                                                <div className="relative shrink-0 size-[18px]">
                                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="font-['Inter'] font-normal text-[12px] text-[#030217] leading-[16px] text-center">
                                                                    {contact.telefon_kontaktowy}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'projects' && (
                                    <div className="basis-0 bg-[#f8f8fc] box-border content-start flex flex-col gap-4 grow items-start justify-start min-h-px min-w-px p-4 relative rounded-lg shrink-0 w-full">
                                        <h3 className="font-['Inter'] font-semibold text-[18px] text-[#030217] leading-[24px]">
                                            Projekty ({projects.length})
                                        </h3>
                                        {projects.length > 0 ? (
                                            <div className="space-y-4 w-full">
                                                {projects.map((project) => (
                                                    <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h4 className="font-semibold text-lg text-gray-900 mb-2">{project.projectName}</h4>
                                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                            <div>
                                                                <span className="font-medium">Lokalizacja:</span> {project.location}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString('pl-PL')}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Data przyjęcia:</span> {new Date(project.dateReceived).toLocaleDateString('pl-PL')}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Elementy:</span> {project.elementsCount}
                                                            </div>
                                                        </div>
                                                        <div className="mt-3">
                                                            <div className="font-medium text-sm text-gray-700 mb-1">Moduły:</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {Object.entries(project.modules).map(([key, value]) =>
                                                                    value && (
                                                                        <span key={key} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                                            {key}
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-gray-400 mb-2">
                                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-600">Brak projektów dla tego klienta</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'invoices' && (
                                    <div className="basis-0 bg-[#f8f8fc] box-border content-start flex flex-col gap-4 grow items-start justify-start min-h-px min-w-px p-4 relative rounded-lg shrink-0 w-full">
                                        <h3 className="font-['Inter'] font-semibold text-[18px] text-[#030217] leading-[24px]">
                                            Faktury
                                        </h3>
                                        <div className="text-center py-8">
                                            <div className="text-gray-400 mb-2">
                                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-600">Moduł faktur w przygotowaniu</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

