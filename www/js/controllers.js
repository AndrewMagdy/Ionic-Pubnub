angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  $scope.openCordovaWebView = function()
{
 // Open cordova webview if the url is in the whitelist otherwise opens in app browser
 window.open('http://rtcproj.ddns.net:8080/stream/webrtc','_blank');
};
})

.controller('ChatsCtrl', function($scope, $interval, Pubnub) {
  Pubnub.init({
    publish_key: 'pub-c-371bafb0-b1dc-4175-9bc0-6e68b7d512e2',
    subscribe_key: 'sub-c-a11f9ed6-dc88-11e5-8905-02ee2ddab7fe'
  });

  $scope.bye = function () {
    msg = {"car": "asd"};
    Pubnub.publish({
      channel: 'Channel-car',
      message: msg,
      callback: function (m) {console.log(m);}
    });
  };

  $scope.hola = function (msg) {
    msg = {"car": msg};
    Pubnub.publish({
      channel: 'Channel-car',
      message: msg,
      callback: function (m) {console.log(m);}
    });
  };


})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
  // DOM
      var button = document.getElementById('button');
      flag = false;
      // This is the channel name you are subscribing in remote-led.py
      var channel = 'test';
      //Init - Get your own keys at admin.pubnub.com
      var p = PUBNUB.init({
         subscribe_key: 'sub-c-875a6a50-d26d-11e5-b684-02ee2ddab7fe',
         publish_key:   'pub-c-df137065-b5ca-4b1d-841a-3f547ec9b6f0'
      });
      // Sending data
      function disco() {
      flag = !flag;
      if (flag) {
        document.getElementById("button").innerHTML="<h1 class = 'positive'><i class='icon ion-ios-lightbulb' id = 'iconId'></i> ON</h1>";
            p.publish({
              channel : channel,
              message : {led: 1}
          });
      } else {
        document.getElementById("button").innerHTML="<h1 class = 'dark'><i class='icon ion-ios-lightbulb-outline' id = 'iconId'></i> OFF</h1>";
        p.publish({
              channel : channel,
              message : {led: 0}
            });
      }
        }

        // Click event
      button.addEventListener('click', disco);

          //Receiving data
        p.subscribe({
          channel: channel,
          presence: function(m){document.writeln(JSON.stringify(m.ir))},
          message: function(m){
            var ir_status = JSON.stringify(m.ir);
            console.log(ir_status);
            if (ir_status == '"0"') {
              document.getElementById("ir").innerHTML = "<div style='color:blue'>Object Detected.</div>";
            }else if(ir_status == '"1"') {
              document.getElementById("ir").innerHTML = "<div style='color:gray'>No Object Detected.";
            }
          }
      });
});
