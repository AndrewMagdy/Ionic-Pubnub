angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  $scope.openCordovaWebView = function()
  {
    // Open cordova webview if the url is in the whitelist otherwise opens in app browser
    window.open('http://rtcproj.ddns.net:8080/stream/webrtc','_blank');
  };
})

.controller('CarCtrl', function($scope, $interval, Pubnub) {
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
