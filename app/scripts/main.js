$(document).ready(function() {

	// Scroll header image
	$.stellar({
		horizontalScrolling: false,
		verticalOffset: 40
	});

	var divs = $('#header-content');
	$(window).scroll(function(){
		var percent = $(document).scrollTop() / ($(".site-header").height());
		divs.css('opacity', 1 - percent * 2);
	});

	// Get latest pins
	$('#latest-pins').dcPinterestFeed({
		id: 'stevenkuster',
		results: 25
	});

	// activate jquery isotope
	var $container = $('.stream').imagesLoaded( function() {
		$container.find('img').imgpreload(function(){
			$container.isotope({
				itemSelector : 'section',
				layoutMode: 'masonry',
				masonry: {
					columnWidth: 'section'
				}
			});
		});
	});

	// Get latest Strava rides
	$.ajax({
		url: "https://www.strava.com/api/v3/athlete/activities?per_page=4&access_token=f89e87fc8e44fe8ea976bd481a7aeaebf31ce355",
		dataType: 'jsonp',
		success: function(data){
			var list = $('#rides');

			$.each(data, function(idx, obj) {
				var section = $('<section/>').attr("id", obj.id).appendTo(list);
				var outer = $('<div/>').addClass("panel").appendTo(section);
				var header = $('<div/>').addClass("panel-heading").appendTo(outer);

				// Ride date
				var date = moment(obj.start_date).format("DD MMMM YYYY");
				$('<h2>').addClass("panel-title").text(date).appendTo(header);

				var kudos = $('<span/>').addClass("kudocount").text(obj.kudos_count).appendTo(header);
				$('<i/>').addClass("fa fa-thumbs-up").prependTo(kudos);

				// Comments
				var comments = $('<span/>').addClass("kudocount").text(obj.comment_count).appendTo(header);
				$('<i/>').addClass("fa fa-comment").prependTo(comments);

				// Ride map
				url = GMaps.staticMapURL({
					size: [800, 400],
					zoom: 10,
					fitZoom: true,
					fitLatLngBounds: obj.map.summary_polyline,

					polyline: {
						path: obj.map.summary_polyline,
						strokeColor: '#FC4C02',
						strokeOpacity: 1,
						strokeWeight: 2
					}
				});

				var imgLink = $('<a/>').attr("href", "http://www.strava.com/activities/" + obj.id).attr("target", "_blank").addClass("ride_img").appendTo(outer);
				$('<img/>').attr('src', url).appendTo(imgLink);

				//Panel body
				var inner = $('<div/>').addClass("panel-body").appendTo(outer);
				var datalist = $('<div>').addClass("datalist").appendTo(inner);
				var listrow1 = $('<div>').addClass("datalist-row").appendTo(datalist);
				var listrow2 = $('<div>').addClass("datalist-row").appendTo(datalist);

				// Ride distance
				function dist_convert(distance) {
					var km = distance / 1000;
					return km.toFixed(1) + " km";
				}

				var distance = dist_convert(obj.distance);
				var distanceFormatted = $('<div>').addClass("datalist-cell").text(distance).appendTo(listrow1);
				$('<div>').text('Distance').addClass("datalist-description").appendTo(distanceFormatted);

				// Elevation gain
				var elevation = $('<div>').addClass("datalist-cell").text(obj.total_elevation_gain + ' m').appendTo(listrow1);
				$('<div>').text('Elevation').addClass("datalist-description").appendTo(elevation);

				// Average speed
				function speed_convert(speed) {
					var kmh = speed * 3.6;
					return kmh.toFixed(1) + " km/h";
				}

				var speed = speed_convert(obj.average_speed);
				var speedFormatted = $('<div>').addClass("datalist-cell").text(speed).appendTo(listrow1);
				$('<div>').text('Average speed').addClass("datalist-description").appendTo(speedFormatted);

				// Ride time
				function sformat(s) {
					var fm = [
							Math.floor(s / 60 / 60) % 24, // HOURS
							Math.floor(s / 60) % 60, // MINUTES
							s % 60 // SECONDS
					];
					return $.map(fm, function(v, i) { return ((v < 10) ? '0' : '') + v; }).join(':');
				}

				var time = sformat( obj.moving_time );  //value of sf --> 00:00:24:10
				var timeFormatted = $('<div>').addClass("datalist-cell").text(time).appendTo(listrow2);
				$('<div>').text('Ride time').addClass("datalist-description").appendTo(timeFormatted);

				// Kudos
				var heartrate  = $('<div>').addClass("datalist-cell").text(obj.average_heartrate.toFixed(0) + " bpm").appendTo(listrow2);
				$('<div>').text('Heartrate').addClass("datalist-description").appendTo(heartrate);

				// Weighted power
				var weightedPower  = $('<div>').addClass("datalist-cell").text(obj.weighted_average_watts + ' W').appendTo(listrow2);
				$('<div>').text('Power').addClass("datalist-description").appendTo(weightedPower);

				// Link to Strava
				var link = $('<a/>').attr("href", "http://www.strava.com/activities/" + obj.id).attr("target", "_blank").text("view on Strava").addClass("btn");
				$(link).appendTo(inner);
			});
		}
	});

	// Slide to section
	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 750, 'swing');
				return false;
			}
		}
	});

	$('body').scrollspy({ target: '.scroll-label' })

});
