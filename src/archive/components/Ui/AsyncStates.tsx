export const Loading = ({ text = 'Ładowanie...' }: { text?: string }) => (
    <div className="text-center text-muted py-4" role="status" aria-live="polite">
        <div className="spinner-border me-2" role="status" aria-hidden="true"></div>
        {text}
    </div>
)

export const Empty = ({ text = 'Brak danych' }: { text?: string }) => (
    <div className="text-center text-muted py-4" aria-live="polite">{text}</div>
)

export const ErrorState = ({ message = 'Wystąpił błąd.' }: { message?: string }) => (
    <div className="alert alert-danger" role="alert">{message}</div>
)

