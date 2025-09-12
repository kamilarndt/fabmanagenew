type Step = {
    key: string
    label: string
}

type Props = {
    steps: Step[]
    currentKey: string
}

export function StageStepper({ steps, currentKey }: Props) {
    return (
        <div className="d-flex align-items-center gap-2">
            {steps.map((s, idx) => (
                <div key={s.key} className="d-flex align-items-center">
                    <span className={`badge ${s.key === currentKey ? 'bg-primary' : 'bg-light text-dark'}`}>{s.label}</span>
                    {idx < steps.length - 1 && <i className="ri-arrow-right-line mx-2 text-muted"></i>}
                </div>
            ))}
        </div>
    )
}


