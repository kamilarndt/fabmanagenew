// Enhanced UI Controller for React to Figma Converter v2.0
// Full modular implementation with enhanced UI

import { EnhancedUIController } from './ui/enhanced-ui-controller';

interface StructureElement {
  id: string;
  name: string;
  type: 'element' | 'group' | 'variant' | 'component';
  figmaComponent?: string;
  figmaVariant?: string;
  children?: StructureElement[];
  selected?: boolean;
}

// Legacy UI Controller for backward compatibility
class UIController {
  private svgInput!: HTMLTextAreaElement;
  private reactInput!: HTMLTextAreaElement;
  private analyzeReactBtn!: HTMLButtonElement;
  private analyzeSvgBtn!: HTMLButtonElement;
  private convertSvgBtn!: HTMLButtonElement;
  private loadSampleBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;
  private structureList!: HTMLDivElement;
  private progressBar!: HTMLDivElement;
  private log!: HTMLDivElement;
  private analysisSection!: HTMLDivElement;
  private progressSection!: HTMLDivElement;

  private detectedElements: StructureElement[] = [];
  private isAnalyzing: boolean = false;
  private isConverting: boolean = false;
  private enhancedController: EnhancedUIController;

  constructor() {
    this.enhancedController = new EnhancedUIController();
    this.setupEventListeners();
    this.setupTabs();
  }

  private setupEventListeners(): void {
    // React analysis
    this.analyzeReactBtn = document.getElementById('analyze-react-btn') as HTMLButtonElement;
    this.analyzeReactBtn.addEventListener('click', () => this.analyzeReactCode());

    // SVG analysis
    this.analyzeSvgBtn = document.getElementById('analyze-svg-btn') as HTMLButtonElement;
    this.analyzeSvgBtn.addEventListener('click', () => this.analyzeSVG());

    // SVG conversion
    this.convertSvgBtn = document.getElementById('convert-svg-btn') as HTMLButtonElement;
    this.convertSvgBtn.addEventListener('click', () => this.convertToComponents());

    // Utility buttons
    this.loadSampleBtn = document.getElementById('load-sample-btn') as HTMLButtonElement;
    this.loadSampleBtn.addEventListener('click', () => this.loadSampleCode());

    this.clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
    this.clearBtn.addEventListener('click', () => this.clearInputs());

    // Input elements
    this.reactInput = document.getElementById('react-input') as HTMLTextAreaElement;
    this.svgInput = document.getElementById('svg-input') as HTMLTextAreaElement;

    // Output elements
    this.structureList = document.getElementById('structure-list') as HTMLDivElement;
    this.progressBar = document.getElementById('progress-bar') as HTMLDivElement;
    this.log = document.getElementById('log') as HTMLDivElement;
    this.analysisSection = document.getElementById('analysis-section') as HTMLDivElement;
    this.progressSection = document.getElementById('progress-section') as HTMLDivElement;

    // Listen for messages from main plugin
    window.addEventListener('message', (event) => {
      this.handlePluginMessage(event.data.pluginMessage);
    });
  }

