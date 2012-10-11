// langinfo must be accessible from the external freebase text service script
var langinfo = function(data) {
  var sl = $('#showlang');
  sl.find('h3').text(hlang.label);

  var desc = data.result + '... <a href="http://www.freebase.com/view/' + hlang.id + '">view on Freebase</a>';

  sl.find('.modal-body').html(desc);
  sl.modal();
};

var menuclick = function(menu, event) {
  event.preventDefault();
  if ('a' == event.target.nodeName.toLowerCase()) {
    var t = $(event.target);
    menu.find('li').removeClass('active');
    t.parent('li').addClass('active');
    return t;
  }
  return false;
};

var nodeClick = function(Graph) {
  Graph.sig.bind('upnodes', function(event){
    hlang = Graph.sig.getNodes(event.content)[0];
    // add script with callback to avoid cross-origin request issues
    var script = document.createElement('script');
    script.src = 'https://usercontent.googleapis.com/freebase/v1/text' + hlang.id + '?callback=langinfo';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};

$(function(){
  var props = {
    drawing: {
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      defaultLabelBGColor: '#fff',
      defaultLabelHoverColor: '#000',
      labelThreshold: 3,
    },
    graph: {
      minNodeSize: 1,
      maxNodeSize: 20,
      minEdgeSize: 1,
      maxEdgeSize: 1
    },
    forceLabel: 0,
    type: 'undirected'
  }

  var G = visgexf.init('sig', '/gexf/jamesbond.gexf', props);
  var filterid = 0;
  var filters = G.getFilters([filterid]);
  nodeClick(G);

  var pmenu = $('#paradigms');
  pmenu.append('<li class="active"><a href="#">All languages (' + G.sig.getNodesCount() + ')</a></li>');
  $.each(filters, function(idx, item) {
    pmenu.append('<li><a href="#' + item[0] + '">' + item[0] + ' (' + item[1] + ')</a></li>');
  });
  pmenu.click(function(event){
    if (t = menuclick(pmenu, event))
      visgexf.setFilter(filterid, t.attr('href').replace('#', ''));
  });

  $('.showposter').click(function(e){e.preventDefault();$('#showposter').modal();});

});
