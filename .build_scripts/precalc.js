var fs = require('fs');
var utils = require('./utils');

global.Oci = {};
Oci.data = {
  opgee: {},
  prelim: {}
}
Oci.data.metadata = JSON.parse(fs.readFileSync('app/assets/data/metadata.json'))
Oci.prices = JSON.parse(fs.readFileSync('app/assets/data/prices.json'))
Oci.data.info = JSON.parse(fs.readFileSync('app/assets/data/info.json'))
Oci.data.globalExtents = {}

// Load all data based on metadata
var metadata = Oci.data.metadata
var vi = utils.trimMetadataArray(metadata.venting.split(','));
var si = utils.trimMetadataArray(metadata.solarSteam.split(','));
var wi = utils.trimMetadataArray(metadata.water.split(','));
var fi = utils.trimMetadataArray(metadata.flare.split(','));
var ri = utils.trimMetadataArray(metadata.refinery.split(','));
var pi = utils.trimMetadataArray(metadata.fugitives.split(','));
var gi = [1,0];
var zi = [1,0];
var ai = [1,0];
var ei = [1,0];
var hi = [1,0];
var li = [1,0];

gi.forEach(function (_, g) {
  pi.forEach(function (_, p) {
    vi.forEach(function (_, v) {
      si.forEach(function (_, s) {
        wi.forEach(function (_, w) {
         fi.forEach(function (_, f) {
          var temp = JSON.parse(fs.readFileSync('app/assets/data/opgee/opgee_run' + s + w + f + '.json'));
          Oci.data.opgee['run' + s + w + f] = temp;
         });
        });
      });
    });
  });
});
      
hi.forEach(function (_, h) {
  ei.forEach (function (_, e)}
    zi.forEach(function (_, z) {
      ai.forEach(function (_, a) {
        ri.forEach(function (_, r) {
          li.forEach(function (_, l) {
            var temp = JSON.parse(fs.readFileSync('app/assets/data/prelim/prelim_run' + z + a + r + l + '.json'));
            Oci.data.prelim['run' + z + a + r + l] = temp;
          });
        });
      });
    });
  });
});

var ratios = ['perBarrel', 'perMJ', 'perCurrent', 'perHistoric', 'perDollar'];
var minMaxes = ['min', 'max'];
var components = ['ghgTotal', 'total', 'downstream', 'upstream', 'midstream'];
var oils = Object.keys(Oci.data.info);

ratios.forEach(function (ratio) {
  minMaxes.forEach(function (minMax) {
    components.forEach(function (component) {
      oils.forEach(function (oil) {
        utils.getGlobalExtent(ratio, minMax, component, oil, true);
      });
      utils.getGlobalExtent(ratio, minMax, component, null, true);
    });
  });
});

fs.writeFileSync('app/assets/data/global-extents.json', JSON.stringify(Oci.data.globalExtents));
