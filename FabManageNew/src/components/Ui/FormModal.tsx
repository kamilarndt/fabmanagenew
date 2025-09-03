import React, { useState } from 'react'
import type { ZodSchema } from 'zod'

type Props<T> = {
    title: string
    isOpen: boolean
    initial: T
    schema: ZodSchema<T>
    onSubmit: (data: T) => void
    onCancel: () => void
    children?: (form: T, setForm: (next: Partial<T>) => void, errors: Record<string, string>) => React.ReactNode
}

export function FormModal<T>({ title, isOpen, initial, schema, onSubmit, onCancel, children }: Props<T>) {
    const [form, setFormState] = useState<T>(initial)
    const [errors, setErrors] = useState<Record<string, string>>({})

    if (!isOpen) return null

    const setForm = (next: Partial<T>) => setFormState(prev => ({ ...prev, ...next }))

    const handleSubmit = () => {
        const parse = schema.safeParse(form)
        if (!parse.success) {
            const err: Record<string, string> = {}
            parse.error.issues.forEach(i => { if (i.path[0]) err[String(i.path[0])] = i.message })
            setErrors(err)
            return
        }
        onSubmit(parse.data)
    }

    return (
        <div className="modal d-block" role="dialog" aria-modal="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onCancel}></button>
                    </div>
                    <div className="modal-body">
                        {children ? children(form, setForm, errors) : null}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onCancel}>Anuluj</button>
                        <button className="btn btn-primary" onClick={handleSubmit}>Zapisz</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


