import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface SearchConfig {
    placeholder: string
    value: string
    onSearch: (value: string) => void
}

interface SearchContextType {
    searchConfig: SearchConfig | null
    setSearchConfig: (config: SearchConfig | null) => void
    setSearchQuery: (query: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
    const [searchConfig, setSearchConfigState] = useState<SearchConfig | null>(null)

    const setSearchConfig = (config: SearchConfig | null) => {
        setSearchConfigState(config)
    }

    const setSearchQuery = (query: string) => {
        if (searchConfig) {
            setSearchConfigState({
                ...searchConfig,
                value: query
            })
        }
    }

    return (
        <SearchContext.Provider value={{
            searchConfig,
            setSearchConfig,
            setSearchQuery
        }}>
            {children}
        </SearchContext.Provider>
    )
}

export function useSearchContext() {
    const context = useContext(SearchContext)
    if (context === undefined) {
        throw new Error('useSearchContext must be used within a SearchProvider')
    }
    return context
}

// Hook do używania w komponentach stron
export function usePageSearch(config: Omit<SearchConfig, 'value'>) {
    const { setSearchConfig } = useSearchContext()
    const [searchValue, setSearchValue] = useState('')

    React.useEffect(() => {
        // Avoid depending on onSearch function identity to prevent update loops
        setSearchConfig({
            placeholder: config.placeholder,
            onSearch: config.onSearch,
            value: searchValue
        })

        // Cleanup przy unmount
        return () => {
            setSearchConfig(null)
        }
    }, [config.placeholder, searchValue, setSearchConfig])

    return {
        searchValue,
        setSearchValue
    }
}
