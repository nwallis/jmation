ServerSave = (function(){

  function publish_animation(blob){
  
    var fileReader = new FileReader()
    
    fileReader.onload = function(event) {
      Meteor.call('save_file', event.srcElement.result)
    }

    fileReader.readAsBinaryString(blob);

  }

  return {
    publish_animation: publish_animation
  }

})()