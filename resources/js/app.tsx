import './bootstrap'
import '../css/app.css'

import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { route } from 'ziggy-js'
// @ts-ignore
const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

declare global {
    interface Window {
        Ziggy: any
        route: typeof route
    }
}

let app= createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            //@ts-ignore
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el)
        root.render(<App {...props} />)
    },
    progress: { color: '#4B5563' },
})

Object.assign(window, { route })
