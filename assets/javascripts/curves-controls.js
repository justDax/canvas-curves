//
//  this js doesn't generate any wave
//  it just updates the waves based on the custom settings inside the control box

$(function(){
  
  var $controls = $("#controls");
  
  // toggle options
  var $toggler = $controls.children(".toggler");
  $toggler.click(function(e){
    e.preventDefault();
    $controls.toggleClass("expanded");
  })
  
  // update waves
  $submit = $controls.find("button[type=submit]");
  
  $submit.click(function(e){
    e.preventDefault();
    
    var serializedData = $controls.find("input").serializeArray();
    
    for (var i = 0; i < serializedData.length; i++){
      var data = serializedData[i];
      var opt = data.name;
      var val = data.value;
      if (val !== ""){
        
        if ( opt === "updateAmount") continue;
        // updates each value in each wave
        for (var j = 0; j < waves.length; j++){
          var wave = waves[j];
          if (wave[opt] !== undefined){
            // if possible parse to integer
            var parsedVal = parseInt(val);
            if (!isNaN(parsedVal)) val = parsedVal;
            wave[opt] = val;
          }
        }
        
      }
    }
    
    // special treatment for particular settings:
    //
    // angle
    // random color
    // shadow same color
    // updateAmunt
    // wave multipliers
    var angle = $controls.find("#angle").val();
    var randomColor = $controls.find("#randomStroke").is(":checked");
    var shadowSameColor = $controls.find("#shadowSameColor").is(":checked");
    var updateAmount = $controls.find("#updateAmount").val();
    var horizontalWaveMultiplier = $controls.find("#horizontalWaveMultiplier").val();
    var verticalWaveMultiplier = $controls.find("#verticalWaveMultiplier").val();
    
    for (var j = 0; j < waves.length; j++){
      var wave = waves[j];
      // angle
      var val = 0 - ( 1 - Math.random()*2)*(angle/100);
      wave.angle = val
      // random color
      if (randomColor) wave.strokeStyle = 'rgb(200, ' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) + ')';
      // shadow same color
      if (shadowSameColor) wave.shadowColor = wave.strokeStyle;
      // updateAmount
      // wave.updateAmount = Math.floor((Math.random() + 0.09)*updateAmount*10)/10;
      wave.updateAmount = updateAmount;
      // wave multipliers
      wave.initialHorizontalWaveMultiplier = horizontalWaveMultiplier;
      wave.initialVerticalWaveMultiplier = verticalWaveMultiplier;
    }
    
    
    
  })
})