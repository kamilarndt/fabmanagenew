/**
 * Plugin Marketplace Component
 * Provides UI for browsing, installing, and managing TimelineX plugins
 */

import React, { memo, useCallback, useEffect, useState } from 'react';
import { getPluginManager, type Plugin } from '../plugins/PluginManager';

export interface PluginMarketplaceProps {
  isOpen: boolean;
  onClose: () => void;
  onPluginInstall?: (plugin: Plugin) => void;
  onPluginUninstall?: (plugin: Plugin) => void;
  onPluginActivate?: (plugin: Plugin) => void;
  onPluginDeactivate?: (plugin: Plugin) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const PluginMarketplace: React.FC<PluginMarketplaceProps> = memo(function PluginMarketplace({
  isOpen,
  onClose,
  onPluginInstall,
  onPluginUninstall,
  onPluginActivate,
  onPluginDeactivate,
  className,
  style,
}) {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [installedPlugins, setInstalledPlugins] = useState<Plugin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pluginManager = getPluginManager();

  // Load plugins on mount
  useEffect(() => {
    if (isOpen) {
      loadPlugins();
    }
  }, [isOpen]);

  // Load plugins
  const loadPlugins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [discoveredPlugins, installed] = await Promise.all([
        pluginManager.discoverPlugins(),
        Promise.resolve(pluginManager.getInstalledPlugins())
      ]);
      
      setPlugins(discoveredPlugins);
      setInstalledPlugins(installed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plugins');
    } finally {
      setIsLoading(false);
    }
  }, [pluginManager]);

  // Search plugins
  const searchPlugins = useCallback(async () => {
    if (!searchQuery.trim()) {
      await loadPlugins();
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const results = await pluginManager.searchPlugins(searchQuery, selectedCategory);
      setPlugins(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search plugins');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, pluginManager, loadPlugins]);

  // Install plugin
  const handleInstallPlugin = useCallback(async (plugin: Plugin) => {
    try {
      await pluginManager.installPlugin(plugin);
      await loadPlugins();
      onPluginInstall?.(plugin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to install plugin');
    }
  }, [pluginManager, loadPlugins, onPluginInstall]);

  // Uninstall plugin
  const handleUninstallPlugin = useCallback(async (plugin: Plugin) => {
    try {
      await pluginManager.uninstallPlugin(plugin.id);
      await loadPlugins();
      onPluginUninstall?.(plugin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to uninstall plugin');
    }
  }, [pluginManager, loadPlugins, onPluginUninstall]);

  // Activate plugin
  const handleActivatePlugin = useCallback(async (plugin: Plugin) => {
    try {
      await pluginManager.activatePlugin(plugin.id);
      await loadPlugins();
      onPluginActivate?.(plugin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate plugin');
    }
  }, [pluginManager, loadPlugins, onPluginActivate]);

  // Deactivate plugin
  const handleDeactivatePlugin = useCallback(async (plugin: Plugin) => {
    try {
      await pluginManager.deactivatePlugin(plugin.id);
      await loadPlugins();
      onPluginDeactivate?.(plugin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate plugin');
    }
  }, [pluginManager, loadPlugins, onPluginDeactivate]);

  // Filter plugins
  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || plugin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Categories
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'renderer', label: 'Renderers' },
    { value: 'interaction', label: 'Interactions' },
    { value: 'export', label: 'Export' },
    { value: 'import', label: 'Import' },
    { value: 'theme', label: 'Themes' },
    { value: 'utility', label: 'Utilities' },
    { value: 'integration', label: 'Integrations' },
  ];

  if (!isOpen) return null;

  return (
    <div
      className={`plugin-marketplace ${className || ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        ...style,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '1200px',
          height: '80%',
          maxHeight: '800px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            Plugin Marketplace
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Search and Filters */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                searchPlugins();
              }
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <button
            onClick={searchPlugins}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Search
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderBottom: '1px solid #f5c6cb',
            }}
          >
            {error}
          </div>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px',
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                fontSize: '16px',
                color: '#666',
              }}
            >
              Loading plugins...
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {filteredPlugins.map(plugin => (
                <PluginCard
                  key={plugin.id}
                  plugin={plugin}
                  isInstalled={installedPlugins.some(p => p.id === plugin.id)}
                  onInstall={() => handleInstallPlugin(plugin)}
                  onUninstall={() => handleUninstallPlugin(plugin)}
                  onActivate={() => handleActivatePlugin(plugin)}
                  onDeactivate={() => handleDeactivatePlugin(plugin)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// Plugin Card Component
interface PluginCardProps {
  plugin: Plugin;
  isInstalled: boolean;
  onInstall: () => void;
  onUninstall: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}

const PluginCard: React.FC<PluginCardProps> = memo(function PluginCard({
  plugin,
  isInstalled,
  onInstall,
  onUninstall,
  onActivate,
  onDeactivate,
}) {
  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Plugin Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>
            {plugin.name}
          </h3>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
            by {plugin.author}
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
            v{plugin.version}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              padding: '2px 6px',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              fontSize: '10px',
              textTransform: 'uppercase',
            }}
          >
            {plugin.category}
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {'★'.repeat(Math.floor(plugin.metadata.rating))}
            <span style={{ fontSize: '12px', color: '#666' }}>
              {plugin.metadata.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Plugin Description */}
      <p
        style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          color: '#333',
          lineHeight: '1.4',
        }}
      >
        {plugin.description}
      </p>

      {/* Plugin Tags */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          marginBottom: '12px',
        }}
      >
        {plugin.tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: '2px 6px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '10px',
              color: '#666',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Plugin Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#666',
          marginBottom: '12px',
        }}
      >
        <span>{plugin.metadata.downloadCount.toLocaleString()} downloads</span>
        <span>{(plugin.metadata.size / 1024).toFixed(1)} KB</span>
      </div>

      {/* Plugin Actions */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        {!isInstalled ? (
          <button
            onClick={onInstall}
            style={{
              flex: 1,
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Install
          </button>
        ) : (
          <>
            <button
              onClick={onUninstall}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Uninstall
            </button>
            <button
              onClick={plugin.isActive ? onDeactivate : onActivate}
              style={{
                padding: '8px 16px',
                backgroundColor: plugin.isActive ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {plugin.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </>
        )}
      </div>
    </div>
  );
});

export default PluginMarketplace;
