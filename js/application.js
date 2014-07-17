var App = {
    map: {},
    sort: function($element) {
        $element.html($element.find('option').sort(function(a, b) {
            return a.text === b.text ? 0 : a.text < b.text ? -1 : 1;
        }));
    },
    template: function($id, $Name, $Description, $Start, $Finish) {
        return '<div class="item item-avatar">\
                    <img src="img/no_image.png"/>\
                    <h2>' + $Name + '</h2>\
                    <p>' + $Start + ' a ' + $Finish + '</p>\
                </div>\
                <div class="item item-body">\
                    <p>' + $Description + ' </p>\
                </div>\
                <div class="item tabs tabs-secondary tabs-icon-left" data-id_event="' + $id + '">\
                    <a class="tab-item" href="#" data-function="open">\
                        <i class="icon ion-location"></i>\
                        Ver\
                    </a>\
<!--                <a class="tab-item" href="#" data-function="save">\
                        <i class="icon ion-calendar"></i>\
                        Salvar\
                    </a>\
                    <a class="tab-item" href="#" data-function="share">\
                        <i class="icon ion-share"></i>\
                        Compartilhar\
                    </a>-->\
                </div>';
    },
    apply_events: function() {
        var markers = new OpenLayers.Layer.Markers("Markers");
        $.ajax({
            url: 'http://datapoa.com.br/api/action/datastore_search',
            data: {
                resource_id: 'b64586af-cd7c-47c3-9b92-7b99875e1c08'
            },
            dataType: 'jsonp',
            success: function($response) {
                var $records = $response.result.records;
                $.each($records, function($key, $event) {
                    var $geolocation = new OpenLayers.LonLat($event.LONGITUDE, $event.LATITUDE).transform(new OpenLayers.Projection("EPSG:4326"), App.map.getProjectionObject());
                    var $Marker = new OpenLayers.Marker($geolocation);
                    markers.addMarker($Marker);
                });
                App.map.addLayer(markers);
            }
        });
    },
    init: function() {
        $('header #filters form').submit(App.apply_filters);
        App.apply_events();
        App.map = new OpenLayers.Map("map");
        App.map.addLayer(new OpenLayers.Layer.OSM());
        var lonLat = new OpenLayers.LonLat( -51.22067189, -30.06074719).transform(new OpenLayers.Projection("EPSG:4326"), App.map.getProjectionObject());
        App.map.setCenter(lonLat, 12.5);
    }
};
$(document).ready(function() {
    App.init();
    $('main#main section header.bar-header button.ion-navicon').click(function() {
        $('main#main').toggleClass('show_menu');
    });
    $('main#main section header.bar-header button.ion-map').click(function() {

    });
//    $('main#main menu button').click(function() {
//        App.apply_filters();
//        $('main#main section header.bar-header button').click();
//    });
});