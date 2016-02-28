angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

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
});
