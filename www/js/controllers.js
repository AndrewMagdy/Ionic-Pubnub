angular.module('starter.controllers', [])
.factory('MyData', function($websocket) {
  // Open a WebSocket connection
  var dataStream = $websocket('ws://rtcproj.ddns.net:8080/stream/webrtc');
  var collection = [];



  var methods = {
    collection: collection,
    get: function() {
      dataStream.send(JSON.stringify({ action: 'get' }));
    }
  };


  var signalling_server_hostname = location.hostname || "http://rtcproj.ddns.net";

  var pc;
  var audio_video_stream;
  var pcConfig = {"iceServers": [
    {"urls": ["stun:stun.l.google.com:19302", "stun:" + signalling_server_hostname + ":3478"]}
  ]};
  var pcOptions = {
    optional: [
      {DtlsSrtpKeyAgreement: true}
    ]
  };
  var mediaConstraints = {
    optional: [],
    mandatory: {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: true
    }
  };

  RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
  RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
  var URL =  window.URL || window.webkitURL;

  function createPeerConnection() {
    try {
      var pcConfig_ = pcConfig;
      pc = new RTCPeerConnection(pcConfig_, pcOptions);
      pc.onicecandidate = onIceCandidate;
      pc.onaddstream = onRemoteStreamAdded;
      pc.onremovestream = onRemoteStreamRemoved;
      console.log("peer connection successfully created!");
    } catch (e) {
      console.log("createPeerConnection() failed");
    }
  }

  function onIceCandidate(event) {
    if (event.candidate) {
      var candidate = {
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      };
      var command = {
        command_id: "addicecandidate",
        data: JSON.stringify(candidate)
      };
      dataStream.send(JSON.stringify(command));
    } else {
      console.log("End of candidates.");
    }
  }

  function onRemoteStreamAdded(event) {
    console.log("Remote stream added:", URL.createObjectURL(event.stream));
    var remoteVideoElement = document.getElementById('remote-video');
    remoteVideoElement.src = URL.createObjectURL(event.stream);
    remoteVideoElement.play();
  }

  function onRemoteStreamRemoved(event) {
    var remoteVideoElement = document.getElementById('remote-video');
    remoteVideoElement.src = '';
  }


  //dataStream = $websocket(protocol + '//' + '192.168.1.103:8080' + '/stream/webrtc');
  function offer(stream) {
    console.log(dataStream);
    createPeerConnection();
    if (stream) {
      pc.addStream(stream);
    }
    var command = {
      command_id: "offer",
      options: {
        force_hw_vcodec: false,
        vformat: 60
      }
    };
    dataStream.send(JSON.stringify(command));
    console.log("offer(), command=" + JSON.stringify(command));
}


  dataStream.onOpen (function () {
    console.log("onopen()");
    offer();
  });

  dataStream.onMessage (function (evt) {
    var msg = JSON.parse(evt.data);
    //console.log("message=" + msg);
    console.log("type=" + msg.type);
    console.log("i test "+ msg);

    switch (msg.type) {
      case "offer":
      pc.setRemoteDescription(new RTCSessionDescription(msg),
      function onRemoteSdpSuccess() {
        console.log('onRemoteSdpSucces()');
        pc.createAnswer(function (sessionDescription) {
          pc.setLocalDescription(sessionDescription);
          var command = {
            command_id: "answer",
            data: JSON.stringify(sessionDescription)
          };
          dataStream.send(JSON.stringify(command));
          console.log(command);

        }, function (error) {
          alert("Failed to createAnswer: " + error);

        }, mediaConstraints);
      },
      function onRemoteSdpError(event) {
        alert('Failed to set remote description (unsupported codec on this browser?): ' + event);
        stop();
      }
    );

    var command = {
      command_id: "geticecandidate"
    };
    console.log(command);
    dataStream.send(JSON.stringify(command));
    break;

    case "answer":
    break;

    case "message":
    alert(msg.data);
    break;

    case "geticecandidate":
    var candidates = JSON.parse(msg.data);
    for (var i = 0; candidates && i < candidates.length; i++) {
      var elt = candidates[i];
      var candidate = new RTCIceCandidate({sdpMLineIndex: elt.sdpMLineIndex, candidate: elt.candidate});
      pc.addIceCandidate(candidate,
        function () {
          console.log("IceCandidate added test: " + JSON.stringify(candidate));
        },
        function (error) {
          console.log("addIceCandidate error: " + error);
        }
      );
    }
    document.documentElement.style.cursor ='default';
    break;
  }
});

dataStream.onClose (function (evt){
  if (pc) {
    pc.close();
    pc = null;
  }
  document.documentElement.style.cursor ='default';
});

dataStream.onError (function (evt) {
  alert("An error has occurred!");
  dataStream.close();
});



function stop() {
  if (audio_video_stream) {
    try {
      audio_video_stream.stop();
    } catch (e) {
      for (var i = 0; i < audio_video_stream.getTracks().length; i++)
      audio_video_stream.getTracks()[i].stop();
    }
    audio_video_stream = null;
  }
  document.getElementById('remote-video').src = '';
  if (pc) {
    pc.close();
    pc = null;
  }
  if (dataStream) {
    dataStream.close();
    dataStream = null;
  }
}


window.onbeforeunload = function() {
  if (dataStream) {
    dataStream.onClose ( function () {}); // disable onclose handler first
    stop();
  }
};

return methods;
})

.controller('DashCtrl', function($scope,MyData,Pubnub) {
  $scope.MyData = MyData;
  Pubnub.init({
    publish_key: 'pub-c-371bafb0-b1dc-4175-9bc0-6e68b7d512e2',
    subscribe_key: 'sub-c-a11f9ed6-dc88-11e5-8905-02ee2ddab7fe'
  });

  $scope.stop = function () {
    msg = {"car": "stop"};
    Pubnub.publish({
      channel: 'Channel-car',
      message: msg,
      callback: function (m) {console.log(m);}
    });
  };

  $scope.moveTo = function (direction) {
    msg = {"car": direction};
    Pubnub.publish({
      channel: 'Channel-car',
      message: msg,
      callback: function (m) {console.log(m);}
    });
  };
})

.controller('CarCtrl', function($scope, $interval, Pubnub) {

})
