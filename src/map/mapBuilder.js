
import * as L from 'leaflet'
import 'leaflet.locatecontrol'
import 'leaflet-control-geocoder'

export function mapBuilder(id) {

  const map = L.map(id)

// Wikimedia
  var wikimediaLayer = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
    maxZoom: 19
  });
  wikimediaLayer.addTo(map);

// OpenStreetMap
  const osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

// Satellite layer
  var satelliteLayer = L.tileLayer('http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'ESRI'
  })

  const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  const ocmlink = '<a href="http://thunderforest.com/">Thunderforest</a>';
  const openCycleLayer = L.tileLayer(
    'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
      attribution: '&copy; '+mapLink+' Contributors & '+ocmlink,
      maxZoom: 18,
    })

  // Public Transport
  const transportLayer = L.tileLayer('http://openptmap.org/tiles/{z}/{x}/{y}.png',{
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
      'wikimedia' : wikimediaLayer,
      'OpenStreetMap' : osmLayer,
      'Satellite': satelliteLayer,
      'OpenCycleMap' : openCycleLayer,
    },
    {
       'Transport' : transportLayer,
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
      title: "where am i?"
    },
    locateOptions: {
      maxZoom: 16,
      enableHighAccuracy: true
    }
  }).addTo(map);


  // add search by address
  L.Control.geocoder()
    .addTo(map);

  return map
}
