var nodeClick = function(Graph) {
  Graph.sig.bind('upnodes', function(event){
    hnode = Graph.sig.getNodes(event.content)[0];
  });
};

$(function(){
  var props = {
    drawing: {
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      defaultLabelBGColor: '#fff',
      defaultLabelHoverColor: '#000',
      labelThreshold: 7,
      defaultEdgeType: 'curve'
    },
    graph: {
      minNodeSize: .1,
      maxNodeSize: 30,
      minEdgeSize: 1,
      maxEdgeSize: 1
    },
    forceLabel: 1,
    type: 'directed'
  }

  visgexf.init('sig', '/gexf/visualisingdata-census-twitter-processed.json', props, function() {
    nodeClick(visgexf);
  });
});