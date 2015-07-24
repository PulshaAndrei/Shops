angular.module('shop', []).
  config(function($routeProvider) {
    $routeProvider.
      when('/', {controller: ShopListCtrl, templateUrl: 'list_shop.html'}).
      when('/new_shop', {controller: CreateShopCtrl, templateUrl: 'edit_shop.html'}).
      when('/edit_shop/:shopId', {controller: EditShopCtrl, templateUrl: 'edit_shop.html'}).
      when('/destroy_shop/:shopId', {controller: DestroyShopCtrl, templateUrl: 'list_shop.html'}).
      when('/products/:shopId', {controller: ProductsCtrl, templateUrl: 'list_product.html'}).
      when('/new_product/:shopId', {controller: CreateProductCtrl, templateUrl: 'edit_product.html'}).
      when('/edit_product/:shopId/:productId', {controller: EditProductCtrl, templateUrl: 'edit_product.html'}).
      when('/destroy_product/:shopId/:productId', {controller: DestroyProductCtrl, templateUrl: 'list_product.html'}).
      otherwise({redirectTo:'/'});
  });
 
function init($scope, $rootScope, $http) {
  $http.get('data/shops.json').success(function(data) {
    $rootScope.shops = data;
  });
}


function ShopListCtrl($scope, $rootScope, $location, $http) {
  if (!$rootScope.shops) init($scope, $rootScope, $http);

  //Dragable
  $(function() {
    $( "#sortable" ).sortable({
      revert: true,
      update: function(){
        var arr = $('#sortable').sortable("toArray");
        var mas = [];
        arr.forEach( function (elem, index) {
          $rootScope.shops.forEach( function(el, i) {
            if (el.num == parseInt(elem) && !mas[i]) {
              $rootScope.shops[i].num = index + 1;
              mas[i] = true;
            }
          });
        });
        window.location.replace('#/.');
      }
    });
    $( "tbody, tr" ).disableSelection();
  });
}
 
function CreateShopCtrl($scope, $location, $http, $rootScope) {
  if (!$rootScope.shops) { $location.path('/'); return; };
  $scope.save = function() {
    $scope.shop.id = $rootScope.shops.length + 1;
    $scope.shop.num = $rootScope.shops.length + 1;
    $scope.shop.products = [];
    $rootScope.shops.push($scope.shop);
    $location.path('/');
  }
}

function clone(obj){
    var temp = {}; 
    for(var key in obj)
        temp[key] = obj[key];
    return temp;
}

function EditShopCtrl($scope, $location, $rootScope, $routeParams) {
  if (!$rootScope.shops) { $location.path('/'); return; };  
  $scope.shop = clone($rootScope.shops[$routeParams.shopId - 1]);

  $scope.save = function() {
    $rootScope.shops[$routeParams.shopId - 1] = $scope.shop;
    $location.path('/');
  };
}

function DestroyShopCtrl($scope, $location, $rootScope, $routeParams){
  if (!$rootScope.shops) { $location.path('/'); return; };
  var nextNum = $rootScope.shops[$routeParams.shopId - 1].num;
  $rootScope.shops.splice($routeParams.shopId - 1, 1);
  console.log(nextNum);
  $rootScope.shops.forEach( function (elem, index) { 
    if (elem.id > $routeParams.shopId) 
      $rootScope.shops[index].id--;
    if (elem.num >= nextNum) 
      $rootScope.shops[index].num--;
  });
  $location.path('/');
}



function ProductsCtrl($scope, $location, $rootScope, $routeParams){
  if (!$rootScope.shops) { $location.path('/'); return; };
  $scope.shop = $rootScope.shops[$routeParams.shopId - 1];

  //Maps
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': $scope.shop.adress}, 
    function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          var pos = results[0].geometry.location;
          var map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(pos.A, pos.F),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(pos.A, pos.F),
            map: map
          });
      }
    }); 

}

function CreateProductCtrl($scope, $location, $rootScope, $routeParams){
  if (!$rootScope.shops) { $location.path('/'); return; };
  $scope.shop = $rootScope.shops[$routeParams.shopId - 1];

  $scope.save = function(){
    $scope.product.id = $rootScope.shops[$routeParams.shopId - 1].products.length + 1;
    $rootScope.shops[$routeParams.shopId - 1].products.push($scope.product);
    $location.path("/products/"+$scope.shop.id);
  }
}

function EditProductCtrl($scope, $location, $rootScope, $routeParams){
  if (!$rootScope.shops) { $location.path('/'); return; };
  $scope.shop = clone($rootScope.shops[$routeParams.shopId - 1]);
  $scope.product = clone($scope.shop.products[$routeParams.productId - 1]);

  $scope.save = function(){
    $scope.product.id = $routeParams.productId;
    $rootScope.shops[$routeParams.shopId - 1].products[$routeParams.productId - 1] = $scope.product;
    $location.path("/products/"+$scope.shop.id);
  }
}

function DestroyProductCtrl($scope, $location, $rootScope, $routeParams){
  if (!$rootScope.shops) { $location.path('/'); return; };
  $rootScope.shops[$routeParams.shopId - 1].products.splice($routeParams.productId - 1, 1);
  $rootScope.shops[$routeParams.shopId - 1].products.forEach( function (elem, index) { 
    if (elem.id > $routeParams.productId) 
      $rootScope.shops[$routeParams.shopId - 1].products[index].id--;
  });
  $location.path("/products/"+$routeParams.shopId);
}