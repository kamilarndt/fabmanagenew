import { ComponentAnalyzer } from './src/analyzers/component-analyzer'
import { AntdDesignSystem } from './src/config/antd-design-system'
import { FabManageComponentGenerators } from './src/generators/fabmanage-component-generators'
import { DesignSystemGenerator } from './src/generators/design-system-generator'

// Main plugin code
console.log('FabManage Design System Plugin started!')

// Show UI
figma.showUI(__html__, {
    width: 800,
    height: 600,
    title: 'FabManage Design System Generator'
})

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
    try {
        switch (msg.type) {
            case 'generate-project-card':
                await handleGenerateProjectCard(msg.data)
                break

            case 'generate-project-elements':
                await handleGenerateProjectElements(msg.data)
                break

            case 'generate-design-system':
                await handleGenerateDesignSystem()
                break

            case 'analyze-components':
                await handleAnalyzeComponents()
                break

            case 'generate-component':
                await handleGenerateComponent(msg.componentId)
                break

            case 'create-variables':
                await handleCreateVariables()
                break

            default:
                console.warn('Unknown message type:', msg.type)
        }
    } catch (error) {
        console.error('Plugin error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        figma.notify('Błąd: ' + errorMessage, { error: true })
        figma.ui.postMessage({
            type: 'generation-error',
            error: errorMessage
        })
    }
}

// Handle ProjectCard generation
async function handleGenerateProjectCard(projectData: any) {
    try {
        // Create variables if they don't exist
        await AntdDesignSystem.createAllVariables()

        // Generate ProjectCard
        const projectCard = await FabManageComponentGenerators.createProjectCard(projectData)

        // Position on canvas
        projectCard.x = 100
        projectCard.y = 100

        // Add to current page
        figma.currentPage.appendChild(projectCard)

        // Select the generated component
        figma.currentPage.selection = [projectCard]
        figma.viewport.scrollAndZoomIntoView([projectCard])

        figma.notify('ProjectCard wygenerowany!')
        figma.ui.postMessage({
            type: 'generation-complete',
            component: 'ProjectCard'
        })

    } catch (error) {
        console.error('Error generating ProjectCard:', error)
        figma.notify('Błąd generowania ProjectCard', { error: true })
        figma.ui.postMessage({
            type: 'generation-error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
}

// Handle ProjectElements generation
async function handleGenerateProjectElements(projectElementsData: any) {
    try {
        // Create variables if they don't exist
        await AntdDesignSystem.createAllVariables()

        // Generate ProjectElements
        const projectElements = await FabManageComponentGenerators.createProjectElements(projectElementsData)

        // Position on canvas
        projectElements.x = 100
        projectElements.y = 100

        // Add to current page
        figma.currentPage.appendChild(projectElements)

        // Select the generated component
        figma.currentPage.selection = [projectElements]
        figma.viewport.scrollAndZoomIntoView([projectElements])

        figma.notify('ProjectElements wygenerowane!')
        figma.ui.postMessage({
            type: 'generation-complete',
            component: 'ProjectElements'
        })

    } catch (error) {
        console.error('Error generating ProjectElements:', error)
        figma.notify('Błąd generowania ProjectElements', { error: true })
        figma.ui.postMessage({
            type: 'generation-error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
}

// Handle Design System generation
async function handleGenerateDesignSystem() {
    try {
        // Create variables first
        await AntdDesignSystem.createAllVariables()

        // Generate complete design system
        await DesignSystemGenerator.generateDesignSystem()

        figma.notify('Design System wygenerowany!')
        figma.ui.postMessage({
            type: 'generation-complete',
            component: 'DesignSystem'
        })

    } catch (error) {
        console.error('Error generating Design System:', error)
        figma.notify('Błąd generowania Design System', { error: true })
        figma.ui.postMessage({
            type: 'generation-error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
}

// Handle component analysis
async function handleAnalyzeComponents() {
    try {
        const components = ComponentAnalyzer.getAllComponents()
        const atoms = ComponentAnalyzer.getComponentsByType('atom')
        const molecules = ComponentAnalyzer.getComponentsByType('molecule')
        const organisms = ComponentAnalyzer.getComponentsByType('organism')

        console.log('Component Analysis:', {
            total: components.length,
            atoms: atoms.length,
            molecules: molecules.length,
            organisms: organisms.length
        })

        figma.notify(`Przeanalizowano ${components.length} komponentów`)
        figma.ui.postMessage({
            type: 'analysis-complete',
            data: {
                total: components.length,
                atoms: atoms.length,
                molecules: molecules.length,
                organisms: organisms.length
            }
        })

    } catch (error) {
        console.error('Error analyzing components:', error)
        figma.notify('Błąd analizy komponentów', { error: true })
        figma.ui.postMessage({
            type: 'generation-error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
}

// Handle single component generation
async function handleGenerateComponent(componentId: string) {
    try {
        // Create variables if they don't exist
        await AntdDesignSystem.createAllVariables()

        const components = ComponentAnalyzer.getAllComponents()
        const component = components.find(c => c.id === componentId)

        if (!component) {
            throw new Error(`Component ${componentId} not found`)
        }

        let generatedComponent: FrameNode | null = null

        switch (component.type) {
            case 'atom':
                generatedComponent = await generateAtomComponent(component)
                break
            case 'molecule':
                generatedComponent = await generateMoleculeComponent(component)
                break
            case 'organism':
                generatedComponent = await generateOrganismComponent(component)
                break
        }

        if (generatedComponent) {
            // Position on canvas
            generatedComponent.x = 100
            generatedComponent.y = 100

            // Add to current page
            figma.currentPage.appendChild(generatedComponent)

            // Select the generated component
            figma.currentPage.selection = [generatedComponent]
            figma.viewport.scrollAndZoomIntoView([generatedComponent])

            figma.notify(`${component.name} wygenerowany!`)
            figma.ui.postMessage({
                type: 'generation-complete',
                component: component.name
            })
        }

    } catch (error) {
        console.error('Error generating component:', error)
        figma.notify('Błąd generowania komponentu', { error: true })
        figma.ui.postMessage({
            type: 'generation-error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
}

// Handle variables creation
async function handleCreateVariables() {
    try {
        await AntdDesignSystem.createAllVariables()
        figma.notify('Zmienne design systemu utworzone!')
        figma.ui.postMessage({
            type: 'variables-created'
        })
    } catch (error) {
        console.error('Error creating variables:', error)
        figma.notify('Błąd tworzenia zmiennych', { error: true })
        figma.ui.postMessage({
            type: 'generation-error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
}

// Helper functions for component generation
async function generateAtomComponent(component: any): Promise<FrameNode | null> {
    // Implementation for atom components
    return null
}

async function generateMoleculeComponent(component: any): Promise<FrameNode | null> {
    // Implementation for molecule components
    return null
}

async function generateOrganismComponent(component: any): Promise<FrameNode | null> {
    // Implementation for organism components
    return null
}

// Handle plugin close
figma.on('close', () => {
    console.log('Plugin closed')
})
