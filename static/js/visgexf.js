var visgexf = {
  sig: null,
  attr: {},
  init: function(visid, filename) {
    visgexf.sig = sigma.init(document.getElementById(visid)).drawingProperties({
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      defaultLabelBGColor: '#fff',
      defaultLabelHoverColor: '#000',
      labelThreshold: 4,
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
      var hlinks = {};
      visgexf.sig.iterEdges(function(e){
        if (e.source != hnode.id && e.target != hnode.id) {
          e.hidden = 1;
        } else if (e.source == hnode.id) {
          hlinks[e.target] = true;
        }
      }).iterNodes(function(n){
        if (n.id != hnode.id && !hlinks[n.id]) {
          n.hidden = 1;
        }
      }).draw(2,2,2);
    }).bind('outnodes',function(event){
      visgexf.sig.iterNodes(function(n){
        n.hidden = 0;
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

  graphAttr: function() {
    visgexf.sig.iterNodes(function(n) {
      n.attr.attributes.map(function(node) {
        if(!Number.isNaN(parseInt(node.attr))) {
          var val = node.val;
          if (!visgexf.attr.hasOwnProperty(val)) {
            visgexf.attr[val] = 0;
          }
          visgexf.attr[val]++;
        }
      });
    });

    var sorted = [];
    for (var a in visgexf.attr) {
      sorted.push([a, visgexf.attr[a]]);
    }
    sorted.sort(function(a, b) { return b[1] - a[1] });
    return sorted;
  }
};
