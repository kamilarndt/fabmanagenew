export function ariaButtonProps(label: string) {
    return { role: 'button', 'aria-label': label, tabIndex: 0 }
}

export function onEnterSpace(handler: () => void) {
    return (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handler()
        }
    }
}

