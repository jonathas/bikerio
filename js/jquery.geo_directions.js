/**************************************************************************
 * jquery.geo_directions.js
 * @version: 1.0 (05.09.2014)
 * @requires jQuery v1.8 or later
 * @author Axel Hardy (http://axelhardy.com)
**************************************************************************/

(function ( $ ) {

	
	///////////////////////////////////////////
	// THE GEO DIRECTIONS PLUGIN STARTS HERE //
	//////////////////////////////////////////
	$.fn.geoDirections = function( options ) {
	
		var el = $(this); 
		
		if($.cookie("user_geo_lat") == null || $.cookie("user_geo_lng") == null) {
			var loading_block = '<div class="geoalert-info">';
			loading_block += '<img src="img/ajax-loader.gif" alt="loading" class="loading" />';
	    	loading_block += '<br />';
	    	loading_block += 'Waiting for your position...<br />Please allow your browser to give us your location so we can make the direction.';
	    	loading_block += '</div>';
	    	
	    	loading_block = $.parseHTML(loading_block);
	    	
	    	el.prepend(loading_block);
    	}
    	
    	var map_block = $.parseHTML("<div class='geomap'></div>");
    	el.append(map_block);
		
		// Plugin Param
		var settings = $.extend({
			mapTheme : "default",
			targetMarker : {
				lat : "40.705631",
				lng : "-73.978003"
			},
			travelMode : "driving",
			directionDetails : {
				enabled : true,
				panelOpened : false
			},
			directionStroke : {
				color : "#307bb4",
				opacity : 0.8,
				weight : 5
			},
			infoboxTexts : {
				user : "You Are Here !",
				target : "Our Office is Here !"
			}
		}, options );
		
		var u_lat = "";
		var u_lng = "";
				
		// Map Themes
		var theme_array  = { 
	    	"snazzy" :  [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#333739"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2ecc71"}]},{"featureType":"poi","stylers":[{"color":"#2ecc71"},{"lightness":-7}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-28}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"visibility":"on"},{"lightness":-15}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-18}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-34}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#333739"},{"weight":0.8}]},{"featureType":"poi.park","stylers":[{"color":"#2ecc71"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#333739"},{"weight":0.3},{"lightness":10}]}],
			"pale" : [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}],
			"bright" : [{"featureType":"water","stylers":[{"color":"#19a0d8"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"weight":6}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#e85113"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-40}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-20}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"road.highway","elementType":"labels.icon"},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","stylers":[{"lightness":20},{"color":"#efe9e4"}]},{"featureType":"landscape.man_made","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"hue":"#11ff00"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"hue":"#4cff00"},{"saturation":58}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#f0e4d3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-10}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"simplified"}]}],
			"neutral" : [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}],
			"blue"	: [{"featureType":"water","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"landscape","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]}],
			"subtle"	 : [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
		};
		
		// Ask for the user position 
		if($.cookie("user_geo_lat") == null || $.cookie("user_geo_lng") == null) {
			$.geolocation(function (lat, lng) {
				u_lat = lat;
				u_lng = lng;
								
				// Save the position in a cookie
				$.cookie("user_geo_lat", u_lat);
				$.cookie("user_geo_lng", u_lng);
				
				var ok_block = "<img src='img/checkmark.png' class='success' alt='ok' /><br />";
				ok_block += "<b>Thanks!</b> We have saved your current position.";
				
				
				$(".geoalert-info").removeClass("geoalert-info").addClass("geoalert-success").html(ok_block);
				                  
				setTimeout(function() {
					$(".geoalert-success").fadeOut();
				}, 3000);
				
				draw_map();
			}, function (error) {
				alert(error);
			});
		} else {
			u_lat = $.cookie("user_geo_lat");
			u_lng = $.cookie("user_geo_lng");
			
			draw_map();
		}
		
		function draw_map() {
			if(u_lat != null && u_lng != null)
			{
				// Create the MAP
				var map = new google.maps.Map($(map_block).get(0), {
					center: new google.maps.LatLng(settings.targetMarker.lat, settings.targetMarker.lng),
					mapTypeId: 'roadmap',
					zoom : 2
				});
				
				
				if(settings.mapTheme != "default") {
					map.set("styles", theme_array[settings.mapTheme]);
				}
				
				var geocoder = new google.maps.Geocoder();
				
				/* Markers Positions */
				var userLatLng = new google.maps.LatLng(u_lat, u_lng);
				var mainLatLng = new google.maps.LatLng(settings.targetMarker.lat, settings.targetMarker.lng);
				
				/* Write the user location */
				geocoder.geocode({"latLng":userLatLng},function(data,status) {
					
					if(status == google.maps.GeocoderStatus.OK) {
						
						var address_block = '<div class="geoalert-info">';
						address_block += "You have been located in <b>" + data[1].formatted_address + "</b>.";
						address_block += '</div>';
						el.prepend(address_block);
					}
				});
			
				var travelMode;
				
				/* Check the Travel Modes */
				if(settings.travelMode == "driving")
				{
					travelMode = google.maps.TravelMode.DRIVING;
				} else if(settings.travelMode == "bicycling") {
					travelMode = google.maps.TravelMode.BICYCLING;
				} else if(settings.travelMode == "transit") {
					travelMode = google.maps.TravelMode.TRANSIT;
				} else if(settings.travelMode == "walking") {
					travelMode = google.maps.TravelMode.WALKING;
				}
				
				var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, polylineOptions:{strokeColor:settings.directionStroke.color, strokeOpacity : settings.directionStroke.opacity, strokeWeight : settings.directionStroke.weight}});
				var directionsService = new google.maps.DirectionsService();
				
				// Start/Finish icons
				var icons = {
					start: new google.maps.MarkerImage(
						// URL
						'img/markers/start.png',
						// (width,height)
						new google.maps.Size( 50, 50 ),
						// The origin point (x,y)
						new google.maps.Point( 0, 0 ),
						// The anchor point (x,y)
						new google.maps.Point( 25, 50 )
					),
					end: new google.maps.MarkerImage(
						// URL
						'img/markers/end.png',
						// (width,height)
						new google.maps.Size( 50, 50 ),
						// The origin point (x,y)
						new google.maps.Point( 0, 0 ),
						// The anchor point (x,y)
						new google.maps.Point( 25, 50 )
					)
				};
	
							
				/* Draw the Direction */
				var start = u_lat + "," + u_lng;
				var end = settings.targetMarker.lat + "," + settings.targetMarker.lng;
				var request = {
					origin:start,
					destination:end,
					travelMode: travelMode
				};
				
				/* Create the Markers */
				makeMarker( map, userLatLng, icons.start, settings.infoboxTexts.user );
				makeMarker( map, mainLatLng, icons.end,settings.infoboxTexts.target );
				
				
				directionsService.route(request, function(result, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						directionsDisplay.setDirections(result);
						directionsDisplay.setMap(map);
					} else {
						el.before("<div class='geoalert-warning'><b>Woops!</b> You are too far from the target marker, we can't draw the direction... But don't worry, it happens in the demo since there is just one marker for every countries, and we can't make a direction over the oceans!</div>");
					}
				});
				
				
				/* Print the Directions Details */
				if(settings.directionDetails.enabled) 
				{
					var panel = $.parseHTML("<div class='directions_panel_link'><img class='img_collapse' src='img/plus.png' alt='' /> Display the Direction Details <img class='img_collapse' src='img/plus.png' alt='' /> </div><div class='directions_panel_container'><div class='directions_panel'></div></div>");
					
					el.append(panel);
					
					directionsDisplay.setPanel($(".directions_panel").get(0));
					
					if(!settings.directionDetails.panelOpened)
					{
						$(".directions_panel_link").attr("data-status", "hidden");
						$(".directions_panel_container").hide();
					} else {
						$(".directions_panel_link").html("<img class='img_collapse' src='img/minus.png' alt='' />  Hide the Direction Details <img class='img_collapse' src='img/minus.png' alt='' />");
						$(".directions_panel_link").attr("data-status", "shown");
					}
					
					/* Click Event to Display / Hide the Direction Details Panel */
					$(document).on("click", ".directions_panel_link", function(e) {
						$(".directions_panel_container").slideToggle("slow");
						
						var status = $(this).attr("data-status");
						
						if(status == "hidden") {
							$(this).html("<img class='img_collapse' src='img/minus.png' alt='' /> Hide the Direction Details <img class='img_collapse' src='img/minus.png' alt='' />");
							$(this).attr("data-status", "shown");
						} else {
							$(this).html("<img class='img_collapse' src='img/plus.png' alt='' /> Display the Direction Details <img class='img_collapse' src='img/plus.png' alt='' />");
							$(this).attr("data-status", "hidden");
						}
					});
				}
			}
		}

		function makeMarker( map, position, icon, title ) {
			var marker = new google.maps.Marker({
				position: position,
				map: map,
				icon: icon,
				title: title
			});
			
			/* Make the infoboxes */
			var boxText = document.createElement("div");
		        boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: #000; padding: 5px; color: #FFF";
		        boxText.innerHTML = title;
				
			var myOptions = {
				 content: boxText
				,disableAutoPan: false
				,maxWidth: 0
				,pixelOffset: new google.maps.Size(26, -55)
				,zIndex: null
				,boxStyle: { 
				  background: "none"
				  ,opacity: 0.75
				  ,width: "140px",
				  textAlign : "center"
				 }
				,closeBoxMargin: "10px 2px 2px 2px"
				,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
				,infoBoxClearance: new google.maps.Size(1, 1)
				,isHidden: false
				,pane: "floatPane"
				,enableEventPropagation: false
			};
		
			var ib = new InfoBox(myOptions);
			ib.open(map, marker);
		}
	};
}( jQuery ));