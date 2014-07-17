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
        return '<div data-id_station="' + $id + '" class="item item-button-right">\
                    ' + $Name + '\
                    <button class="button button-positive">\
                        <i class="icon ion-arrow-right-c"></i>\
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
        var markers = new OpenLayers.Layer.Markers("Markers");
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
                $.each(App.stations, function($key, $station) {
                    $station.name =  $station.nome.replaceAll('_', ' ');
                    var $geolocation = new OpenLayers.LonLat($station.LONGITUDE, $station.LATITUDE).transform(new OpenLayers.Projection("EPSG:4326"), App.map.getProjectionObject());
                    var $Marker = new OpenLayers.Marker($geolocation);
                    markers.addMarker($Marker);
                    $($Marker.events.element).data('name', $station.name).click(function(evt) {
                        var $name = $(this).data('name');
                        App.map.addPopup(new OpenLayers.Popup.FramedCloud("featurePopup",
                                $geolocation,
                                new OpenLayers.Size(100, 100),
                                $name,
                                null, true, function() {
                                    this.destroy();
                                }), true);
                    });

                    $items.push(App.template($key, $station.name));
                });
                App.map.addLayer(markers);
                App.stations.sort(function(a, b) {
                    return a['nome'] - b['nome'];
                });
                $("<div/>", {
                    class: 'list card',
                    html: $items.join("")
                }).appendTo("main#main menu article").find('div.item button.button-positive').click(function() {
                    var $id_station = $(this).closest('div.item').data('id_station');
                    console.log(App.stations[$id_station])
                });
            }
        });
    },
    init: function() {
        $('header #filters form').submit(App.apply_filters);
        App.apply_stations();
        App.map = new OpenLayers.Map("map");
        App.map.addLayer(new OpenLayers.Layer.OSM());
        var lonLat = new OpenLayers.LonLat(-51.22067189, -30.06074719).transform(new OpenLayers.Projection("EPSG:4326"), App.map.getProjectionObject());
        App.map.setCenter(lonLat, 12.5);
    }
};
$(document).ready(function() {
    /*
     * 
     * alterar icon market OpenLayers.ImgPath = "/resources/external/images/ol/";
     * 
     */

    App.init();
    $('main#main section header.bar-header button.ion-navicon').click(function() {
        $('main#main').toggleClass('show_menu');
    });
    $('main#main section header.bar-header button.ion-map').click(function() {
        App.get_geolocation();
    });
//    $('main#main menu button').click(function() {
//        App.apply_filters();
//        $('main#main section header.bar-header button').click();
//    });
});
String.prototype.replaceAll = function(de, para) {
    var str = this;
    var pos = str.indexOf(de);
    while (pos > -1) {
        str = str.replace(de, para);
        pos = str.indexOf(de);
    }
    return (str);
}