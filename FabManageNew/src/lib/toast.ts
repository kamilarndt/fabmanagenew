export function showToast(message: string, variant: 'success' | 'danger' | 'info' | 'warning' = 'success') {
    const bs = (window as any).bootstrap
    const containerId = 'toast-container-root'
    let container = document.getElementById(containerId)
    if (!container) {
        container = document.createElement('div')
        container.id = containerId
        container.style.position = 'fixed'
        container.style.top = '1rem'
        container.style.right = '1rem'
        container.style.zIndex = '1080'
        document.body.appendChild(container)
    }
    const toast = document.createElement('div')
    toast.className = 'toast align-items-center text-white border-0 show'
    toast.setAttribute('role', 'alert')
    toast.setAttribute('aria-live', 'assertive')
    toast.setAttribute('aria-atomic', 'true')
    toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body bg-${variant} rounded-start">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `
    container.appendChild(toast)
    try {
        const t = new bs.Toast(toast, { delay: 2500 })
        t.show()
        toast.addEventListener('hidden.bs.toast', () => toast.remove())
    } catch {
        // fallback: auto-remove
        setTimeout(() => toast.remove(), 2500)
    }
}


