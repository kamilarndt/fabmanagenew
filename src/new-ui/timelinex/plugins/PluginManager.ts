/**
 * Plugin Manager for TimelineX
 * Provides plugin system architecture and marketplace integration
 */

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  category: 'renderer' | 'interaction' | 'export' | 'import' | 'theme' | 'utility' | 'integration';
  tags: string[];
  dependencies: string[];
  peerDependencies: string[];
  minTimelineVersion: string;
  maxTimelineVersion?: string;
  isEnabled: boolean;
  isInstalled: boolean;
  isCompatible: boolean;
  isActive: boolean;
  installPath?: string;
  config?: Record<string, any>;
  metadata: {
    size: number;
    downloadCount: number;
    rating: number;
    lastUpdated: Date;
    createdAt: Date;
    homepage?: string;
    repository?: string;
    issues?: string;
    documentation?: string;
  };
}

export interface PluginAPI {
  timeline: {
    getItems: () => any[];
    getGroups: () => any[];
    getViewport: () => any;
    getTheme: () => any;
    getSettings: () => any;
    updateItem: (id: string, data: any) => void;
    addItem: (item: any) => void;
    removeItem: (id: string) => void;
    updateGroup: (id: string, data: any) => void;
    addGroup: (group: any) => void;
    removeGroup: (id: string) => void;
    setViewport: (viewport: any) => void;
    setTheme: (theme: any) => void;
    setSettings: (settings: any) => void;
    zoomToFit: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    pan: (delta: { x: number; y: number }) => void;
  };
  events: {
    on: (event: string, callback: Function) => void;
    off: (event: string, callback: Function) => void;
    emit: (event: string, data: any) => void;
  };
  ui: {
    createComponent: (component: React.ComponentType, props: any) => React.ReactElement;
    createModal: (content: React.ReactElement, options: any) => void;
    createNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
    createTooltip: (content: string, target: HTMLElement) => void;
  };
  utils: {
    generateId: () => string;
    debounce: (func: Function, delay: number) => Function;
    throttle: (func: Function, delay: number) => Function;
    formatDate: (date: Date, format: string) => string;
    parseDate: (dateString: string, format: string) => Date;
    validateData: (data: any, schema: any) => boolean;
    deepClone: (obj: any) => any;
    merge: (target: any, source: any) => any;
  };
  storage: {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    remove: (key: string) => void;
    clear: () => void;
  };
  network: {
    request: (url: string, options: any) => Promise<any>;
    upload: (file: File, url: string, options: any) => Promise<any>;
    download: (url: string, filename: string) => Promise<void>;
  };
}

export interface PluginContext {
  plugin: Plugin;
  api: PluginAPI;
  config: Record<string, any>;
  isActive: boolean;
  isEnabled: boolean;
}

export interface PluginHook {
  name: string;
  callback: (context: PluginContext, ...args: any[]) => any;
  priority: number;
}

export interface PluginRenderer {
  name: string;
  render: (context: PluginContext, props: any) => React.ReactElement;
  priority: number;
}

export interface PluginInteraction {
  name: string;
  handler: (context: PluginContext, event: any) => void;
  priority: number;
}

export interface PluginExport {
  name: string;
  format: string;
  export: (context: PluginContext, data: any) => Promise<Blob>;
  priority: number;
}

export interface PluginImport {
  name: string;
  format: string;
  import: (context: PluginContext, file: File) => Promise<any>;
  priority: number;
}

export interface PluginTheme {
  name: string;
  theme: any;
  priority: number;
}

export interface PluginUtility {
  name: string;
  utility: (context: PluginContext, ...args: any[]) => any;
  priority: number;
}

export interface PluginIntegration {
  name: string;
  service: string;
  connect: (context: PluginContext, credentials: any) => Promise<void>;
  disconnect: (context: PluginContext) => Promise<void>;
  isConnected: (context: PluginContext) => boolean;
  priority: number;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private hooks: Map<string, PluginHook[]> = new Map();
  private renderers: Map<string, PluginRenderer[]> = new Map();
  private interactions: Map<string, PluginInteraction[]> = new Map();
  private exports: Map<string, PluginExport[]> = new Map();
  private imports: Map<string, PluginImport[]> = new Map();
  private themes: Map<string, PluginTheme[]> = new Map();
  private utilities: Map<string, PluginUtility[]> = new Map();
  private integrations: Map<string, PluginIntegration[]> = new Map();
  private api: PluginAPI;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(api: PluginAPI) {
    this.api = api;
  }

