<script>
  import { onMount } from 'svelte'
  import { VelibMap } from './map/VelibMap'

  const markers = {}

  onMount(() => {

    const urlParams = new URLSearchParams(window.location.search)

    const zoom = urlParams.get('zoom') || 17
    const lat = urlParams.get('lat') || 48.86
    const lon = urlParams.get('lon') || 2.34

    const velibMap = new VelibMap('map')
    velibMap.map.setView([lat, lon], zoom)

    // velibMap.map.on('moveend', () => refresh(velibMap))
    // velibMap.map.on('zoomend', () => refresh(velibMap))
    // refresh(velibMap)

  })

  const refresh = (velibMap) => {
    const map = velibMap.map
    const velibStationUrl = 'https://www.velib-metropole.fr/webapi/map/details' +
      '?gpsTopLatitude=' + map.getBounds().getNorth() +
      '&gpsTopLongitude=' + map.getBounds().getEast() +
      '&gpsBotLatitude=' + map.getBounds().getSouth() +
      '&gpsBotLongitude=' + map.getBounds().getWest() +
      '&zoomLevel=' + map.getZoom()
    console.log('calling url: ' + velibStationUrl)

    return  fetch(velibStationUrl)
      .then(response => response.json())
      .then(stationStates => {
        // sync back the global station map
        stationStates.forEach(function (stationState) {
          const code = stationState.station.code
          if (markers[code]) {
            markers[code].visible = true
          } else {
            const gps = stationState.station.gps
            const marker = L.marker([gps.latitude, gps.longitude])
//            marker.addTo(map)
            marker.visible = true
            markers[code] = marker
          }

        })

        const visibleMarkers = []
        const hiddenMarkers = []
        Object.keys(markers).forEach(function (key) {
          const marker = markers[key]
          if (marker.visible) {
            delete marker.visible
            visibleMarkers.push(marker)
          } else {
            hiddenMarkers.push(marker)
          }
        })

        velibMap.markersCluster.addLayers(visibleMarkers)
        velibMap.markersCluster.removeLayers(hiddenMarkers)

      })

  }

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
