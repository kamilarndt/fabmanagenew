import { useEffect } from 'react'
import dayjs from 'dayjs'
import { Modal, Form, Input, DatePicker, Select } from 'antd'
import type { CalendarEvent, CalendarResource } from '../../stores/calendarStore'
import { useTilesStore } from '../../stores/tilesStore'

type Props = {
    open: boolean
    initial?: Partial<CalendarEvent>
    resources: CalendarResource[]
    onCancel: () => void
    onSubmit: (values: Omit<CalendarEvent, 'id'>) => void
    onDelete?: () => void
}

export default function EventFormModal({ open, initial, resources, onCancel, onSubmit, onDelete }: Props) {
    const [form] = Form.useForm()
    const tiles = useTilesStore(state => state.tiles)

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                title: initial?.title ?? '',
                range: initial?.start && initial?.end ? [dayjs(initial.start), dayjs(initial.end)] : undefined,
                resourceId: initial?.resourceId,
                phase: initial?.phase,
                tileId: initial?.meta?.tileId,
            })
        }
    }, [open, initial, form])

    const handleOk = async () => {
        const values = await form.validateFields()
        const [start, end] = values.range
        onSubmit({
            title: values.title,
            start: start.toDate(),
            end: end.toDate(),
            resourceId: values.resourceId,
            allDay: false,
            phase: values.phase,
            meta: { ...(initial?.meta || {}), tileId: values.tileId || undefined },
        })
    }

    return (
        <Modal
            open={open}
            title={initial?.id ? 'Edytuj wydarzenie' : 'Nowe wydarzenie'}
            okText={initial?.id ? 'Zapisz' : 'Dodaj'}
            onOk={handleOk}
            onCancel={onCancel}
            destroyOnClose
            footer={undefined}
        >
            <Form layout="vertical" form={form} onFinish={handleOk}>
                <Form.Item name="title" label="Tytuł" rules={[{ required: true, message: 'Podaj tytuł' }]}>
                    <Input placeholder="Nazwa zadania" />
                </Form.Item>
                <Form.Item name="range" label="Zakres czasu" rules={[{ required: true, message: 'Wybierz zakres' }]}>
                    <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="resourceId" label="Zasób">
                    <Select allowClear options={resources.map(r => ({ value: r.id, label: r.title }))} />
                </Form.Item>
                <Form.Item name="phase" label="Faza" rules={[{ required: false }]}>
                    <Select allowClear options={[
                        { value: 'projektowanie', label: 'Projektowanie' },
                        { value: 'wycinanie', label: 'Wycinanie' },
                        { value: 'produkcja', label: 'Produkcja' }
                    ]} />
                </Form.Item>
                <Form.Item name="tileId" label="Powiąż z kafelkiem">
                    <Select
                        allowClear
                        showSearch
                        options={tiles.map(t => ({ value: t.id, label: `${t.id} — ${t.name}` }))}
                        filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
                    />
                </Form.Item>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    {onDelete && (
                        <button className="ant-btn ant-btn-dangerous" type="button" onClick={onDelete}>Usuń</button>
                    )}
                    <button className="ant-btn" type="button" onClick={onCancel}>Anuluj</button>
                    <button className="ant-btn ant-btn-primary" type="submit">{initial?.id ? 'Zapisz' : 'Dodaj'}</button>
                </div>
            </Form>
        </Modal>
    )
}


