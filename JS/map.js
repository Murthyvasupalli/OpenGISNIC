var bingMapsAerial = new ol.layer.Tile({
    visible: true,
    preload: Infinity,
    source: new ol.source.BingMaps({
        key: 'AhOpRvafzbHsBw2tIH2t5t7L1skJaeCLYu5vt08i-cp55suM6VmEQifUO6GzfRjj',//'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
        imagerySet: 'Aerial',
    })
});

var map = new ol.Map({
    target: 'map',
    layers: [bingMapsAerial,
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([0, 0]),
      zoom: 2
    })
  });

  var geojsonLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'JS/Point.geojson',
      format: new ol.format.GeoJSON()
    })
  });
  
  // Add GeoJSON layer to the map
  map.addLayer(geojsonLayer);