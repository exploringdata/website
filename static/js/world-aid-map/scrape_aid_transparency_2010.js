$('.graphFielddivForGraph').each(function(idx, elt){
  var donor = $(elt).find('.graphLabeldivForGraph')[0].innerHTML;
  var val = $(elt).find('.graphValuedivForGraph')[0].innerHTML;
  console.log('"' + donor + '", ' + '"' + val + '"');
});
