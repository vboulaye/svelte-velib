<script>
  import { onMount } from 'svelte'
  import { VelibMap } from './VelibMap'
  import VelibWebcom from '../webcom/velib-webcom.js'

  const markers = {}

  onMount(() => {

    const urlParams = new URLSearchParams(window.location.search)

    const zoom = urlParams.get('zoom') || 17
    const lat = urlParams.get('lat') || 48.8294438
    const lon = urlParams.get('lon') || 2.37646


  // auth and keep trac
  new VelibWebcom().auth()
    .then(webcom => {

        const velibMap = new VelibMap('map', webcom)
        velibMap.map.setView([lat, lon], zoom)

    })


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

    #loader {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
    }
    .center-container {
        width: 60px;
        height: 60px;
        font-size: 60px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -30px;
        margin-right: 0;
        margin-bottom: 0;
        margin-left: -30px;
        z-index: -1;
    }
</style>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
</svelte:head>

<div id="map"></div>
<div id="loader" >
    <div class="center-container">
        <i class="fa fa-sync-alt fa-spin"></i>
    </div>
</div>
