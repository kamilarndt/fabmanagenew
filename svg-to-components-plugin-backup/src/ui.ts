// SVG to Components Converter - UI Controller
// Handles user interface interactions and communication with plugin code

interface StructureElement {
    id: string;
    name: string;
    type: 'element' | 'group' | 'variant' | 'component';
    selected: boolean;
    figmaComponent?: string;
    figmaVariant?: string;
}

interface AnalysisResult {
    elements: StructureElement[];
    groups: StructureElement[];
    variants: StructureElement[];
    component: StructureElement | null;
}

class UIController {
    private svgInput!: HTMLTextAreaElement;
    private fileInput!: HTMLInputElement;
    private analyzeBtn!: HTMLButtonElement;
    private convertBtn!: HTMLButtonElement;
    private clearBtn!: HTMLButtonElement;
    private structureList!: HTMLDivElement;
    private structureStats!: HTMLDivElement;
    private progressBar!: HTMLDivElement;
    private log!: HTMLDivElement;
    private resultsStats!: HTMLDivElement;
    private resultsLog!: HTMLDivElement;

    private detectedElements: StructureElement[] = [];
    private isAnalyzing: boolean = false;
    private isConverting: boolean = false;

    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadSampleSVG();
    }

    private initializeElements(): void {
        this.svgInput = document.getElementById('svg-input') as HTMLTextAreaElement;
        this.fileInput = document.getElementById('file-input') as HTMLInputElement;
        this.analyzeBtn = document.getElementById('analyze-btn') as HTMLButtonElement;
        this.convertBtn = document.getElementById('convert-btn') as HTMLButtonElement;
        this.clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
        this.structureList = document.getElementById('structure-list') as HTMLDivElement;
        this.structureStats = document.getElementById('structure-stats') as HTMLDivElement;
        this.progressBar = document.getElementById('progress-bar') as HTMLDivElement;
        this.log = document.getElementById('log') as HTMLDivElement;
        this.resultsStats = document.getElementById('results-stats') as HTMLDivElement;
        this.resultsLog = document.getElementById('results-log') as HTMLDivElement;
    }

    private setupEventListeners(): void {
        this.analyzeBtn.addEventListener('click', () => this.analyzeSVG());
        this.convertBtn.addEventListener('click', () => this.convertToComponents());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

        // Auto-resize textarea
        this.svgInput.addEventListener('input', () => {
            this.svgInput.style.height = 'auto';
            this.svgInput.style.height = this.svgInput.scrollHeight + 'px';
        });
    }

    private loadSampleSVG(): void {
        // Load sample SVG content for demonstration
        const sampleSVG = `<!-- Sample structured SVG -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <g id="ELEMENTS">
    <g id="Card" class="element" data-figma-component="container">
      <rect width="100" height="60" fill="#ffffff" stroke="#d9d9d9"/>
    </g>
    <g id="Progress" class="element" data-figma-component="progress">
      <rect width="80" height="8" fill="#f0f0f0"/>
      <rect width="40" height="8" fill="#1890ff"/>
    </g>
  </g>
  <g id="GROUPS">
    <g id="ProjectHeader" class="group" data-figma-component="header">
      <rect width="200" height="40" fill="#ffffff"/>
      <text x="10" y="25">Project Name</text>
    </g>
  </g>
  <g id="VARIANTS">
    <g id="CompactProject" class="variant" data-figma-variant="compact">
      <rect width="150" height="100" fill="#ffffff"/>
    </g>
  </g>
</svg>`;

        this.svgInput.value = sampleSVG;
    }

    private async handleFileUpload(event: Event): Promise<void> {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.svg')) {
            this.showError('Please select an SVG file');
            return;
        }

        try {
            const content = await this.readFileAsText(file);
            this.svgInput.value = content;
            this.logMessage('SVG file loaded successfully', 'success');
        } catch (error) {
            this.showError(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private readFileAsText(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string || '');
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    private async analyzeSVG(): Promise<void> {
        const svgCode = this.svgInput.value.trim();

        if (!svgCode) {
            this.showError('Please paste SVG code or load a file first');
            return;
        }

        if (this.isAnalyzing) return;

        this.isAnalyzing = true;
        this.analyzeBtn.disabled = true;
        this.analyzeBtn.textContent = '🔍 Analyzing...';
        this.logMessage('Starting SVG analysis...', 'info');

        try {
            console.log('UI: Sending analyze-svg message...');
            // Send analysis request to plugin code
            parent.postMessage({
                pluginMessage: {
                    type: 'analyze-svg',
                    svgData: svgCode
                }
            }, '*');
            console.log('UI: Message sent successfully');

        } catch (error) {
            console.error('UI: Error sending message:', error);
            this.showError(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.resetAnalyzeButton();
        }
    }

    private async convertToComponents(): Promise<void> {
        const selectedElements = this.detectedElements.filter(e => e.selected);

        if (selectedElements.length === 0) {
            this.showError('Please select at least one element to convert');
            return;
        }

        if (this.isConverting) return;

        this.isConverting = true;
        this.convertBtn.disabled = true;
        this.convertBtn.textContent = '⚡ Converting...';

        this.showSection('progress-section');
        this.logMessage('Starting conversion process...', 'info');
        this.updateProgress(0);

        try {
            // Send conversion request to plugin code
            parent.postMessage({
                pluginMessage: {
                    type: 'process-svg',
                    svgData: this.svgInput.value,
                    selectedElements: selectedElements
                }
            }, '*');

        } catch (error) {
            this.showError(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.resetConvertButton();
        }
    }

    private clearAll(): void {
        this.svgInput.value = '';
        this.detectedElements = [];
        this.hideAllSections();
        this.resetButtons();
        this.clearLogs();
    }

    private resetButtons(): void {
        this.analyzeBtn.disabled = false;
        this.analyzeBtn.textContent = '🔍 Analyze SVG Structure';
        this.convertBtn.disabled = true;
        this.convertBtn.textContent = '⚡ Create Components';
        this.isAnalyzing = false;
        this.isConverting = false;
    }

    private resetAnalyzeButton(): void {
        this.analyzeBtn.disabled = false;
        this.analyzeBtn.textContent = '🔍 Analyze SVG Structure';
        this.isAnalyzing = false;
    }

    public resetConvertButton(): void {
        this.convertBtn.disabled = false;
        this.convertBtn.textContent = '⚡ Create Components';
        this.isConverting = false;
    }

    private hideAllSections(): void {
        document.getElementById('analysis-section')?.classList.add('hidden');
        document.getElementById('progress-section')?.classList.add('hidden');
        document.getElementById('results-section')?.classList.add('hidden');
    }

    private showSection(sectionId: string): void {
        document.getElementById(sectionId)?.classList.remove('hidden');
    }

    private clearLogs(): void {
        this.log.innerHTML = '';
        this.resultsLog.innerHTML = '';
    }

    public handleAnalysisComplete(result: AnalysisResult): void {
        this.detectedElements = [
            ...result.elements,
            ...result.groups,
            ...result.variants,
            ...(result.component ? [result.component] : [])
        ];

        this.displayStructure();
        this.updateStructureStats();
        this.showSection('analysis-section');
        this.convertBtn.disabled = this.detectedElements.length === 0;

        this.resetAnalyzeButton();
        this.logMessage(`Analysis complete! Found ${this.detectedElements.length} components`, 'success');
    }

    public handleAnalysisError(message: string): void {
        this.showError(`Analysis failed: ${message}`);
        this.resetAnalyzeButton();
    }

    private displayStructure(): void {
        this.structureList.innerHTML = '';

        const groupedElements = this.groupElementsByType();

        Object.entries(groupedElements).forEach(([type, elements]) => {
            if (elements.length === 0) return;

            const typeHeader = document.createElement('h4');
            typeHeader.textContent = this.getTypeDisplayName(type);
            typeHeader.style.margin = '16px 0 8px 0';
            typeHeader.style.fontSize = '12px';
            typeHeader.style.color = '#6a737d';
            typeHeader.style.textTransform = 'uppercase';
            typeHeader.style.letterSpacing = '0.5px';
            this.structureList.appendChild(typeHeader);

            elements.forEach((element) => {
                const div = document.createElement('div');
                div.className = 'structure-item';
                div.innerHTML = `
          <label>
            <input type="checkbox" ${element.selected ? 'checked' : ''} 
                   data-index="${this.detectedElements.indexOf(element)}">
            <span class="type-badge type-${element.type}">${element.type}</span>
            <strong>${element.name}</strong>
            ${element.figmaComponent ? `<span style="color: #6a737d; font-size: 11px; margin-left: 8px;">(${element.figmaComponent})</span>` : ''}
          </label>
        `;

                const checkbox = div.querySelector('input') as HTMLInputElement;
                checkbox.addEventListener('change', (e) => {
                    const elementIndex = parseInt((e.target as HTMLInputElement).dataset['index']!);
                    if (this.detectedElements[elementIndex]) {
                        this.detectedElements[elementIndex].selected = (e.target as HTMLInputElement).checked;
                    }
                    this.updateConvertButtonState();
                });

                this.structureList.appendChild(div);
            });
        });
    }

    private groupElementsByType(): Record<string, StructureElement[]> {
        const grouped: Record<string, StructureElement[]> = {
            element: [],
            group: [],
            variant: [],
            component: []
        };

        this.detectedElements.forEach(element => {
            const typeGroup = grouped[element.type];
            if (typeGroup) {
                typeGroup.push(element);
            }
        });

        return grouped;
    }

    private getTypeDisplayName(type: string): string {
        const names: Record<string, string> = {
            'element': 'Atomic Elements',
            'group': 'Molecular Groups',
            'variant': 'Component Variants',
            'component': 'Main Components'
        };
        return names[type] || type;
    }

    private updateStructureStats(): void {
        const stats = this.calculateStats();

        this.structureStats.innerHTML = `
      <div class="stat-item">
        <span class="stat-number">${stats.total}</span>
        <div class="stat-label">Total Components</div>
      </div>
      <div class="stat-item">
        <span class="stat-number">${stats.selected}</span>
        <div class="stat-label">Selected</div>
      </div>
      <div class="stat-item">
        <span class="stat-number">${stats.elements}</span>
        <div class="stat-label">Elements</div>
      </div>
      <div class="stat-item">
        <span class="stat-number">${stats.groups}</span>
        <div class="stat-label">Groups</div>
      </div>
    `;
    }

    private calculateStats() {
        const total = this.detectedElements.length;
        const selected = this.detectedElements.filter(e => e.selected).length;
        const elements = this.detectedElements.filter(e => e.type === 'element').length;
        const groups = this.detectedElements.filter(e => e.type === 'group').length;
        const variants = this.detectedElements.filter(e => e.type === 'variant').length;
        const components = this.detectedElements.filter(e => e.type === 'component').length;

        return { total, selected, elements, groups, variants, components };
    }

    private updateConvertButtonState(): void {
        const selectedCount = this.detectedElements.filter(e => e.selected).length;
        this.convertBtn.disabled = selectedCount === 0;
    }

    public updateProgress(percentage: number): void {
        this.progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }

    public logMessage(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = type;
        logEntry.innerHTML = `[${timestamp}] ${message}`;

        this.log.appendChild(logEntry);
        this.log.scrollTop = this.log.scrollHeight;
    }

    public showError(message: string): void {
        this.logMessage(`ERROR: ${message}`, 'error');
    }

    public handleConversionComplete(data: any): void {
        this.showSection('results-section');
        this.updateResultsStats(data);
        this.resetConvertButton();
        this.logMessage('Conversion completed successfully!', 'success');
    }

    private updateResultsStats(data: any): void {
        this.resultsStats.innerHTML = `
      <div class="stat-item">
        <span class="stat-number">${data.componentsCreated || 0}</span>
        <div class="stat-label">Components Created</div>
      </div>
      <div class="stat-item">
        <span class="stat-number">${data.variantsCreated || 0}</span>
        <div class="stat-label">Variants Created</div>
      </div>
    `;
    }
}

// Initialize UI when DOM loads
let uiController: UIController | undefined;

document.addEventListener('DOMContentLoaded', () => {
    uiController = new UIController();
});

// Listen for messages from plugin code
window.addEventListener('message', (event) => {
    console.log('UI: Received message:', event.data);
    const { type, message, progress, structure, data } = event.data.pluginMessage || {};

    if (!uiController) {
        console.log('UI: No controller available');
        return;
    }

    console.log('UI: Processing message type:', type);

    switch (type) {
        case 'analysis-complete':
            console.log('UI: Handling analysis-complete');
            uiController.handleAnalysisComplete(structure);
            break;

        case 'analysis-error':
            console.log('UI: Handling analysis-error');
            uiController.handleAnalysisError(message);
            break;

        case 'progress':
            console.log('UI: Handling progress');
            uiController.updateProgress(progress);
            uiController.logMessage(message);
            break;

        case 'complete':
            console.log('UI: Handling complete');
            uiController.handleConversionComplete(data);
            break;

        case 'error':
            console.log('UI: Handling error');
            uiController.showError(message);
            uiController.resetConvertButton();
            break;

        default:
            console.log('UI: Unknown message type:', type);
    }
});

// Export for global access
setTimeout(() => {
    (window as any).uiController = uiController;
}, 0);
