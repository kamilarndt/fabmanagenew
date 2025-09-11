import { useState } from 'react'
import { useEstimateStore } from '../../stores/estimateStore'
import { postEstimate } from '../../api/estimate'

export default function GenerateEstimateButton({ projectId }: { projectId: string }) {
    const [loading, setLoading] = useState(false)
    const { lineItems, laborRate, discountRate } = useEstimateStore()

    const handleClick = async () => {
        if (lineItems.length === 0) return
        setLoading(true)
        try {
            const blob = await postEstimate({ projectId, lineItems, laborRate, discountRate })
            const url = URL.createObjectURL(blob)
            window.open(url, '_blank')
            setTimeout(() => URL.revokeObjectURL(url), 30000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button className="btn btn-success" disabled={loading || lineItems.length === 0} onClick={handleClick}>
            <i className="ri-file-pdf-2-line me-1"></i>
            {loading ? 'Generuję...' : 'Generuj PDF wyceny'}
        </button>
    )
}


