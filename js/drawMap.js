
function drawMap(){
var map = new Datamap({
  scope: 'world',
  element: document.getElementById('container1'),
  projection: 'mercator',
  height: 350,
  width:450,
  fills: {
    defaultFill: '#20B2AA',
    lt50: '#20B2AA',
    gt50: '#ff80bf'
  },

  data: {
    USA: {fillKey: 'lt50' },
    RUS: {fillKey: 'lt50' },
    CAN: {fillKey: 'lt50' },
    BRA: {fillKey: 'lt50' },
    ARG: {fillKey: 'tt50'},
    COL: {fillKey: 'lt50' },
    DZA: {fillKey: 'gt50' },
    ZAF: {fillKey: 'lt50' },
    MAD: {fillKey: 'lt50' }
  }
})


//sample of the arc plugin
map.arc([
 {
  origin: {
      latitude: 49.246292,
      longitude: -123.116226
  },
  destination: {
      latitude: 37.618889,
      longitude: -122.375
  }
},
{
    origin: {
        latitude: 49.2462922,
        longitude: -123.116226
    },
    destination: {
        latitude: 25.793333,
        longitude: -0.290556
    }
},
{
    origin: {
        latitude: 49.2462922,
        longitude: -123.116226
    },
    destination: {
        latitude: 21.0000,
        longitude: 78.0000
    }
},
{
    origin: {
        latitude: 49.2462922,
        longitude: -123.116226
    },
    destination: {
        latitude: 61.5240,
        longitude: 105.3188
    }
},
{
    origin: {
        latitude: 49.2462922,
        longitude: -123.116226
    },
    destination: {
        latitude: -37.814251,
        longitude: 144.963169
    }
}
], {strokeWidth: 1, arcSharpness: 3});
}
