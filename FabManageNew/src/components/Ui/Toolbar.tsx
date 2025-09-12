type Props = {
    left?: React.ReactNode
    right?: React.ReactNode
}

export function Toolbar({ left, right }: Props) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex gap-2 align-items-center">{left}</div>
            <div className="d-flex gap-2 align-items-center">{right}</div>
        </div>
    )
}


