<script>
  import { onMount } from 'svelte'
  import { VelibMap } from './VelibMap'

  const markers = {}

  onMount(() => {

    const urlParams = new URLSearchParams(window.location.search)

    const zoom = urlParams.get('zoom') || 17
    const lat = urlParams.get('lat') || 48.8294438
    const lon = urlParams.get('lon') || 2.37646

    const velibMap = new VelibMap('map')
    velibMap.map.setView([lat, lon], zoom)

  })

</script>

<style>
    @import '~leaflet/dist/leaflet.css';
    @import '~@fortawesome/fontawesome-free/css/all.css';
    @import '~leaflet.locatecontrol/dist/L.Control.Locate.css';
    @import '~leaflet-control-geocoder/dist/Control.Geocoder.css';
    @import '~leaflet.markercluster/dist/MarkerCluster.css';
    @import '~leaflet.markercluster/dist/MarkerCluster.Default.css';

    #map {
        height: 100%;
        width: 100vw;
    }



</style>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
</svelte:head>

<div id="map"></div>
