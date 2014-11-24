/**
 * Created by jo on 24/11/14.
 */
angular.module("monApp",['uiGmapgoogle-maps'])

.config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'places' // Required for SearchBox.
        });
})
.run(['$templateCache', function ($templateCache) {
    $templateCache.put('searchbox.tpl.html',
     '<input id="pac-input" class="pac-controls" type="text" placeholder="" required/>');
}])


.controller("controller",['$scope', '$timeout', 'uiGmapLogger', '$http','uiGmapGoogleMapApi'
        , function ($scope, $timeout, $log, $http, GoogleMapApi) {
    $log.doLog = true;

    GoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;
        $scope.defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(40.82148, -73.66450),
            new google.maps.LatLng(40.66541, -74.31715));


        $scope.map.bounds = {
            northeast: {
                latitude:$scope.defaultBounds.getNorthEast().lat(),
                longitude:$scope.defaultBounds.getNorthEast().lng()
            },
            southwest: {
                latitude:$scope.defaultBounds.getSouthWest().lat(),
                longitude:-$scope.defaultBounds.getSouthWest().lng()

            }
        }
        $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
    });

   angular.extend($scope,{
       map: {
           control: {},
           center: {latitude: 40.1451, longitude: -99.6680 },
           zoom: 4,
           dragging: false,
           bounds: {},
           markers: [],
           idkey: 'place_id',
           events: {
               idle: function (map) {
                   var bounds = map.getBounds();
                   var ne = bounds.getNorthEast(); // LatLng of the north-east corner
                   //console.log("ne bounds " + ne.lat() + ", " + ne.lng());
                   var sw = bounds.getSouthWest(); // LatLng of the south-west corder
                   //console.log("sw bounds " + sw.lat() + ", " + sw.lng());
               }
           }
       },
       searchbox:{
           template:'searchbox.tpl.html',
           position:'top-left',
           options: {
               bounds: {}
           },
           parentdiv:'barreRecherche',
           events:{
               places_changed : function(searchBox){

                    var places = searchBox.getPlaces(); //On récupere les places

                    if(places.length == 0){
                        console.log("Aucun lieu trouvé");
                        return;
                    }
                    console.log("Event place_changed "+places.length);
                    var bounds = new google.maps.LatLngBounds();

                    var place = places[0]; // On a 1 seul marker

                    var markers = [];

                   /* Création d'un marker */
                    var marker = {
                        id : 121,
                        place_id : place.place_id,
                        name : places[0].name,
                        fit : true,
                        latitude : place.geometry.location.lat(),
                        longitude : place.geometry.location.lng()

                    };

                    markers.push(marker);//On ajoute le marker à la liste

                    bounds.extend(place.geometry.location);

                    $scope.map.bounds = { //Viewport Google maps
                        northeast: {
                            latitude: bounds.getNorthEast().lat(),
                            longitude: bounds.getNorthEast().lng()
                        },
                        southwest: {
                            latitude: bounds.getSouthWest().lat(),
                            longitude: bounds.getSouthWest().lng()
                        }
                    };


                   $scope.map.markers= markers;//Alloc des markers

                    /** On place le zoom à 12 car par défaut ZOOM trop près quand ajout marker
                     * Lorsque la valeur map.zoom est changée ça appelle la fonction
                     * **/
                   $scope.$watch('map.zoom', function(newVal){
                       if(newVal > 17){
                           $scope.map.zoom = 12;
                       }
                   });
                }
           }
       }

   });

}]);