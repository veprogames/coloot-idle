import './app.postcss'
import App from './App.svelte'
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
    onNeedRefresh() {
        if(confirm("Update available! Refresh?")) {
            updateSW(true);
        }
    },
});

const app = new App({
    target: document.getElementById('app') ?? document.createElement("div"),
})

export default app
