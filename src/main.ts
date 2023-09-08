import './app.postcss'
import App from './App.svelte'

const app = new App({
    target: document.getElementById('app') ?? document.createElement("div"),
})

export default app
