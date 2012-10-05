// langinfo must be accessible from the external freebase text service script
var langinfo = function(data) {
  var sl = $('#showlang');
  sl.find('h3').text(hlang.label);
  var influenced = '';
  var influencedby = '';
  var m = /\|/g;
  $.each(hlang.attr.attributes, function(idx, item){
    if (1 == item.attr) {
      influencedby = item.val.replace(m, ', ');
    }
    if (2 == item.attr) {
      influenced = item.val.replace(m, ', ');
    }
  });
  var desc = data.result + '... <a href="http://www.freebase.com/view/' + hlang.id + '">view on Freebase</a>';

  // in case of Ruby include Matz tweet
  if ('Ruby' === hlang.label) {
    desc = '<blockquote class="twitter-tweet"><p>NowBrowsing: Programming Languages Influence Network <a href="http://t.co/kzdSlrpt" title="http://exploringdata.github.com/vis/programming-languages-influence-network/">exploringdata.github.com/vis/programmin…</a></p>&mdash; Yukihiro Matsumoto (@yukihiro_matz) <a href="https://twitter.com/yukihiro_matz/status/251612155470823425" data-datetime="2012-09-28T09:19:47+00:00">September 28, 2012</a></blockquote><script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>' + desc;
  }

  if (influenced)
    desc += '<h4>Languages Influenced</h4><p>' + influenced + '</p>';
  if (influenced)
    desc += '<h4>Influenced by</h4><p>' + influencedby + '</p>';

  sl.find('.modal-body').html('<div>' + desc + '<hr><p>Search for ' + hlang.label + ' books on <a href="http://www.amazon.com/gp/search?ie=UTF8&camp=1789&creative=9325&index=books&keywords=' + encodeURIComponent(hlang.label) + '&linkCode=ur2&tag=xpdt-20">Amazon.com</a></p></div>');
  sl.modal();
};

$(function(){
  var G = visgexf.init('sig', '/gexf/plin_forceatlas2.gexf');
  var filterid = 0;
  var filters = G.getFilters([filterid]);

  var pmenu = $('#paradigms');
  pmenu.append('<li class="active"><a href="#">All languages (' + G.sig.getNodesCount() + ')</a></li>');
  $.each(filters, function(idx, item) {
    pmenu.append('<li><a href="#' + item[0] + '">' + item[0] + ' (' + item[1] + ')</a></li>');
  });
  pmenu.click(function(e){
    e.preventDefault();
    if ('a' == e.target.nodeName.toLowerCase()) {
      var t = $(e.target);
      var pid = t.attr('href').replace('#', '');
      pmenu.find('li').removeClass('active');
      t.parent('li').addClass('active');
      visgexf.setFilter(filterid, pid);
    }
  });

  G.sig.bind('upnodes', function(event){
    hlang = G.sig.getNodes(event.content)[0];
    // add script with callback to avoid cross-origin request issues
    var script = document.createElement('script');
    script.src = 'https://usercontent.googleapis.com/freebase/v1/text' + hlang.id + '?callback=langinfo';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
  });
//.bind('outnodes',function(event){
//    if (G.pid && G.pid != G.defaultPid) {
//      G.hlParadigm(G.pid);
//    } else {
//      G.reset();
//    }
//  });

});
