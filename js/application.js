var App = {
    stations: {},
    geolocation: {},
    get_geolocation: function() {
        this.success = function($position) {
            App.geolocation = {
                latitude: $position.coords.latitude,
                longitude: $position.coords.longitude
            };
            var lonLat = new OpenLayers.LonLat(App.geolocation.longitude, App.geolocation.latitude).transform(new OpenLayers.Projection("EPSG:4326"), App.map.getProjectionObject());
            App.map.setCenter(lonLat, 12.5);
        };
        this.failure = function() {
            alert('Não foi possível definir sua geolocalização');
        };
        navigator.geolocation.getCurrentPosition(this.success, this.failure);
    },
    map: {},
    template: function($id, $Name) {
        return '<div data-id_station="' + $id + '" data-id_element="$element" class="item item-button-right">\
                    ' + $Name + '\
                    <button class="button button-positive">\
                        <i class="icon ion-ios7-navigate-outline"></i>\
                    </button>\
                </div>';
    },
    order_by_name: function() {
        App.stations.sort(function(a, b) {
            if (a.nome > b.nome)
                return 1;
            if (a.nome < b.nome)
                return -1;
            return 0;
        });
    },
    apply_stations: function() {
        $("main#main menu article").empty();
//        var markers = new OpenLayers.Layer.Markers("Markers");
        $.ajax({
            url: 'http://datapoa.com.br/api/action/datastore_search',
            data: {
                resource_id: 'b64586af-cd7c-47c3-9b92-7b99875e1c08'
            },
            dataType: 'jsonp',
            success: function($response) {
                App.stations = $response.result.records;
                var $items = [];
                App.order_by_name();
                var $marker = [];
                $.each(App.stations, function($key, $station) {
                    $station.name = (($station.nome).replaceAll('_', ' ')).toString();
                    $marker[$key] = new google.maps.Marker({
                        position: new google.maps.LatLng($station.LATITUDE, $station.LONGITUDE),
                        map: App.map,
                        title: $station.name,
//                        icon: 'images/beachflag.png'
                    });
                    google.maps.event.addListener($marker[$key], 'click', function() {
                        var infowindow = new google.maps.InfoWindow({
                            content: $station.name
                        });
                        infowindow.open(App.map, $marker[$key]);
                    });
                    $items.push(App.template($key, $station.name));
                });
                App.stations.sort(function(a, b) {
                    return a['nome'] - b['nome'];
                });
                $("<div/>", {
                    class: 'list card',
                    html: $items.join("")
                }).appendTo("main#main menu article").find('div.item button.button-positive').click(function() {
                    /*
                     abrir nova aba com navigate
                     */
//    $("#geodirections_container").geoDirections({
//        mapTheme: "blue", // Map Theme
//        targetMarker: {// Target Marker Position
//            lat: "-23.550520",
//            lng: "-46.633309"
//        },
//        travelMode: "driving", // Travel Mode (driving, walking, transit or bicyling)
//        directionDetails: {// Show or Hide Direction Details
//            enabled: true,
//            panelOpened: false
//        },
//        directionStroke: {// Direction Stroke Customization
//            color: "#307bb4", // The Hex Color of the Stroke
//            opacity: 0.8, // The Opacity (from 0.1 to 1.0)
//            weight: 5 // The Weight
//        },
//        infoboxTexts: {// The Infobox Texts
//            user: "Voce esta aqui", // User Marker Text
//            target: "Seu destino é aqui" // Target Marker Text
//        }
//    });
                });
            }
        });
    },
    init: function() {
        $('header #filters form').submit(App.apply_filters);
        App.map = new google.maps.Map(document.getElementById("map"), {
            center: new google.maps.LatLng(-30.06074719, -51.22067189),
            mapTypeId: 'roadmap',
            zoom: 12
        });
        App.apply_stations();
    }
};
$(document).ready(function() {
    App.init();
    $('main#main section header.bar-header button.ion-navicon').click(function() {
        $('main#main').toggleClass('show_menu');
    });
    $('main#main section header.bar-header button.ion-map').click(function() {
        App.get_geolocation();
    });
});
String.prototype.replaceAll = function(de, para) {
    var str = this;
    var pos = str.indexOf(de);
    while (pos > -1) {
        str = str.replace(de, para);
        pos = str.indexOf(de);
    }
    return (str);
};