var visgexf = {
  sig: null,
  filters: {},
  graph: null,
  activeFilterId: null,
  activeFilterVal: null,
  sourceColor: '#67A9CF',
  targetColor: '#EF8A62',
  init: function(visid, filename) {
    visgexf.sig = sigma.init(document.getElementById(visid)).drawingProperties({
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      defaultLabelBGColor: '#fff',
      defaultLabelHoverColor: '#000',
      labelThreshold: 3,
      defaultEdgeType: 'curve'
    }).graphProperties({
      minNodeSize: 0.4,
      maxNodeSize: 20,
      minEdgeSize: 1,
      maxEdgeSize: 1
    }).mouseProperties({
      maxRatio: 128
    });
    visgexf.sig.parseGexf(filename);
    visgexf.sig.draw();

    // events
    visgexf.sig.bind('overnodes', function(event){
      var hnode = visgexf.sig.getNodes(event.content)[0];
      if (0 == hnode.degree) return;
      var zoomratio = visgexf.sig.graphProperties().position().ratio;
      var sources = {},
          targets = {};
      visgexf.sig.iterEdges(function(e){
        if (e.source != hnode.id && e.target != hnode.id) {
          e.hidden = 1;
        } else if (e.source == hnode.id) {
          targets[e.target] = true;
          e.color = visgexf.sourceColor;
        } else if (e.target == hnode.id) {
          sources[e.source] = true;
          e.color = visgexf.targetColor;
        }
      }).iterNodes(function(n){
        if (n.id == hnode.id) {
          n.hidden = 0;
        } else if (sources[n.id]) {
          n.color = visgexf.targetColor;
        } else if (targets[n.id]) {
          n.color = visgexf.sourceColor;
        }
        else {
          n.hidden = 1;
        }
      }).draw(2,2,2);
    }).bind('outnodes',function(event){
      visgexf.sig.iterNodes(function(n){
        n.hidden = 0;
        if (null !== visgexf.activeFilterId && null !== visgexf.activeFilterVal && !visgexf.nodeHasFilter(n, visgexf.activeFilterId, visgexf.activeFilterVal)) {
          n.hidden = 1;
        }
      }).iterEdges(function(e){
        e.hidden = 0;
      }).draw(2,2,2);
    });

    $('body').bind('mousewheel', function(){
      var zoomratio = visgexf.sig.graphProperties().position().ratio;
      if (zoomratio > 3)
        visgexf.sig.iterNodes(function(n){ n.forceLabel = 1; });
      else
        visgexf.sig.iterNodes(function(n){ n.forceLabel = 0; });
    });
    return visgexf;
  },

  // called with array of ids of attributes to use as filters
  getFilters: function(attrids) {
    visgexf.sig.iterNodes(function(n) {
      n.attr.attributes.map(function(node) {
        if (-1 !== attrids.indexOf(parseInt(node.attr))) {
          var vals = node.val.split('|');
          for (v in vals) {
            val = vals[v];
            if (!visgexf.filters.hasOwnProperty(val)) {
              visgexf.filters[val] = 0;
            }
            visgexf.filters[val]++;
          }
        }
      });
    });
    // sort by frequencies of filter attributes
    var sorted = [];
    for (var a in visgexf.filters) {
      sorted.push([a, visgexf.filters[a]]);
    }
    sorted.sort(function(a, b) { return b[1] - a[1] });
    return sorted;
  },

  nodeHasFilter: function(node, filterid, filterval) {
    var hasFilter = false;
    for (i in node.attr.attributes) {
      var item = node.attr.attributes[i];
      if (filterid === parseInt(item.attr)) {
        if (-1 !== item.val.indexOf(filterval)) {
          hasFilter = true;
          break;
        }
      }
    }
    return hasFilter;
  },

  // show only nodes that match filter
  setFilter: function(filterid, filterval) {
    visgexf.activeFilterId = filterid;
    visgexf.activeFilterVal = filterval;
    visgexf.sig.iterNodes(function(n){
      n.hidden = filterval ? 1 : 0;
      if (visgexf.nodeHasFilter(n, filterid, filterval)) {
        n.hidden = 0;
      }
    }).draw(2,2,2);
  }
};