  private setupTabs(): void {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');

        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const targetContent = document.getElementById(`${tabId}-tab`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  private analyzeReactCode(): void {
    const code = this.reactInput.value.trim();

    if (!code) {
      this.showError('Please enter React component code');
      return;
    }

    console.log('UI: Sending analyze-react message...');
    parent.postMessage({
      pluginMessage: {
        type: 'analyze-react',
        reactCode: code
      }
    }, '*');

    this.isAnalyzing = true;
    this.updateButtonStates();
  }

  private analyzeSVG(): void {
    const svgCode = this.svgInput.value.trim();

    if (!svgCode) {
      this.showError('Please enter SVG code');
      return;
    }

    console.log('UI: Sending analyze-svg message...');
    parent.postMessage({
      pluginMessage: {
        type: 'analyze-svg',
        svgData: svgCode
      }
    }, '*');

    this.isAnalyzing = true;
    this.updateButtonStates();
  }

  private convertToComponents(): void {
    const selectedElements = this.detectedElements.filter(el => el.selected);

    if (selectedElements.length === 0) {
      this.showError('Please select at least one element to convert');
      return;
    }

    console.log('UI: Sending process-svg message...');
    parent.postMessage({
      pluginMessage: {
        type: 'process-svg',
        svgData: this.svgInput.value,
        selectedElements: selectedElements
      }
    }, '*');

    this.isConverting = true;
    this.updateButtonStates();
    this.showProgress();
  }

  private loadSampleCode(): void {
    const sampleCode = `import React from 'react';
import { Card, Button, Progress, Tag, Avatar, Space, Typography } from 'antd';

const ProjectCard = ({ project }) => {
  return (
    <Card 
      hoverable
      cover={project.miniatura ? <img src={project.miniatura} /> : <div>🖼️</div>}
      actions={[
        <Button onClick={() => console.log('edit')}>Edit</Button>,
        <Button onClick={() => console.log('3d')}>3D Model</Button>
      ]}
    >
      <Typography.Title level={4}>{project.name}</Typography.Title>
      <Typography.Text type="secondary">Nr: {project.numer}</Typography.Text>
      
      <div style={{ marginTop: 12 }}>
        <Tag color={getProjectTypeColor(project.typ)}>{project.typ}</Tag>
        <Typography.Text>📍 {project.lokalizacja}</Typography.Text>
      </div>

      <div style={{ marginTop: 12 }}>
        <Typography.Text>👤 Klient: {project.client}</Typography.Text>
        <br />
        <Typography.Text>📅 Deadline: {formatDate(project.deadline)}</Typography.Text>
      </div>

      <div style={{ marginTop: 16 }}>
        <Typography.Text strong>Postęp</Typography.Text>
        <Progress percent={project.postep || project.progress || 0} />
      </div>

      {project.manager && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}>
          <Avatar size={24} />
          <Typography.Text style={{ marginLeft: 8 }}>Manager: {project.manager}</Typography.Text>
        </div>
      )}
    </Card>
  );
};

export default ProjectCard;`;

    this.reactInput.value = sampleCode;
  }

  private clearInputs(): void {
    this.reactInput.value = '';
    this.svgInput.value = '';
    this.detectedElements = [];
    this.hideAnalysis();
    this.hideProgress();
    this.updateButtonStates();
  }

  private handlePluginMessage(message: any): void {
    console.log('UI: Received message:', message);

    if (!message) return;

    switch (message.type) {
      case 'analysis-complete':
        console.log('UI: Handling analysis-complete');
        this.handleAnalysisComplete(message.structure);
        break;

      case 'analysis-error':
        console.log('UI: Handling analysis-error');
        this.handleAnalysisError(message.message);
        break;

      case 'generation-progress':
        console.log('UI: Handling generation-progress');
        this.updateProgress(message.progress, message.message);
        break;

      case 'generation-complete':
        console.log('UI: Handling generation-complete');
        this.handleGenerationComplete(message);
        break;

      case 'generation-error':
        console.log('UI: Handling generation-error');
        this.handleGenerationError(message.error);
        break;

      default:
        console.log('UI: Unknown message type:', message.type);
    }
  }

  private handleAnalysisComplete(structure: any): void {
    console.log('UI: Analysis complete, structure:', structure);

    this.isAnalyzing = false;
    this.detectedElements = this.parseStructure(structure);
    this.displayStructure();
    this.showAnalysis();
    this.updateButtonStates();
  }

  private handleAnalysisError(message: string): void {
    console.log('UI: Analysis error:', message);

    this.isAnalyzing = false;
    this.showError(message);
    this.updateButtonStates();
  }

  private handleGenerationComplete(message: any): void {
    console.log('UI: Generation complete:', message);

    this.isConverting = false;
    this.showSuccess(`Successfully created ${message.componentsCreated || 0} components!`);
    this.hideProgress();
    this.updateButtonStates();
  }

  private handleGenerationError(error: string): void {
    console.log('UI: Generation error:', error);

    this.isConverting = false;
    this.showError(error);
    this.hideProgress();
    this.updateButtonStates();
  }

  private parseStructure(structure: any): StructureElement[] {
    const elements: StructureElement[] = [];

    if (structure.components) {
      structure.components.forEach((comp: any, index: number) => {
        elements.push({
          id: `component-${index}`,
          name: comp.name || `Component ${index + 1}`,
          type: 'component',
          figmaComponent: comp.figmaComponent,
          selected: true
        });
      });
    }

    if (structure.elements) {
      structure.elements.forEach((el: any, index: number) => {
        elements.push({
          id: `element-${index}`,
          name: el.name || `Element ${index + 1}`,
          type: 'element',
          figmaComponent: el.figmaComponent,
          selected: true
        });
      });
    }

    if (structure.groups) {
      structure.groups.forEach((group: any, index: number) => {
        elements.push({
          id: `group-${index}`,
          name: group.name || `Group ${index + 1}`,
          type: 'group',
          figmaComponent: group.figmaComponent,
          selected: true
        });
      });
    }

    if (structure.variants) {
      structure.variants.forEach((variant: any, index: number) => {
        elements.push({
          id: `variant-${index}`,
          name: variant.name || `Variant ${index + 1}`,
          type: 'variant',
          figmaVariant: variant.figmaVariant,
          selected: true
        });
      });
    }

    return elements;
  }

  private displayStructure(): void {
    if (this.detectedElements.length === 0) {
      this.structureList.innerHTML = '<p>No elements detected</p>';
      return;
    }

    const grouped = this.detectedElements.reduce((acc, element) => {
      if (!acc[element.type]) {
        acc[element.type] = [];
      }
      acc[element.type].push(element);
      return acc;
    }, {} as Record<string, StructureElement[]>);

    let html = '';

    Object.entries(grouped).forEach(([type, elements]) => {
      html += `<h4>${type.charAt(0).toUpperCase() + type.slice(1)}s (${elements.length})</h4>`;

      elements.forEach((element, index) => {
        html += `
          <div class="structure-item">
            <label>
              <input type="checkbox" ${element.selected ? 'checked' : ''} 
                     data-index="${this.detectedElements.indexOf(element)}">
              <div class="component-info">
                <div class="component-name">${element.name}</div>
                <div class="component-type">${type}</div>
              </div>
            </label>
          </div>
        `;
      });
    });

    this.structureList.innerHTML = html;

    // Add event listeners to checkboxes
    this.structureList.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
      checkbox.addEventListener('change', (e) => {
        const elementIndex = parseInt((e.target as HTMLInputElement).dataset['index'] || '0');
        if (this.detectedElements[elementIndex]) {
          this.detectedElements[elementIndex].selected = (e.target as HTMLInputElement).checked;
        }
        this.updateButtonStates();
      });
    });
  }

