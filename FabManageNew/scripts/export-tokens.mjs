// Export CSS custom properties from theme files into a simple JSON token file
// Usage: node scripts/export-tokens.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '..')
const SRC_STYLES = path.resolve(ROOT, 'src', 'styles')

const INPUTS = [
    path.join(SRC_STYLES, 'modern-theme.css'),
    path.join(SRC_STYLES, 'wide-screen.css'),
    path.join(SRC_STYLES, 'responsive.css')
]

const OUTPUT = path.resolve(ROOT, 'design-tokens.json')

function readFileSafe(p) {
    try {
        return fs.readFileSync(p, 'utf8')
    } catch {
        return ''
    }
}

function extractBlocks(css) {
    // Very lightweight parser: split by closing braces, track selector → body
    const blocks = []
    let remainder = css
    while (remainder.length) {
        const startSel = remainder.indexOf('{')
        if (startSel === -1) break
        const selector = remainder.slice(0, startSel).trim().split(/\s+/).join(' ')
        remainder = remainder.slice(startSel + 1)
        const end = remainder.indexOf('}')
        if (end === -1) break
        const body = remainder.slice(0, end)
        blocks.push({ selector, body })
        remainder = remainder.slice(end + 1)
    }
    return blocks
}

function extractVarsFromBody(body) {
    const vars = {}
    const varRe = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g
    let m
    while ((m = varRe.exec(body))) {
        const name = m[1]
        const value = m[2].trim()
        vars[name] = value
    }
    return vars
}

function mergeVars(target, source) {
    for (const [k, v] of Object.entries(source)) {
        target[k] = v
    }
}

function categorize(vars) {
    const colors = {}
    const shadows = {}
    const borders = {}
    const spacing = {}
    const breakpoints = {}
    const typography = {}

    for (const [name, value] of Object.entries(vars)) {
        if (name.startsWith('shadow-')) {
            shadows[name] = value
            continue
        }
        if (name.startsWith('border-')) {
            borders[name] = value
            continue
        }
        if (name === 'gutter' || name === 'header-h' || name === 'card-min' || name === 'gap-size' || name === 'card-min-width') {
            spacing[name] = value
            continue
        }
        if (['mobile', 'tablet', 'desktop', 'wide-desktop', 'ultra-wide', 'super-ultra-wide', 'extreme-wide'].includes(name)) {
            breakpoints[name] = value
            continue
        }
        if (name.startsWith('text-')) {
            // fluid typography tokens like text-xs, text-base, etc.
            typography[name] = value
            continue
        }
        // Colors and semantic tokens
        if (
            name.startsWith('primary-') ||
            name.startsWith('bg-') ||
            name.startsWith('text-') ||
            name.startsWith('accent-') ||
            name.startsWith('status-')
        ) {
            colors[name] = value
            continue
        }
    }

    return { colors, shadows, borders, spacing, breakpoints, typography }
}

function main() {
    const cssAll = INPUTS.map(readFileSafe).join('\n')
    const blocks = extractBlocks(cssAll)

    const rootVars = {}
    const darkVars = {}
    const skinBorderedVars = {}
    const darkBorderedVars = {}

    for (const { selector, body } of blocks) {
        const vars = extractVarsFromBody(body)
        if (!Object.keys(vars).length) continue

        if (/^:root\b/.test(selector)) {
            mergeVars(rootVars, vars)
        } else if (/\[data-theme="dark"\]/.test(selector)) {
            mergeVars(darkVars, vars)
        } else if (/\[data-skin="bordered"\](?!\[)/.test(selector)) {
            mergeVars(skinBorderedVars, vars)
        } else if (/\[data-skin="bordered"\]\[data-theme="dark"\]/.test(selector)) {
            mergeVars(darkBorderedVars, vars)
        }
    }

    const lightCategories = categorize(rootVars)
    const darkCategories = categorize({ ...rootVars, ...darkVars })

    const tokens = {
        $schema: 'https://docs.tokens.studio/schemas/tokens.json',
        meta: {
            source: 'extracted-from-css',
            generatedAt: new Date().toISOString()
        },
        light: lightCategories,
        dark: darkCategories,
        variants: {
            skin: {
                bordered: {
                    light: categorize({ ...rootVars, ...skinBorderedVars }),
                    dark: categorize({ ...rootVars, ...darkVars, ...darkBorderedVars })
                }
            }
        }
    }

    fs.writeFileSync(OUTPUT, JSON.stringify(tokens, null, 2) + '\n', 'utf8')

    console.log(`Wrote tokens → ${path.relative(ROOT, OUTPUT)}`)
}

main()


