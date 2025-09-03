import { createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

// Lightweight theme scaffold. You can later wire design-tokens.json mapping.
export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        secondary: { main: '#9c27b0' }
    },
})

export const AppCssBaseline = CssBaseline


