import * as L from 'leaflet'
import 'leaflet.locatecontrol'
import 'leaflet-control-geocoder'
import 'leaflet.markercluster'
import 'leaflet-layerjson'
import 'leaflet-control-custom'

// hack to repair the marker links from leaflet pssing through webpack
// https://github.com/Leaflet/Leaflet/issues/4968
// import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

/// end hack

export function VelibMap(id, webcom) {

  const map = L.map(id)

// Wikimedia
  var wikimediaLayer = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
    maxZoom: 19
  })
  wikimediaLayer.addTo(map)

// OpenStreetMap
  const osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  })

// Satellite layer
  var satelliteLayer = L.tileLayer('http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'ESRI'
  })

  const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>'
  const ocmlink = '<a href="http://thunderforest.com/">Thunderforest</a>'
  const openCycleLayer = L.tileLayer(
    'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors & ' + ocmlink,
      maxZoom: 18,
    })

  // Public Transport
  const transportLayer = L.tileLayer('http://openptmap.org/tiles/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openptmap.org/" target="_blank" rel="noopener noreferrer">OpenPTMap</a> / <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OSM Contributors</a>',
    maxZoom: 22,
  })
  const tempLayer = L.tileLayer('https://a.sat.owm.io/vane/2.0/weather/TA2/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2&fill_bound', {
    attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a> contributors'
  })
  const precipitationLayer = L.tileLayer('https://a.sat.owm.io/vane/2.0/weather/PA0/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2&fill_bound', {
    attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a> contributors'
  })

  L.control.layers(
    {
      'wikimedia': wikimediaLayer,
      'OpenStreetMap': osmLayer,
      'Satellite': satelliteLayer,
      'OpenCycleMap': openCycleLayer,
    },
    {
      'Transport': transportLayer,
      // 'Station' : stationLayerGroup,
      // 'Isochrones': isochrones,
      // 'Bars' : barsLayer(),
      'Temperature': tempLayer,
      'Precipitation': precipitationLayer,
      // 'Time dimension': timeDimensionHeatmap,
    }
  ).addTo(map)

  //add geolocation control
  L.control.locate({
    position: 'topleft',
    strings: {
      title: 'where am i?'
    },
    locateOptions: {
      maxZoom: 16,
      enableHighAccuracy: true
    }
  }).addTo(map)

  // add search by address
  L.Control.geocoder()
    .addTo(map)

  // set map area limits
  const southWest = L.latLng(48.74, 2.14)
  const northEast = L.latLng(48.98, 2.55)
  map.setMaxBounds(L.latLngBounds(southWest, northEast))
  map.options.minZoom = 11
  map.options.maxBoundsViscosity = 1.0
  new L.Icon.Default()
  var markersCluster = L.markerClusterGroup()
  map.addLayer(markersCluster)

  // loading bloc
  const loader = L.DomUtil.get('loader');


  let buildIcon = function (data) {
    // L.Icon.Default();
    const computeColorClass = (qty) => {
      if (qty < 3) {
        return 'velib-marker-red'
      }
      if (qty < 5) {
        return 'velib-marker-orange'
      }
      return 'velib-marker-green'
    }
    const opts = {
      ...data,
      ...{
        //stats: data.stats?JSON.stringify(data.stats):'nostats',
        bikeMin: data.stats?data.stats.b.m:0,
        ebikeMin: data.stats?data.stats.e.m:0,
        name: data.station.name,
        nbSlots: Math.min(99, data.nbDock + data.nbEDock - data.nbBike - data.nbEbike),
        colorBike: computeColorClass(data.nbBike),
        colorEbike: computeColorClass(data.nbEbike),
        colorSlots: computeColorClass(data.nbDock + data.nbEDock - data.nbBike - data.nbEbike),
      }
    }
    opts.nbBikeDisplay=opts.nbBike-opts.bikeMin
    opts.nbEbikeDisplay=opts.nbEbike-opts.ebikeMin
    return L.divIcon({
      html: L.Util.template('<div class="velib-marker">' +
        '<span class="{colorBike}"><i class="fas fa-fw fa-bicycle" title="min is {bikeMin}"></i>&nbsp;{nbBikeDisplay}</span>' +
        '<span class="{colorEbike}"><i class="fas fa-fw fa-motorcycle" title="min is {ebikeMin}"></i>&nbsp;{nbEbikeDisplay}</span>' +
        '<span class="{colorSlots}"><i class="fas fa-fw fa-parking"></i>&nbsp;{nbSlots}</span>' +
        '</div>', opts),
      iconSize: [52, 52],
      className: 'velib-station-marker'
    })
  };
  const layerJSON = L.layerJSON({
    url: 'https://www.velib-metropole.fr/webapi/map/details' +
      '?gpsTopLatitude={lat2}' +
      '&gpsTopLongitude={lon2}' +
      '&gpsBotLatitude={lat1}' +
      '&gpsBotLongitude={lon1}' +
      '&zoomLevel=13',
    propertyLoc: ['station.gps.latitude', 'station.gps.longitude'],
    propertyTitle: 'station.name',
    caching: true,
    cacheId: function (data, latlng) {
      return data.station.code || latlng.toString()
    },
    layerTarget: markersCluster,
    minZoom: 11, // distance in metter to trigger a refresh call
    minShift: 100, // distance in metter to trigger a refresh call
    updateOutBounds: true, // only refresh when move outside of bounds
    buildIcon: buildIcon,
    // buildPopup: function(data) {
    //   return L.Util.template("<h2>{name}</h2>" +
    //     "<div style='text-align: center'>" +
    //     "<h3>{nbBike}&nbsp;<i class='fas fa-bicycle'></i></h3>" +
    //     "<h3>{nbEbike}&nbsp;<i class=\"fas fa-motorcycle\"></i></h3>" +
    //     "<h3>{nbSlots}&nbsp;<i class=\"fas fa-parking\"></i></h3>" +
    //     "</div>", {...data, ...{
    //       name:data.station.name,
    //       nbSlots:data.nbEDock+data.nbEDock,
    //     }});
    //}
    dataToMarker: (data, loc) => {
      const marker = layerJSON._defaultDataToMarker(data, loc);
      setTimeout(()=>
          webcom.child('station.counter').child(data.station.code).child('s')
            .on('value', (snapshot) => {
              const stats = snapshot.val()
              if (stats) {
                data.stats = stats
                marker.setIcon(buildIcon(data))
                //layerJSON.addMarker(data)
                //map.addLayer(marker)
              }
            })
        ,100)
      return marker
    },
    onEachMarker: (data, marker) => {
      // if (data.stats) {
      //   console.log(marker)
      // }
    },
  })
    .on('dataloading', function (e) {
      loader.style.display = 'block';
    })
    .on('dataloaded', function (e) {
      loader.style.display = 'none';
    })
  map.addLayer(layerJSON)

  L.control.custom({
    position: 'topleft',
    title: 'refresh',
    content: '<a class="leaflet-bar-part leaflet-bar-part-single" title="refresh"><i class="fas fa-sync-alt"></i></a>',
    classes: 'leaflet-control-locate leaflet-bar leaflet-control',
    style:
      {
        //margin: '10px',
        padding: '0',
        cursor: 'pointer',
      },
    events:
      {
        click: function (data) {
          layerJSON.update()
        },
      }
  })
    .addTo(map)


  return {map, markersCluster}
}
