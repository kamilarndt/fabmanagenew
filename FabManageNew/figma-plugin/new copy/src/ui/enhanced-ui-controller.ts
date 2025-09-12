// Enhanced UI Controller for Figma Plugin v2.0
import type { ReactComponentAnalysis, ProcessingResult } from '../types/ast-types';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: string;
  validation?: () => boolean;
  canSkip?: boolean;
}

type ProcessingState = 'idle' | 'analyzing' | 'processing' | 'complete' | 'error';

export class EnhancedUIController {
  private currentStep = 0;
  private analysisResult: ReactComponentAnalysis | null = null;
  private processingState: ProcessingState = 'idle';
  private processingResult: ProcessingResult | null = null;
  
  private steps: WizardStep[] = [
    { 
      id: 'input', 
      title: 'Input React Code', 
      description: 'Paste your React/TSX component code',
      component: 'ReactInputStep'
    },
    { 
      id: 'analysis', 
      title: 'Component Analysis', 
      description: 'Analyzing React structure and Ant Design components',
      component: 'AnalysisStep' 
    },
    { 
      id: 'mapping', 
      title: 'Figma Mapping', 
      description: 'Configure how components map to Figma',
      component: 'MappingStep' 
    },
    { 
      id: 'properties', 
      title: 'Component Properties', 
      description: 'Set up component properties and variants',
      component: 'PropertiesStep' 
    },
    { 
      id: 'generation', 
      title: 'Generate Components', 
      description: 'Create Figma components from React code',
      component: 'GenerationStep' 
    }
  ];

  constructor() {
    this.setupEventListeners();
    this.renderInitialStep();
  }

