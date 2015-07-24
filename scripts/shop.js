angular.module('shop', []).
  config(function($routeProvider) {
    $routeProvider.
      when('/', {controller: ShopListCtrl, templateUrl: 'list_shop.html'}).
      when('/new_shop', {controller: CreateShopCtrl, templateUrl: 'new_shop.html'}).
      when('/edit_shop/:shopId', {controller: EditShopCtrl, templateUrl: 'edit_shop.html'}).
      when('/destroy_shop/:shopId', {controller: DestroyShopCtrl, templateUrl: 'list_shop.html'}).
      when('/products/:shopId', {controller: ProductsCtrl, templateUrl: 'list_product.html'}).
      when('/new_product/:shopId', {controller: CreateProductCtrl, templateUrl: 'new_product.html'}).
      when('/edit_product/:shopId/:productId', {controller: EditProductCtrl, templateUrl: 'edit_product.html'}).
      when('/destroy_product/:shopId/:productId', {controller: DestroyProductCtrl, templateUrl: 'list_product.html'}).
      otherwise({redirectTo:'/'});
  });
 
function init($rootScope, $http) {
  $http.get('data/shops.json').success(function(data) {
    $rootScope.shops = data;
  });
}

function ShopListCtrl($rootScope, $location, $http) {
  if (!$rootScope.shops) init($rootScope, $http);
}
 
function CreateShopCtrl($scope, $location, $http, $rootScope) {
  if (!$rootScope.shops) { $location.path('/'); return; };
  $scope.save = function() {
    $scope.shop.id = $rootScope.shops.length + 1;
    $scope.shop.products = [];
    $rootScope.shops.push($scope.shop);
    $location.path('/');
  }
}
 
function EditShopCtrl($scope, $location, $rootScope, $routeParams) {
  if (!$rootScope.shops) { $location.path('/'); return; };
  $scope.shop = $rootScope.shops[$routeParams.shopId - 1];

  $scope.save = function() {
    $rootScope.shops[$routeParams.shopId - 1] = $scope.shop;
    $rootScope.shops[$routeParams.shopId - 1].id = $routeParams.shopId;
    $location.path('/');
  };
}

function DestroyShopCtrl($scope, $location, $rootScope, $routeParams){
  if (!$rootScope.shops) { $location.path('/'); return; };
  $rootScope.shops.splice($routeParams.shopId - 1, 1);
  $rootScope.shops.forEach( function (elem, index) { 
    if (elem.id > $routeParams.shopId) 
      $rootScope.shops[index].id--;
  });
  $location.path('/');
}



function ProductsCtrl($scope, $location, $rootScope, $routeParams){
  if (!$rootScope.shops) { $location.path('/'); return; };
  $scope.shop = $rootScope.shops[$routeParams.shopId - 1];
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
  $scope.shop = $rootScope.shops[$routeParams.shopId - 1];
  $scope.product = $scope.shop.products[$routeParams.productId - 1];

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