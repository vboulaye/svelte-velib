<script>
  import { onMount } from 'svelte'
  import { mapBuilder } from './map/mapBuilder'

  const markers = {}

  onMount(() => {

    const urlParams = new URLSearchParams(window.location.search)

    const zoom = urlParams.get('zoom') || 17
    const lat = urlParams.get('lat') || 48.86
    const lon = urlParams.get('lon') || 2.34

    const map = mapBuilder('map').setView([lat, lon], zoom)

    refresh(map)

  })

  const refresh = (map) => {
    const velibStationUrl = 'https://www.velib-metropole.fr/webapi/map/details' +
      '?gpsTopLatitude=' + map.getBounds().getNorth() +
      '&gpsTopLongitude=' + map.getBounds().getEast() +
      '&gpsBotLatitude=' + map.getBounds().getSouth() +
      '&gpsBotLongitude=' + map.getBounds().getWest() +
      '&zoomLevel=' + map.getZoom()
    console.log('calling url: ' + velibStationUrl)

    fetch(velibStationUrl)
      .then(response => response.json())
      .then(stationStates => {
        // sync back the global station map
        stationStates.forEach(function (stationState) {
          if (markers[stationState.station.code]) {
            markers[key].visible = true
          } else {
            const gps = stationState.station.gps
            const marker = L.marker([gps.latitude, gps.longitude])
            marker.addTo(map)
            marker.visible=true
            markers[stationState.station.code] = marker
          }

        })

        Object.keys(markers).forEach(function (key) {
          const marker = markers[key]
          if (markers[key].visible) {
            delete markers[key].visible
          } else {
            map.removeLayer(markers[key])
          }
        })

      })

  }

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