  private setupEventListeners(): void {
    // Next/Previous buttons
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('btn-next')) {
        this.nextStep();
      } else if (target.classList.contains('btn-prev')) {
        this.previousStep();
      } else if (target.classList.contains('btn-analyze')) {
        this.analyzeReactCode();
      } else if (target.classList.contains('btn-generate')) {
        this.generateComponents();
      } else if (target.classList.contains('btn-load-example')) {
        this.loadExampleCode();
      } else if (target.classList.contains('btn-clear')) {
        this.clearInput();
      }
    });

    // Input changes
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      
      if (target.id === 'react-code-input') {
        this.validateReactCode(target.value);
      }
    });

    // Listen for messages from main plugin
    window.addEventListener('message', (event) => {
      this.handlePluginMessage(event.data.pluginMessage);
    });
  }

  private renderInitialStep(): void {
    this.renderStep(this.currentStep);
  }

  private renderStep(stepIndex: number): void {
    const step = this.steps[stepIndex];
    const container = document.getElementById('app-container')!;
    
    container.innerHTML = `
      <div class="wizard-container">
        ${this.renderProgressBar(stepIndex)}
        ${this.renderStepContent(step)}
        ${this.renderNavigationButtons(stepIndex)}
      </div>
    `;
  }

  private renderProgressBar(currentIndex: number): string {
    const progressPercentage = ((currentIndex + 1) / this.steps.length) * 100;
    
    return `
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="step-indicators">
          ${this.steps.map((step, index) => `
            <div class="step-indicator ${index <= currentIndex ? 'completed' : ''} ${index === currentIndex ? 'active' : ''}">
              <div class="step-number">${index + 1}</div>
              <div class="step-title">${step.title}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private renderStepContent(step: WizardStep): string {
    switch (step.component) {
      case 'ReactInputStep':
        return this.renderReactInputStep();
      case 'AnalysisStep':
        return this.renderAnalysisStep();
      case 'MappingStep':
        return this.renderMappingStep();
      case 'PropertiesStep':
        return this.renderPropertiesStep();
      case 'GenerationStep':
        return this.renderGenerationStep();
      default:
        return '<div>Unknown step</div>';
    }
  }

  private renderReactInputStep(): string {
    return `
      <div class="step-content react-input-step">
        <div class="step-header">
          <h2>Paste Your React Component</h2>
          <p>Paste your React/TypeScript component code below. The analyzer supports Ant Design components.</p>
        </div>
        
        <div class="input-section">
          <div class="input-header">
            <label for="react-code-input">React Component Code</label>
            <div class="input-actions">
              <button class="btn-secondary btn-load-example">Load Example</button>
              <button class="btn-secondary btn-clear">Clear</button>
            </div>
          </div>
          <textarea 
            id="react-code-input" 
            class="code-input" 
            placeholder="Paste your React component code here..."
            spellcheck="false"
          ></textarea>
          <div class="input-validation" id="code-validation"></div>
        </div>

        <div class="features-info">
          <h3>What We Support</h3>
          <div class="feature-grid">
            <div class="feature-item">
              <span class="feature-icon">📦</span>
              <div>
                <strong>Ant Design Components</strong>
                <p>Card, Button, Input, Progress, Tag, Avatar, etc.</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔄</span>
              <div>
                <strong>Conditional Rendering</strong>
                <p>Dynamic components and conditional displays</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎨</span>
              <div>
                <strong>Dynamic Properties</strong>
                <p>Props that change component appearance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderAnalysisStep(): string {
    if (!this.analysisResult) {
      return `
        <div class="step-content analysis-step">
          <div class="analysis-loading">
            <div class="spinner"></div>
            <h3>Analyzing React Component...</h3>
            <p>This may take a few moments</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="step-content analysis-step">
        <div class="step-header">
          <h2>Analysis Results</h2>
          <p>Here's what we found in your React component</p>
        </div>

        <div class="analysis-results">
          <div class="result-section">
            <h3>Component Overview</h3>
            <div class="overview-stats">
              <div class="stat-item">
                <span class="stat-number">${this.analysisResult.antdComponents.length}</span>
                <span class="stat-label">Ant Design Components</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${this.analysisResult.conditionalRendering.length}</span>
                <span class="stat-label">Conditional Renders</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${this.analysisResult.dynamicProps.length}</span>
                <span class="stat-label">Dynamic Properties</span>
              </div>
            </div>
          </div>

          <div class="result-section">
            <h3>Detected Components</h3>
            <div class="components-list">
              ${this.analysisResult.antdComponents.map(comp => `
                <div class="component-item">
                  <div class="component-icon">${this.getComponentIcon(comp.type)}</div>
                  <div class="component-info">
                    <strong>${comp.type}</strong>
                    <div class="component-props">
                      ${Object.entries(comp.props).map(([key, value]) => 
                        `<span class="prop-tag">${key}: ${typeof value === 'object' ? 'dynamic' : value}</span>`
                      ).join('')}
                    </div>
                  </div>
                  <div class="component-actions">
                    <button class="btn-small" onclick="previewComponent('${comp.type}')">Preview</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          ${this.analysisResult.conditionalRendering.length > 0 ? `
            <div class="result-section">
              <h3>Conditional Rendering</h3>
              <div class="conditionals-list">
                ${this.analysisResult.conditionalRendering.map(cond => `
                  <div class="conditional-item">
                    <code>${cond.condition}</code>
                    <span class="arrow">→</span>
                    <span class="conditional-result">Dynamic variant</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderMappingStep(): string {
    return `
      <div class="step-content mapping-step">
        <div class="step-header">
          <h2>Figma Mapping Configuration</h2>
          <p>Configure how your React components will be mapped to Figma components</p>
        </div>
        
        <div class="mapping-config">
          <div class="config-section">
            <h3>Component Mapping</h3>
            <p>Configure how each React component maps to Figma components</p>
            <div class="mapping-list">
              ${this.analysisResult?.antdComponents.map(comp => `
                <div class="mapping-item">
                  <div class="mapping-info">
                    <strong>${comp.type}</strong>
                    <span class="mapping-type">→ Frame Component</span>
                  </div>
                  <div class="mapping-actions">
                    <button class="btn-small">Configure</button>
                  </div>
                </div>
              `).join('') || '<p>No components detected</p>'}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderPropertiesStep(): string {
    return `
      <div class="step-content properties-step">
        <div class="step-header">
          <h2>Component Properties</h2>
          <p>Set up component properties and variants for your Figma components</p>
        </div>
        
        <div class="properties-config">
          <div class="config-section">
            <h3>Dynamic Properties</h3>
            <p>Configure which React props become Figma component properties</p>
            <div class="properties-list">
              ${this.analysisResult?.dynamicProps.map(prop => `
                <div class="property-item">
                  <div class="property-info">
                    <strong>${prop.propertyName}</strong>
                    <span class="property-type">${prop.dataType}</span>
                  </div>
                  <div class="property-actions">
                    <label class="checkbox-label">
                      <input type="checkbox" checked>
                      <span>Include in Figma</span>
                    </label>
                  </div>
                </div>
              `).join('') || '<p>No dynamic properties detected</p>'}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderGenerationStep(): string {
    if (this.processingState === 'processing') {
      return `
        <div class="step-content generation-step">
          <div class="generation-loading">
            <div class="spinner"></div>
            <h3>Generating Figma Components...</h3>
            <p>Creating components and variants in Figma</p>
          </div>
        </div>
      `;
    }

    if (this.processingResult) {
      return `
        <div class="step-content generation-step">
          <div class="step-header">
            <h2>Generation Complete!</h2>
            <p>Your React components have been successfully converted to Figma components</p>
          </div>
          
          <div class="generation-results">
            <div class="result-section">
              <h3>Generated Components</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-number">${this.processingResult.statistics.totalComponents}</span>
                  <span class="stat-label">Total Components</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">${this.processingResult.statistics.successfulComponents}</span>
                  <span class="stat-label">Successful</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">${this.processingResult.statistics.totalVariants}</span>
                  <span class="stat-label">Variants Created</span>
                </div>
              </div>
            </div>
            
            ${this.processingResult.errors.length > 0 ? `
              <div class="result-section">
                <h3>Errors</h3>
                <div class="error-list">
                  ${this.processingResult.errors.map(error => `
                    <div class="error-item">
                      <span class="error-icon">⚠️</span>
                      <span class="error-message">${error.message}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    return `
      <div class="step-content generation-step">
        <div class="step-header">
          <h2>Ready to Generate</h2>
          <p>Click the button below to create Figma components from your React code</p>
        </div>
        
        <div class="generation-preview">
          <h3>What will be created:</h3>
          <ul>
            <li>${this.analysisResult?.antdComponents.length || 0} Figma components</li>
            <li>${this.analysisResult?.dynamicProps.length || 0} component properties</li>
            <li>${this.analysisResult?.conditionalRendering.length || 0} variants</li>
            <li>Design tokens and documentation</li>
          </ul>
        </div>
      </div>
    `;
  }

  private renderNavigationButtons(stepIndex: number): string {
    return `
      <div class="navigation-buttons">
        ${stepIndex > 0 ? '<button class="btn-secondary btn-prev">Previous</button>' : ''}
        <div class="nav-spacer"></div>
        ${stepIndex === 0 ? '<button class="btn-primary btn-analyze">Analyze Code</button>' : ''}
        ${stepIndex > 0 && stepIndex < this.steps.length - 1 ? '<button class="btn-primary btn-next">Next</button>' : ''}
        ${stepIndex === this.steps.length - 1 ? '<button class="btn-primary btn-generate">Generate Components</button>' : ''}
      </div>
    `;
  }

  private getComponentIcon(componentType: string): string {
    const icons: { [key: string]: string } = {
      'Card': '📄',
      'Button': '🔘',
      'Progress': '📊',
      'Tag': '🏷️',
      'Avatar': '👤',
      'Typography': '📝',
      'Space': '📐',
      'Input': '✏️',
      'Select': '📋',
      'DatePicker': '📅'
    };
    
    return icons[componentType] || '🔧';
  }

  private nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.renderStep(this.currentStep);
    }
  }

  private previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderStep(this.currentStep);
    }
  }

  private async analyzeReactCode(): Promise<void> {
    const codeInput = document.getElementById('react-code-input') as HTMLTextAreaElement;
    const code = codeInput.value.trim();
    
    if (!code) {
      this.showError('Please enter React component code');
      return;
    }

    this.processingState = 'analyzing';
    this.nextStep(); // Move to analysis step
    
    try {
      // Send code to main plugin for analysis
      parent.postMessage({
        pluginMessage: {
          type: 'analyze-react-code',
          code: code
        }
      }, '*');
    } catch (error) {
      this.showError(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.processingState = 'error';
    }
  }

  private async generateComponents(): Promise<void> {
    this.processingState = 'processing';
    this.renderStep(this.currentStep);
    
    try {
      // Send generation request to main plugin
      parent.postMessage({
        pluginMessage: {
          type: 'generate-components',
          options: {
            createVariants: true,
            generateDocumentation: true,
            createDesignTokens: true,
            optimizeLayout: true,
            validateComponents: true,
            createComponentSets: true
          }
        }
      }, '*');
    } catch (error) {
      this.showError(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.processingState = 'error';
    }
  }

  private loadExampleCode(): void {
    const exampleCode = `import React from 'react';
import { Card, Button, Progress, Tag, Avatar, Space, Typography } from 'antd';

const { Title, Text } = Typography;

interface ProjectCardProps {
  project: {
    name: string;
    status: 'active' | 'completed' | 'pending';
    progress: number;
    team: string[];
  };
  onEdit: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
  return (
    <Card 
      title={project.name}
      extra={<Button onClick={onEdit}>Edit</Button>}
      style={{ width: 300 }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>Status:</Text>
          <Tag color={project.status === 'active' ? 'green' : 'blue'}>
            {project.status}
          </Tag>
        </div>
        
        <div>
          <Text strong>Progress:</Text>
          <Progress percent={project.progress} />
        </div>
        
        <div>
          <Text strong>Team:</Text>
          <Space>
            {project.team.map((member, index) => (
              <Avatar key={index} size="small">
                {member.charAt(0)}
              </Avatar>
            ))}
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default ProjectCard;`;

    const codeInput = document.getElementById('react-code-input') as HTMLTextAreaElement;
    codeInput.value = exampleCode;
    this.validateReactCode(exampleCode);
  }

  private clearInput(): void {
    const codeInput = document.getElementById('react-code-input') as HTMLTextAreaElement;
    codeInput.value = '';
    this.validateReactCode('');
  }

  private handlePluginMessage(message: any): void {
    switch (message.type) {
      case 'analysis-complete':
        this.analysisResult = message.result;
        this.processingState = 'complete';
        this.renderStep(this.currentStep);
        break;
        
      case 'analysis-error':
        this.showError(message.error);
        this.processingState = 'error';
        break;
        
      case 'generation-complete':
        this.processingResult = message.result;
        this.processingState = 'complete';
        this.renderStep(this.currentStep);
        this.showSuccess('Components generated successfully!');
        break;
        
      case 'generation-error':
        this.showError(message.error);
        this.processingState = 'error';
        break;
        
      case 'generation-progress':
        this.updateGenerationProgress(message.progress, message.message);
        break;
    }
  }

  private validateReactCode(code: string): void {
    const validation = document.getElementById('code-validation')!;
    
    if (code.length === 0) {
      validation.innerHTML = '';
      return;
    }

    // Basic validation
    const hasReactImport = code.includes('import') && (code.includes('react') || code.includes('React'));
    const hasAntdImport = code.includes("from 'antd'") || code.includes('from "antd"');
    const hasJSX = code.includes('<') && code.includes('>');
    const hasExport = code.includes('export') || code.includes('function');

    const validations = [
      { check: hasReactImport, message: 'React import detected' },
      { check: hasAntdImport, message: 'Ant Design import detected' },
      { check: hasJSX, message: 'JSX syntax detected' },
      { check: hasExport, message: 'Component export detected' }
    ];

    validation.innerHTML = `
      <div class="validation-results">
        ${validations.map(v => `
          <div class="validation-item ${v.check ? 'valid' : 'invalid'}">
            <span class="validation-icon">${v.check ? '✓' : '✗'}</span>
            ${v.message}
          </div>
        `).join('')}
      </div>
    `;
  }

  private updateGenerationProgress(progress: number, message: string): void {
    // Update progress in generation step
    const progressElement = document.querySelector('.generation-loading p');
    if (progressElement) {
      progressElement.textContent = message;
    }
  }

  private showError(message: string): void {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-toast';
    errorContainer.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-message">${message}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(errorContainer);
    
    setTimeout(() => {
      if (errorContainer.parentNode) {
        errorContainer.remove();
      }
    }, 5000);
  }

  private showSuccess(message: string): void {
    const successContainer = document.createElement('div');
    successContainer.className = 'success-toast';
    successContainer.innerHTML = `
      <div class="success-content">
        <span class="success-icon">✅</span>
        <span class="success-message">${message}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(successContainer);
    
    setTimeout(() => {
      if (successContainer.parentNode) {
        successContainer.remove();
      }
    }, 5000);
  }
}

// Initialize enhanced UI controller
const uiController = new EnhancedUIController();

// Export for backward compatibility
export default uiController;
