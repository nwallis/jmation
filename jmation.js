Animations = new Meteor.Collection('animations');

if (Meteor.isClient) {

  Template.published_animations.helpers({
    animations: function() {
      return Animations.find();
    },
    css_class: function() {
      return (this.user_id === Meteor.userId() ? "owned" : "not_owned")
    }
  })

  Meteor.startup(function (){
    
    var video_width, video_height, image_array

    image_array = []

    /* Live Video */

      live_video = document.getElementById("live_video") 
      video_width = live_video.offsetWidth
      video_height = live_video.offsetHeight

      live_video_canvas = document.getElementById("live_video_canvas")
      live_video_canvas.width = video_width;
      live_video_canvas.height = video_height;      
      live_video_canvas_context = live_video_canvas.getContext('2d')

      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia
      if (navigator.getUserMedia){
          navigator.getUserMedia({video: true}, display_video_in_dom, no_camera_available)
      }

      function display_video_in_dom(camera_stream){
        source = (window.URL || window.webkitURL).createObjectURL(camera_stream)
        live_video.src = source
      }

      function no_camera_available(){
        console.log("no camera is available")
      }
    /* Live Video */

    /* Live Video Nav */

      $("#capture_button").click(function(event){
        live_video_canvas_context.drawImage(live_video, 0, 0, video_width, video_height)
        //imageData = live_video_canvas_context.getImageData(0, 0, video_width, video_height);
        imageData = live_video_canvas.toDataURL('image/webp')
        
        image_array.push(imageData)

        var img = document.createElement("img")
        img.width = 100
        img.src = imageData
        $("#timeline_container").append(img)

      })

      $("#publish_button").click(function(event) {
        var video_blob = Whammy.fromImageArray(image_array, 25)
        ServerSave.publish_animation(video_blob)
      })

    /* Live Video Nav */

  });

}
  
if (Meteor.isServer) {

  var AWS = Meteor.require('aws-sdk');
  var s3 = new AWS.S3();

  function generate_file_name() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  Meteor.methods({

    clear_dev_data: function(){
      Animations.remove({})
    },

    save_file: function(blob) {

      file_name = generate_file_name()

      s3.putObject(
        {
          ACL: 'public-read',
          Bucket: 'jmation-uploads',
          Key: 'videos/' + file_name + '.webv',
          Body: new Buffer(blob, 'binary'),
          ContentType: blob.type,
        }, 
        Meteor.bindEnvironment(function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else Animations.insert({file_name: file_name, user_id: Meteor.userId()}); 
        })
      );
    }
});

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
