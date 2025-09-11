import React from 'react'
import { Card, Tag, Row, Col, Button, Progress, Space } from 'antd'
import {
  ShoppingCartOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons'
import type { MaterialData } from '../../data/materialsMockData'
import { getMaterialThumbnail, getThumbnailStyle } from '../../lib/materialThumbnails'

// Removed Typography to prevent infinite loops

interface MaterialCardProps {
  material: MaterialData
  onSelect?: (material: MaterialData) => void
  onQuickOrder?: (material: MaterialData) => void
  onAddToProject?: (material: MaterialData) => void
  selected?: boolean
}

export default function MaterialCard({
  material,
  onSelect,
  onQuickOrder,
  onAddToProject,
  selected = false
}: MaterialCardProps) {

  // Oblicz status stanu magazynowego
  const stockStatus = React.useMemo(() => {
    const ratio = material.stock / material.minStock
    if (ratio < 0.5) return { status: 'critical', color: '#ff4d4f', icon: <ExclamationCircleOutlined />, label: 'Krytyczny' }
    if (ratio < 1) return { status: 'low', color: '#faad14', icon: <WarningOutlined />, label: 'Niski Stan' }
    if (ratio > material.maxStock / material.minStock) return { status: 'excess', color: '#1890ff', icon: <InfoCircleOutlined />, label: 'Nadmiar' }
    return { status: 'normal', color: '#52c41a', icon: <CheckCircleOutlined />, label: 'OK' }
  }, [material.stock, material.minStock, material.maxStock])

  // Oblicz wartość zapasu
  const stockValue = React.useMemo(() => {
    return material.stock * (material.cena || material.price || 0)
  }, [material.stock, material.cena, material.price])

  // Oblicz procent zapełnienia
  const stockPercent = React.useMemo(() => {
    const percent = (material.stock / material.maxStock) * 100
    return Math.min(Math.max(percent, 0), 100)
  }, [material.stock, material.maxStock])

  // Uzyskaj miniaturę materiału
  const thumbnail = getMaterialThumbnail(material.typ, material.rodzaj)
  const thumbnailStyle = getThumbnailStyle(thumbnail)

  return (
    <Card
      hoverable
      size="small"
      className={`material-card ${selected ? 'selected' : ''}`}
      style={{
        height: '320px',
        backgroundColor: 'var(--bg-card)',
        border: selected ? '1px solid var(--primary-main)' : '1px solid var(--border-main)',
        borderRadius: 'var(--radius-none)',
        transition: 'all var(--transition-fast)',
        overflow: 'hidden',
        fontFamily: 'var(--font-family)',
        ...(selected && {
          boxShadow: 'var(--glow-primary)'
        })
      }}
      bodyStyle={{ padding: 0, height: '100%', backgroundColor: 'var(--bg-card)' }}
      onClick={() => onSelect?.(material)}
    >
      {/* 1. Podgląd Wizualny (Góra Karty) */}
      <div
        style={{
          ...thumbnailStyle,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          borderBottom: '1px solid var(--border-main)',
          position: 'relative'
        }}
      >
        <span style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
          {thumbnail.icon}
        </span>
        {/* Kod materiału w rogu */}
        <div style={{
          position: 'absolute',
          top: 4,
          right: 8,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          padding: '2px 6px',
          borderRadius: 3,
          fontSize: 10,
          fontFamily: 'monospace'
        }}>
          {material.code}
        </div>
      </div>

      {/* 2. Nazwa i Rodzaj (Sekcja Identyfikacyjna) */}
      <div style={{ padding: '12px 16px 8px' }}>
        <h4 style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 'var(--font-semibold)',
          lineHeight: 1.2,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-family)'
        }}>
          {material.typ || material.name}
        </h4>
        <span style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-family)'
        }}>
          {material.rodzaj || material.variant || 'Standard'}
        </span>
      </div>

      {/* 3. Kluczowe Atrybuty (Sekcja Parametrów) */}
      <div style={{ padding: '0 16px 8px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space size={4}>
              <span style={{
                fontSize: 11,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-family)'
              }}>Grubość:</span>
              <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
                {material.grubosc || material.thickness + 'mm' || 'N/A'}
              </Tag>
            </Space>
          </Col>
          <Col>
            <Tag
              color={stockStatus.color}
              style={{
                fontSize: 10,
                margin: 0,
                border: 'none',
                color: '#fff',
                backgroundColor: stockStatus.color
              }}
            >
              {stockStatus.icon} {stockStatus.label}
            </Tag>
          </Col>
        </Row>
      </div>

      {/* 4. Dane Magazynowe i Finansowe (Sekcja Logistyczna) */}
      <div style={{ padding: '0 16px 8px' }}>
        <Row gutter={12}>
          <Col span={12}>
            <div>
              <span style={{
                fontSize: 11,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-family)'
              }}>Dostępne:</span>
              <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>
                {material.stock} / {material.minStock} {material.unit}
              </div>
              <Progress
                percent={stockPercent}
                strokeColor={stockStatus.color}
                size="small"
                showInfo={false}
                style={{ marginTop: 4 }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div>
              <span style={{
                fontSize: 11,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-family)'
              }}>Cena / {material.unit}:</span>
              <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>
                {(material.cena || material.price || 0).toLocaleString('pl-PL', {
                  style: 'currency',
                  currency: 'PLN',
                  maximumFractionDigits: 0
                })}
              </div>
              <div style={{ fontSize: 11, color: '#52c41a', marginTop: 2 }}>
                Wartość: {stockValue.toLocaleString('pl-PL', {
                  style: 'currency',
                  currency: 'PLN',
                  maximumFractionDigits: 0
                })}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Dodatkowe info */}
      <div style={{ padding: '0 16px 8px' }}>
        {material.wielkosc_formatki && (
          <span style={{
            fontSize: 10,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family)'
          }}>
            📐 Format: {material.wielkosc_formatki}
          </span>
        )}
        {material.location && (
          <div style={{ marginTop: 2 }}>
            <span style={{
              fontSize: 10,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-family)'
            }}>
              📍 {material.location}
            </span>
          </div>
        )}
      </div>

      {/* 5. Pasek Akcji (Dół Karty) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        padding: '8px 12px'
      }}>
        <Row gutter={8} justify="space-between">
          <Col>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.(material)
              }}
            >
              Szczegóły
            </Button>
          </Col>

          {(stockStatus.status === 'critical' || stockStatus.status === 'low') && (
            <Col>
              <Button
                type="text"
                size="small"
                danger={stockStatus.status === 'critical'}
                icon={<ShoppingCartOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  onQuickOrder?.(material)
                }}
              >
                Zamów
              </Button>
            </Col>
          )}

          <Col>
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                onAddToProject?.(material)
              }}
            >
              Dodaj
            </Button>
          </Col>
        </Row>
      </div>
    </Card>
  )
}

export { MaterialCard }