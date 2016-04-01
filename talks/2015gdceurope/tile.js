
var hackScope;

/* Config */

var tileApp = angular.module('tileApp', [
  'ngRoute',
  'tileControllers'
]);

tileApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/testImg', {
        templateUrl: '_image.html',
        controller: 'MyImageController'
      }).
      otherwise({
        redirectTo: '/testImg'
      });
  }]);

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]
shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};

/* Controllers */

var tileControllers = angular.module('tileControllers', []);


// Image Controller
tileControllers.controller('MyImageController', ['$scope', '$http', '$timeout',
  function($scope, $http, $timeout) {
    ImageList = shuffle(ImageList);

  	$scope.tileImage = TitleImgPlaceholder;
    $scope.imageNum = 0;
  	$scope.imageStyleEven = { "background-image" : "url('" + $scope.tileImage + "')", "opacity": 1 };
    $scope.imageStyleOdd = { "background-image" : "url('" + ImageDomain + ImageList[$scope.imageNum][1] + "')", "opacity": 0.01 };

  	function GetLAMS(strID)
  	{
  		if(LAMS[strID] === undefined)
  		{
  			console.log("No LAMS ID %s", strID);
  			return strID;
  		}
  		if(LAMS[strID][$scope.Lang] === undefined)
  		{
        if(LAMS[strID][English] != undefined)
          return LAMS[strID][English];
  			console.log("No %s localisation for %s", $scope.Lang, strID);
  			return strID;
  		}

  		return LAMS[strID][$scope.Lang];
  	}

  	$scope.PreloadNextImage = function()
    {
      if($scope.imageNum % 2)
      {
        $scope.imageStyleEven["background-image"] = "url('" + ImageDomain + ImageList[$scope.imageNum][1] + "')";
      }
      else
      {
        $scope.imageStyleOdd["background-image"] = "url('" + ImageDomain + ImageList[$scope.imageNum][1] + "')";
      }

      $scope.slideTimer = $timeout($scope.NextImage, TileDisplayTimeMS - 1000);
    }

    $scope.NextImage = function()
    {
      i = $scope.imageNum;
      $scope.imageNum = ($scope.imageNum+1) % ImageList.length;

      $scope.tileImage = ImageDomain + ImageList[i][1];
      // tile.setTitleCaption( GetLAMS("PurchaseTitle"), GetLAMS(ImageList[i][1]) );
      if($scope.imageNum % 2)
      {
        $scope.imageStyleEven["opacity"] = 0.01;
        $scope.imageStyleOdd["opacity"] = 1;
      }
      else
      {
        $scope.imageStyleEven["opacity"] = 1;
        $scope.imageStyleOdd["opacity"] = 0.01;
      }

      // Set Click Functionality to Open Product Page
      tile.onClick = function(down){
        if(down){
          /* Code to POST to the analytics service
          var ts = new Date();
          var utcTime = ts.getTime();

          var req = {
            method: 'POST',
            url: 'https://shared.api.dev.wwsga.me/games/f2a6dd0e-028f-479d-9620-8f6bf2b58b13/telemetry',
            headers: {
              'Authorization':'db1d16c8-1d5e-4579-8d62-5039a77d123b:deadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
              'Content-Type':'application/json',
              'X-WWS-SCHEMA-ID':'4a68bf319b39813c1c335e17d385b331'
            },
            data: {
              'header':{
                'user_id':'testuser',
                'title_id':$scope.titleId,
                'client_timestamp':utcTime
              },
              'data':{
                'event_type':'StoreStart',
                'store_session_id':utcTime,
                'entry_point':ImageList[i][0]
              }
            }
          };

          $http(req).success(function(){
            $scope.gaSuccess = true;
            console.log($scope.gaSuccess);
          }).error(function(){
            $scope.gaSuccess = false;
            console.log($scope.gaSuccess);
          });
*/
          tile.openStoreProduct(ImageList[i][$scope.serviceLabelCol], ImageList[i][0], $scope.titleId);
        }
      };

      $scope.slideTimer = $timeout($scope.PreloadNextImage, 1000);
      // Saved promise so we can cancel if required
    }

    hackScope = $scope;
  	var tile = new HTMLLiveTile.TileController(); // instantiate HTMLLiveTile
    $scope.tileRef = tile;

		tile.getSystemLanguage(function(code){
      tile.getTitleId(function(id){
        $scope.titleId = id;
        $scope.serviceLabelCol = ServiceIDLookUp.indexOf(id) + 2;
      });
/* Get the user ID to post to the analyitcs service
      tile.getUserOnlineId(function(uid){
        $scope.userId = uid;
      });
*/
			LANGUAGE_CODE = code || "en-GB";
			$scope.Lang = LANG[LANGUAGE_CODE];
			$scope.NextImage(0);
      $scope.$apply();

      $scope.titleTimer = $timeout(function(){
        tile.setTitle( GetLAMS("PurchaseTitle") );
      }, 1000);
		});

  }]);
