// Advanced Error Handler for Figma Plugin
import { ParseError, ParseWarning, ProcessingError, ProcessingWarning } from '../types/ast-types';

export interface ErrorContext {
  component?: string;
  line?: number;
  column?: number;
  file?: string;
  operation?: string;
}

export interface ErrorSuggestion {
  title: string;
  description: string;
  code?: string;
  link?: string;
}

export interface ErrorReport {
  errors: ProcessingError[];
  warnings: ProcessingWarning[];
  suggestions: ErrorSuggestion[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    criticalErrors: number;
    fixableErrors: number;
  };
}

export class ErrorHandler {
  private errors: ProcessingError[] = [];
  private warnings: ProcessingWarning[] = [];
  private suggestions: ErrorSuggestion[] = [];

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
  }

  public addError(
    code: string,
    message: string,
    context?: ErrorContext,
    suggestion?: ErrorSuggestion
  ): void {
    const error: ProcessingError = {
      code,
      message,
      component: context?.component,
      line: context?.line,
      column: context?.column,
      suggestion: suggestion?.description
    };

    this.errors.push(error);

    if (suggestion) {
      this.suggestions.push(suggestion);
    }

    console.error(`❌ Error [${code}]: ${message}`, context);
  }

  public addWarning(
    code: string,
    message: string,
    context?: ErrorContext,
    suggestion?: ErrorSuggestion
  ): void {
    const warning: ProcessingWarning = {
      code,
      message,
      component: context?.component,
      line: context?.line,
      column: context?.column,
      suggestion: suggestion?.description
    };

    this.warnings.push(warning);

    if (suggestion) {
      this.suggestions.push(suggestion);
    }

    console.warn(`⚠️ Warning [${code}]: ${message}`, context);
  }

  public handleParseError(error: Error, context?: ErrorContext): void {
    const errorCode = this.classifyParseError(error);
    const suggestion = this.getParseErrorSuggestion(errorCode);

    this.addError(
      errorCode,
      error.message,
      context,
      suggestion
    );
  }

  public handleFigmaError(error: Error, context?: ErrorContext): void {
    const errorCode = this.classifyFigmaError(error);
    const suggestion = this.getFigmaErrorSuggestion(errorCode);

    this.addError(
      errorCode,
      error.message,
      context,
      suggestion
    );
  }

  public handleValidationError(message: string, context?: ErrorContext): void {
    const suggestion = this.getValidationErrorSuggestion(message);

    this.addError(
      'VALIDATION_ERROR',
      message,
      context,
      suggestion
    );
  }

  private classifyParseError(error: Error): string {
    const message = error.message.toLowerCase();

    if (message.includes('syntax')) return 'SYNTAX_ERROR';
    if (message.includes('unexpected token')) return 'UNEXPECTED_TOKEN';
    if (message.includes('missing')) return 'MISSING_SYNTAX';
    if (message.includes('unclosed')) return 'UNCLOSED_SYNTAX';
    if (message.includes('unterminated')) return 'UNTERMINATED_STRING';
    if (message.includes('invalid')) return 'INVALID_SYNTAX';
    if (message.includes('unexpected end')) return 'UNEXPECTED_END';

    return 'PARSE_ERROR';
  }

  private classifyFigmaError(error: Error): string {
    const message = error.message.toLowerCase();

    if (message.includes('permission')) return 'PERMISSION_ERROR';
    if (message.includes('not found')) return 'NOT_FOUND_ERROR';
    if (message.includes('invalid')) return 'INVALID_PARAMETER';
    if (message.includes('limit')) return 'LIMIT_EXCEEDED';
    if (message.includes('timeout')) return 'TIMEOUT_ERROR';
    if (message.includes('network')) return 'NETWORK_ERROR';

    return 'FIGMA_ERROR';
  }

  private getParseErrorSuggestion(errorCode: string): ErrorSuggestion {
    const suggestions: { [key: string]: ErrorSuggestion } = {
      'SYNTAX_ERROR': {
        title: 'Fix Syntax Error',
        description: 'Check your React component syntax. Make sure all JSX elements are properly closed and all parentheses are balanced.',
        code: '// Example of correct syntax:\nconst MyComponent = () => {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n};'
      },
      'UNEXPECTED_TOKEN': {
        title: 'Fix Unexpected Token',
        description: 'There is an unexpected character in your code. Check for missing semicolons, commas, or parentheses.',
        code: '// Make sure to close all brackets and parentheses\nconst MyComponent = () => {\n  return <div>Hello</div>;\n};'
      },
      'MISSING_SYNTAX': {
        title: 'Add Missing Syntax',
        description: 'You are missing required syntax elements like closing brackets, parentheses, or quotes.',
        code: '// Ensure all syntax elements are properly closed\nconst MyComponent = () => {\n  return (\n    <div>\n      <p>Hello World</p>\n    </div>\n  );\n};'
      },
      'UNCLOSED_SYNTAX': {
        title: 'Close Unclosed Elements',
        description: 'You have unclosed JSX elements, brackets, or parentheses. Make sure to close all opening elements.',
        code: '// Close all JSX elements\n<div>\n  <span>Hello</span>\n  <span>World</span>\n</div>'
      },
      'UNTERMINATED_STRING': {
        title: 'Fix String Literals',
        description: 'You have an unterminated string literal. Make sure all strings are properly closed with quotes.',
        code: '// Properly close string literals\nconst message = "Hello World";\nconst title = \'My Title\';'
      },
      'UNEXPECTED_END': {
        title: 'Complete Your Code',
        description: 'Your code ended unexpectedly. Make sure all functions, components, and blocks are properly completed.',
        code: '// Complete your component\nconst MyComponent = () => {\n  return <div>Hello</div>;\n};'
      }
    };

    return suggestions[errorCode] || {
      title: 'Fix Parse Error',
      description: 'There was an error parsing your React component. Please check the syntax and try again.',
      code: '// Check your component syntax\nconst MyComponent = () => {\n  return <div>Hello</div>;\n};'
    };
  }

  private getFigmaErrorSuggestion(errorCode: string): ErrorSuggestion {
    const suggestions: { [key: string]: ErrorSuggestion } = {
      'PERMISSION_ERROR': {
        title: 'Check Figma Permissions',
        description: 'The plugin does not have the required permissions to perform this action. Make sure the plugin is properly installed and has the necessary permissions.',
        link: 'https://www.figma.com/plugin-docs/plugin-permissions/'
      },
      'NOT_FOUND_ERROR': {
        title: 'Check Component References',
        description: 'The referenced component or element was not found. Make sure all component names and references are correct.',
        code: '// Check component names\n<Card>\n  <Button>Click me</Button>\n</Card>'
      },
      'INVALID_PARAMETER': {
        title: 'Fix Invalid Parameters',
        description: 'One or more parameters passed to the Figma API are invalid. Check the parameter values and types.',
        code: '// Use valid parameter values\nfigma.createComponent();\nfigma.createFrame();'
      },
      'LIMIT_EXCEEDED': {
        title: 'Reduce Component Count',
        description: 'You have exceeded the maximum number of components that can be created. Try reducing the number of components or process them in smaller batches.',
        code: '// Process components in batches\nconst batchSize = 10;\nfor (let i = 0; i < components.length; i += batchSize) {\n  const batch = components.slice(i, i + batchSize);\n  // Process batch\n}'
      },
      'TIMEOUT_ERROR': {
        title: 'Reduce Processing Load',
        description: 'The operation timed out. Try reducing the complexity of your components or processing them in smaller batches.',
        code: '// Use async processing\nconst processComponent = async (component) => {\n  // Process component\n  await new Promise(resolve => setTimeout(resolve, 100));\n};'
      },
      'NETWORK_ERROR': {
        title: 'Check Network Connection',
        description: 'There was a network error. Check your internet connection and try again.',
        link: 'https://www.figma.com/status/'
      }
    };

    return suggestions[errorCode] || {
      title: 'Fix Figma Error',
      description: 'There was an error with the Figma API. Please try again or check the Figma documentation.',
      link: 'https://www.figma.com/plugin-docs/'
    };
  }

  private getValidationErrorSuggestion(message: string): ErrorSuggestion {
    if (message.includes('required')) {
      return {
        title: 'Add Required Fields',
        description: 'Some required fields are missing. Make sure to provide all necessary information.',
        code: '// Add required props\n<MyComponent\n  requiredProp="value"\n  anotherRequiredProp={true}\n/>'
      };
    }

    if (message.includes('invalid type')) {
      return {
        title: 'Fix Type Mismatch',
        description: 'The type of a value does not match the expected type. Check the data types of your props.',
        code: '// Use correct types\n<MyComponent\n  count={42} // number\n  name="John" // string\n  active={true} // boolean\n/>'
      };
    }

    if (message.includes('duplicate')) {
      return {
        title: 'Remove Duplicates',
        description: 'There are duplicate values or identifiers. Remove duplicates and ensure uniqueness.',
        code: '// Remove duplicate props\n<MyComponent\n  id="unique-id"\n  name="unique-name"\n/>'
      };
    }

    return {
      title: 'Fix Validation Error',
      description: 'There was a validation error. Please check your input and try again.',
      code: '// Check your component structure\n<MyComponent\n  prop1="value1"\n  prop2="value2"\n/>'
    };
  }

  public getErrorReport(): ErrorReport {
    const criticalErrors = this.errors.filter(error =>
      ['SYNTAX_ERROR', 'PERMISSION_ERROR', 'NETWORK_ERROR'].includes(error.code)
    ).length;

    const fixableErrors = this.errors.filter(error =>
      error.suggestion && error.suggestion.length > 0
    ).length;

    return {
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions,
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        criticalErrors,
        fixableErrors
      }
    };
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

  public hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  public hasCriticalErrors(): boolean {
    return this.errors.some(error =>
      ['SYNTAX_ERROR', 'PERMISSION_ERROR', 'NETWORK_ERROR'].includes(error.code)
    );
  }

  public getErrorsByComponent(componentName: string): ProcessingError[] {
    return this.errors.filter(error => error.component === componentName);
  }

  public getWarningsByComponent(componentName: string): ProcessingWarning[] {
    return this.warnings.filter(warning => warning.component === componentName);
  }

  public getErrorsByCode(errorCode: string): ProcessingError[] {
    return this.errors.filter(error => error.code === errorCode);
  }

  public getWarningsByCode(warningCode: string): ProcessingWarning[] {
    return this.warnings.filter(warning => warning.code === warningCode);
  }

  public clearErrorsByComponent(componentName: string): void {
    this.errors = this.errors.filter(error => error.component !== componentName);
    this.warnings = this.warnings.filter(warning => warning.component !== componentName);
  }

  public clearErrorsByCode(errorCode: string): void {
    this.errors = this.errors.filter(error => error.code !== errorCode);
    this.warnings = this.warnings.filter(warning => warning.code !== errorCode);
  }

  public exportErrors(): string {
    const report = this.getErrorReport();
    return JSON.stringify(report, null, 2);
  }

  public importErrors(errorData: string): void {
    try {
      const report = JSON.parse(errorData);
      this.errors = report.errors || [];
      this.warnings = report.warnings || [];
      this.suggestions = report.suggestions || [];
    } catch (error) {
      console.error('Failed to import error data:', error);
    }
  }

  public getErrorSummary(): string {
    const report = this.getErrorReport();
    const { totalErrors, totalWarnings, criticalErrors, fixableErrors } = report.summary;

    let summary = `Found ${totalErrors} errors and ${totalWarnings} warnings`;

    if (criticalErrors > 0) {
      summary += ` (${criticalErrors} critical)`;
    }

    if (fixableErrors > 0) {
      summary += ` (${fixableErrors} fixable)`;
    }

    return summary;
  }

  public getErrorDetails(): string {
    const report = this.getErrorReport();
    let details = '';

    if (report.errors.length > 0) {
      details += 'Errors:\n';
      report.errors.forEach((error, index) => {
        details += `${index + 1}. [${error.code}] ${error.message}`;
        if (error.component) details += ` (Component: ${error.component})`;
        if (error.line) details += ` (Line: ${error.line})`;
        if (error.suggestion) details += `\n   Suggestion: ${error.suggestion}`;
        details += '\n';
      });
    }

    if (report.warnings.length > 0) {
      details += '\nWarnings:\n';
      report.warnings.forEach((warning, index) => {
        details += `${index + 1}. [${warning.code}] ${warning.message}`;
        if (warning.component) details += ` (Component: ${warning.component})`;
        if (warning.line) details += ` (Line: ${warning.line})`;
        if (warning.suggestion) details += `\n   Suggestion: ${warning.suggestion}`;
        details += '\n';
      });
    }

    return details;
  }
}

export default ErrorHandler;