  // Plugin management
  async installPlugin(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin ${plugin.id} is already installed`);
    }

    // Check compatibility
    if (!this.isCompatible(plugin)) {
      throw new Error(`Plugin ${plugin.id} is not compatible with current TimelineX version`);
    }

    // Check dependencies
    await this.checkDependencies(plugin);

    // Install plugin
    this.plugins.set(plugin.id, { ...plugin, isInstalled: true });
    
    // Initialize plugin
    await this.initializePlugin(plugin.id);
  }

  async uninstallPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not installed`);
    }

    // Deactivate plugin
    await this.deactivatePlugin(pluginId);

    // Remove plugin
    this.plugins.delete(pluginId);
  }

  async activatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not installed`);
    }

    if (plugin.isActive) {
      return;
    }

    // Activate plugin
    plugin.isActive = true;
    plugin.isEnabled = true;

    // Load plugin hooks
    await this.loadPluginHooks(pluginId);
  }

  async deactivatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      return;
    }

    if (!plugin.isActive) {
      return;
    }

    // Deactivate plugin
    plugin.isActive = false;
    plugin.isEnabled = false;

    // Unload plugin hooks
    await this.unloadPluginHooks(pluginId);
  }

  // Plugin discovery
  async discoverPlugins(): Promise<Plugin[]> {
    // This would typically fetch from a plugin marketplace API
    const mockPlugins: Plugin[] = [
      {
        id: 'timeline-export-pdf',
        name: 'PDF Export',
        version: '1.0.0',
        description: 'Export timeline to PDF format',
        author: 'TimelineX Team',
        license: 'MIT',
        category: 'export',
        tags: ['pdf', 'export', 'document'],
        dependencies: [],
        peerDependencies: [],
        minTimelineVersion: '1.0.0',
        isEnabled: false,
        isInstalled: false,
        isCompatible: true,
        isActive: false,
        metadata: {
          size: 1024 * 50, // 50KB
          downloadCount: 1000,
          rating: 4.5,
          lastUpdated: new Date(),
          createdAt: new Date(),
          homepage: 'https://github.com/timelinex/plugins',
          repository: 'https://github.com/timelinex/plugins',
          issues: 'https://github.com/timelinex/plugins/issues',
          documentation: 'https://docs.timelinex.dev/plugins/pdf-export',
        },
      },
      {
        id: 'timeline-theme-dark',
        name: 'Dark Theme',
        version: '1.0.0',
        description: 'Dark theme for TimelineX',
        author: 'TimelineX Team',
        license: 'MIT',
        category: 'theme',
        tags: ['theme', 'dark', 'ui'],
        dependencies: [],
        peerDependencies: [],
        minTimelineVersion: '1.0.0',
        isEnabled: false,
        isInstalled: false,
        isCompatible: true,
        isActive: false,
        metadata: {
          size: 1024 * 10, // 10KB
          downloadCount: 5000,
          rating: 4.8,
          lastUpdated: new Date(),
          createdAt: new Date(),
          homepage: 'https://github.com/timelinex/plugins',
          repository: 'https://github.com/timelinex/plugins',
          issues: 'https://github.com/timelinex/plugins/issues',
          documentation: 'https://docs.timelinex.dev/plugins/dark-theme',
        },
      },
    ];

    return mockPlugins;
  }

  async searchPlugins(query: string, category?: string): Promise<Plugin[]> {
    const plugins = await this.discoverPlugins();
    return plugins.filter(plugin => {
      const matchesQuery = plugin.name.toLowerCase().includes(query.toLowerCase()) ||
                          plugin.description.toLowerCase().includes(query.toLowerCase()) ||
                          plugin.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = !category || plugin.category === category;
      return matchesQuery && matchesCategory;
    });
  }

  // Plugin hooks
  registerHook(hookName: string, hook: PluginHook): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName)!.push(hook);
    this.hooks.get(hookName)!.sort((a, b) => b.priority - a.priority);
  }

  unregisterHook(hookName: string, hook: PluginHook): void {
    const hooks = this.hooks.get(hookName);
    if (hooks) {
      const index = hooks.indexOf(hook);
      if (index !== -1) {
        hooks.splice(index, 1);
      }
    }
  }

  async executeHook(hookName: string, ...args: any[]): Promise<any[]> {
    const hooks = this.hooks.get(hookName) || [];
    const results = [];

    for (const hook of hooks) {
      try {
        const context = this.createPluginContext(hook.plugin);
        const result = await hook.callback(context, ...args);
        results.push(result);
      } catch (error) {
        console.error(`Error executing hook ${hookName} for plugin ${hook.plugin}:`, error);
      }
    }

    return results;
  }

  // Plugin renderers
  registerRenderer(renderer: PluginRenderer): void {
    if (!this.renderers.has(renderer.name)) {
      this.renderers.set(renderer.name, []);
    }
    this.renderers.get(renderer.name)!.push(renderer);
    this.renderers.get(renderer.name)!.sort((a, b) => b.priority - a.priority);
  }

  getRenderer(name: string): PluginRenderer | null {
    const renderers = this.renderers.get(name);
    return renderers && renderers.length > 0 ? renderers[0] : null;
  }

  // Plugin interactions
  registerInteraction(interaction: PluginInteraction): void {
    if (!this.interactions.has(interaction.name)) {
      this.interactions.set(interaction.name, []);
    }
    this.interactions.get(interaction.name)!.push(interaction);
    this.interactions.get(interaction.name)!.sort((a, b) => b.priority - a.priority);
  }

  handleInteraction(name: string, event: any): void {
    const interactions = this.interactions.get(name) || [];
    for (const interaction of interactions) {
      try {
        const context = this.createPluginContext(interaction.plugin);
        interaction.handler(context, event);
      } catch (error) {
        console.error(`Error handling interaction ${name} for plugin ${interaction.plugin}:`, error);
      }
    }
  }

  // Plugin exports
  registerExport(exportPlugin: PluginExport): void {
    if (!this.exports.has(exportPlugin.format)) {
      this.exports.set(exportPlugin.format, []);
    }
    this.exports.get(exportPlugin.format)!.push(exportPlugin);
    this.exports.get(exportPlugin.format)!.sort((a, b) => b.priority - a.priority);
  }

  getExport(format: string): PluginExport | null {
    const exports = this.exports.get(format);
    return exports && exports.length > 0 ? exports[0] : null;
  }

  // Plugin imports
  registerImport(importPlugin: PluginImport): void {
    if (!this.imports.has(importPlugin.format)) {
      this.imports.set(importPlugin.format, []);
    }
    this.imports.get(importPlugin.format)!.push(importPlugin);
    this.imports.get(importPlugin.format)!.sort((a, b) => b.priority - a.priority);
  }

  getImport(format: string): PluginImport | null {
    const imports = this.imports.get(format);
    return imports && imports.length > 0 ? imports[0] : null;
  }

  // Plugin themes
  registerTheme(theme: PluginTheme): void {
    if (!this.themes.has(theme.name)) {
      this.themes.set(theme.name, []);
    }
    this.themes.get(theme.name)!.push(theme);
    this.themes.get(theme.name)!.sort((a, b) => b.priority - a.priority);
  }

  getTheme(name: string): PluginTheme | null {
    const themes = this.themes.get(name);
    return themes && themes.length > 0 ? themes[0] : null;
  }

  // Plugin utilities
  registerUtility(utility: PluginUtility): void {
    if (!this.utilities.has(utility.name)) {
      this.utilities.set(utility.name, []);
    }
    this.utilities.get(utility.name)!.push(utility);
    this.utilities.get(utility.name)!.sort((a, b) => b.priority - a.priority);
  }

  getUtility(name: string): PluginUtility | null {
    const utilities = this.utilities.get(name);
    return utilities && utilities.length > 0 ? utilities[0] : null;
  }

  // Plugin integrations
  registerIntegration(integration: PluginIntegration): void {
    if (!this.integrations.has(integration.service)) {
      this.integrations.set(integration.service, []);
    }
    this.integrations.get(integration.service)!.push(integration);
    this.integrations.get(integration.service)!.sort((a, b) => b.priority - a.priority);
  }

  getIntegration(service: string): PluginIntegration | null {
    const integrations = this.integrations.get(service);
    return integrations && integrations.length > 0 ? integrations[0] : null;
  }

  // Utility methods
  private isCompatible(plugin: Plugin): boolean {
    // Check version compatibility
    const currentVersion = '1.0.0'; // This would be the actual TimelineX version
    return this.compareVersions(currentVersion, plugin.minTimelineVersion) >= 0;
  }

  private async checkDependencies(plugin: Plugin): Promise<void> {
    for (const dependency of plugin.dependencies) {
      if (!this.plugins.has(dependency)) {
        throw new Error(`Plugin ${plugin.id} requires dependency ${dependency} which is not installed`);
      }
    }
  }

  private async initializePlugin(pluginId: string): Promise<void> {
    // This would typically load the plugin's main module
    // For now, we'll just mark it as initialized
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.isEnabled = true;
    }
  }

  private async loadPluginHooks(pluginId: string): Promise<void> {
    // This would typically load the plugin's hooks
    // For now, we'll just mark it as loaded
  }

  private async unloadPluginHooks(pluginId: string): Promise<void> {
    // This would typically unload the plugin's hooks
    // For now, we'll just mark it as unloaded
  }

  private createPluginContext(plugin: Plugin): PluginContext {
    return {
      plugin,
      api: this.api,
      config: plugin.config || {},
      isActive: plugin.isActive,
      isEnabled: plugin.isEnabled,
    };
  }

  private compareVersions(version1: string, version2: string): number {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0;
      const num2 = v2[i] || 0;
      
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    
    return 0;
  }

  // Public API
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getPlugin(id: string): Plugin | null {
    return this.plugins.get(id) || null;
  }

  getInstalledPlugins(): Plugin[] {
    return this.getPlugins().filter(plugin => plugin.isInstalled);
  }

  getActivePlugins(): Plugin[] {
    return this.getPlugins().filter(plugin => plugin.isActive);
  }

  getPluginsByCategory(category: string): Plugin[] {
    return this.getPlugins().filter(plugin => plugin.category === category);
  }

  getAvailableFormats(): string[] {
    const formats = new Set<string>();
    this.exports.forEach((_, format) => formats.add(format));
    this.imports.forEach((_, format) => formats.add(format));
    return Array.from(formats);
  }

  getAvailableThemes(): string[] {
    return Array.from(this.themes.keys());
  }

  getAvailableUtilities(): string[] {
    return Array.from(this.utilities.keys());
  }

  getAvailableIntegrations(): string[] {
    return Array.from(this.integrations.keys());
  }
}

// Global plugin manager instance
let globalPluginManager: PluginManager | null = null;

export function getPluginManager(): PluginManager {
  if (!globalPluginManager) {
    // Create a mock API for now
    const mockAPI: PluginAPI = {
      timeline: {
        getItems: () => [],
        getGroups: () => [],
        getViewport: () => ({}),
        getTheme: () => ({}),
        getSettings: () => ({}),
        updateItem: () => {},
        addItem: () => {},
        removeItem: () => {},
        updateGroup: () => {},
        addGroup: () => {},
        removeGroup: () => {},
        setViewport: () => {},
        setTheme: () => {},
        setSettings: () => {},
        zoomToFit: () => {},
        zoomIn: () => {},
        zoomOut: () => {},
        pan: () => {},
      },
      events: {
        on: () => {},
        off: () => {},
        emit: () => {},
      },
      ui: {
        createComponent: () => null as any,
        createModal: () => {},
        createNotification: () => {},
        createTooltip: () => {},
      },
      utils: {
        generateId: () => Math.random().toString(36).substr(2, 9),
        debounce: (func, delay) => func,
        throttle: (func, delay) => func,
        formatDate: (date, format) => date.toString(),
        parseDate: (dateString, format) => new Date(dateString),
        validateData: (data, schema) => true,
        deepClone: (obj) => JSON.parse(JSON.stringify(obj)),
        merge: (target, source) => ({ ...target, ...source }),
      },
      storage: {
        get: (key) => localStorage.getItem(key),
        set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        remove: (key) => localStorage.removeItem(key),
        clear: () => localStorage.clear(),
      },
      network: {
        request: async (url, options) => fetch(url, options).then(res => res.json()),
        upload: async (file, url, options) => fetch(url, { ...options, body: file }).then(res => res.json()),
        download: async (url, filename) => {
          const response = await fetch(url);
          const blob = await response.blob();
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          a.click();
        },
      },
    };

    globalPluginManager = new PluginManager(mockAPI);
  }
  return globalPluginManager;
}
