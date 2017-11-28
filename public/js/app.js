var app = angular.module('app', []);

var socket = io.connect();
app.config(function($routeProvider) {
  $routeProvider
          .when('/',
                    {
                      templateUrl: 'views/home.html'
                      ,controller: 'home'
                    }
              )
          .when('/add',
                        {
                          templateUrl: 'views/add.html'
                          ,controller: 'add'
                        }
                  )
              .otherwise({ redirectTo: '/' });
});

function home($scope, $http, $rootScope){
  $scope.nume = {"nombre": "Vania", "val":"4500"};
  socket.on("msg", function(data){
    console.log(data);
    $scope.nume = data.nombre;
    $rootScope.$apply();
  });
  console.log("Home Ctrl");
  $scope.lista = [];

  $http.get("api/tvshows").success(
    function (data) {
      console.log(data);
      $scope.lista = data;
    }
  );

  $scope.enviar = function(n){
    socket.emit("senMessage", $scope.nume)
  }
}

function add($scope, $http, $location){
  console.log("Add Ctrl");
  $scope.generos = ['Drama', 'Fantasy', 'Sci-Fi', 'Thriller', 'Comedy'];
  $scope.add = function (tvShow) {
    $http.post("api/tvshows", tvShow).success(
      function (data) {
        console.log(data);
        $location.path('/');
      }
    );
  }
}
app.controller("home", home);
app.controller("add", add)
