import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClientDataStore } from '../stores/clientDataStore';

export default function Klienci() {
    const {
        clients,
        loading,
        error,
        loadData,
        selectClient
    } = useClientDataStore();

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleClientClick = (client: any) => {
        selectClient(client);
        // Open in new window as per Figma design
        window.open(`/klienci/${client.id}`, '_blank', 'noopener,noreferrer');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Ładowanie klientów...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0l-5.928 8.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Błąd ładowania danych</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={loadData}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Spróbuj ponownie
                    </button>
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

                    <div className="box-border content-stretch flex gap-2 items-center justify-start px-0 py-1 relative shrink-0 w-full bg-[rgba(79,70,229,0.1)] rounded-lg">
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
                    </div>

                    {/* Other nav items */}
                    <Link to="/zlecenia" className="box-border content-stretch flex gap-2 items-center justify-start px-0 py-1 relative shrink-0 w-full hover:bg-gray-100 rounded-lg">
                        <div className="basis-0 content-stretch flex gap-2 grow items-start justify-start min-h-px min-w-px relative shrink-0">
                            <div className="overflow-clip relative shrink-0 size-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="basis-0 content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative shrink-0">
                                <div className="font-['Inter'] font-semibold text-[16px] text-[#030217] leading-[24px] w-full">
                                    Zlecenia
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
                        <div className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px] underline">
                            Home
                        </div>
                        <div className="overflow-clip relative shrink-0 size-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div className="font-['Inter'] font-normal text-[16px] text-[#030217] leading-[24px] underline">
                            Klienci
                        </div>
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

                {/* Main Content Area */}
                <div className="box-border content-stretch flex flex-col gap-2.5 h-full items-center justify-start overflow-clip px-32 py-4 relative shrink-0 w-full">
                    {/* Page Header */}
                    <div className="box-border content-stretch flex gap-2.5 items-start justify-start px-0 py-4 relative shrink-0 w-full">
                        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start max-w-[640px] px-0 py-1 relative shrink-0 w-[640px]">
                            <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full">
                                <div className="font-['Inter'] font-semibold text-[20px] text-[#030217] leading-[24px] w-full">
                                    Lista Klientów
                                </div>
                                <div className="font-['Inter'] font-normal text-[12px] text-[#64698b] leading-[16px] w-full">
                                    Zarządzaj swoimi klientami i przeglądaj ich szczegóły
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client Cards Grid */}
                    <div className="content-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => handleClientClick(client)}
                            >
                                {/* Company Logo */}
                                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-4 mx-auto">
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
                                    <div className={`text-2xl font-bold text-gray-500 ${client.logoUrl ? 'hidden' : ''}`}>
                                        {client.companyName.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>

                                {/* Company Name */}
                                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2 group-hover:text-indigo-600 transition-colors">
                                    {client.companyName}
                                </h3>

                                {/* Company Details */}
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">NIP:</span>
                                        <span>{client.nip}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Miasto:</span>
                                        <span>{client.address.city}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Kontakty:</span>
                                        <span>{client.contacts.length}</span>
                                    </div>
                                </div>

                                {/* Description Preview */}
                                <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                                    {client.description}
                                </p>

                                {/* View Details Button */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <button className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                                        Zobacz szczegóły →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {clients.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Brak klientów</h3>
                            <p className="text-gray-600">Nie znaleziono żadnych klientów w bazie danych.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
