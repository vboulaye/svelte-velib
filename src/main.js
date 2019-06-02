import App from './App.svelte';


// import { Plugins } from '@capacitor/core';
// const { Geolocation, Modals } = Plugins;

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

window.app = app;

export default app;