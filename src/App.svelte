<script>
  import { onMount } from 'svelte'
  import { mapBuilder } from './map/mapBuilder'

  onMount(() => {

    const urlParams = new URLSearchParams(window.location.search)

    const zoom = urlParams.get('zoom') || 13
    const lat = urlParams.get('lat') || 48.86
    const lon = urlParams.get('lon') || 2.34

    const map = mapBuilder('map').setView([lat, lon], zoom)

  })
  //link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

</script>

<style>
    @import '~leaflet/dist/leaflet.css';
    @import '~@fortawesome/fontawesome-free/css/all.css';
    @import '~leaflet.locatecontrol/dist/L.Control.Locate.css';
    @import '~leaflet-control-geocoder/dist/Control.Geocoder.css';

    #map {
        height: 100%;
        width: 100vw;
    }

</style>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
</svelte:head>

<div id="map"></div>
