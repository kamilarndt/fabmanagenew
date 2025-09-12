import { message, notification } from 'antd'

export function showToast(messageText: string, variant: 'success' | 'danger' | 'info' | 'warning' = 'success') {
    const type = variant === 'danger' ? 'error' : variant
    message[type](messageText, 3)
}

export function showNotification(
    title: string,
    description: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'success'
) {
    notification[type]({
        message: title,
        description,
        duration: 4.5,
        placement: 'topRight'
    })
}