  private updateButtonStates(): void {
    const hasSelectedElements = this.detectedElements.some(el => el.selected);

    this.analyzeReactBtn.disabled = this.isAnalyzing || this.isConverting;
    this.analyzeSvgBtn.disabled = this.isAnalyzing || this.isConverting;
    this.convertSvgBtn.disabled = this.isAnalyzing || this.isConverting || !hasSelectedElements;
  }

  private showAnalysis(): void {
    this.analysisSection.classList.remove('hidden');
  }

  private hideAnalysis(): void {
    this.analysisSection.classList.add('hidden');
  }

  private showProgress(): void {
    this.progressSection.classList.remove('hidden');
  }

  private hideProgress(): void {
    this.progressSection.classList.add('hidden');
  }

  private updateProgress(percentage: number, message: string): void {
    this.progressBar.style.width = `${percentage}%`;
    this.logMessage(message);
  }

  private logMessage(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.log.textContent += `[${timestamp}] ${message}\n`;
    this.log.scrollTop = this.log.scrollHeight;
  }

  private showError(message: string): void {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;

    // Remove existing errors
    document.querySelectorAll('.error').forEach(el => el.remove());

    // Insert at the top of the container
    const container = document.querySelector('.container');
    if (container) {
      container.insertBefore(errorDiv, container.firstChild);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  private showSuccess(message: string): void {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;

    // Remove existing success messages
    document.querySelectorAll('.success').forEach(el => el.remove());

    // Insert at the top of the container
    const container = document.querySelector('.container');
    if (container) {
      container.insertBefore(successDiv, container.firstChild);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, 5000);
  }
}

// Initialize UI controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new UIController();
});