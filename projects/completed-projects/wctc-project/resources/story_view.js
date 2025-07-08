$(document).ready(function(){
// drop projects widget
$("#archetypes-fieldname-program").remove()
themes = ['Land','Gender','Energy','Natural Resources Economics', 
'Agriculture and Food Security', 'Forestry', 
'Monitoring and Evaluation', 'Biodiversity', 
'Social and Community-Based Development', 
'Democracy and Governance', 'Global Climate Change', 
'Water and Sanitation' , 'Wildlife Trafficking'
]
regions = ['Africa','Asia and Near East',
'Europe and Eurasia','Global','Latin America and Caribbean']

timestamp=Date.now()
blogitempath = window.location.pathname.split('/');
blogitempath.pop();
var blogitem = blogitempath.pop();
$.getJSON( blogitem + "/story_view.json?" + timestamp, function( data ) {
  var set_regions = data.regions;
  var set_themes = data.themes; 

$('#archetypes-fieldname-pubDateOriginal').html('')
// Swap div for themes
swapdiv = $('#themes');
swapdiv.html('');
  swapdiv.append($('<label class="formQuestion">Themes</label>'));
$.each(themes, function(index,item){
  var checked = false;
  if ($.inArray(item, set_themes) != -1) { var checked = true; }  
  newdiv = $('<div class="ArchetypesMultiSelectionValue" class="archetypes-value-themes"></div>')
               .append($('<label for="themes_'+index+1+'"></label>'))
               .append($('<input class="blurrable" type="checkbox" name="themes:list" id="themes_'+index+1+'">'+item+'</input>')
               .prop( "checked", checked )
               .val(item));
         

  swapdiv.append( newdiv );
   });
// Swap div for regions
swapdiv = $('#regions');
swapdiv.html('');
  swapdiv.append($('<label class="formQuestion">Regions</label>'));
$.each(regions, function(index,item){
  var checked = false;
 
  if ($.inArray(item, set_regions) != -1) { var checked = true; }  
  newdiv = $('<div class="ArchetypesMultiSelectionValue" class="archetypes-value-regions"></div>')
               .append($('<label for="regions_'+index+1+'"></label>'))
               .append($('<input class="blurrable" type="checkbox" name="regions:list" id="regions_'+index+1+'">'+item+'</input>')
               .prop( "checked", checked )
               .val(item));

      swapdiv.append( newdiv );
   }); 

// end of the getJSON 
});

});
