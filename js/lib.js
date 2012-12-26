var accessToken = '966633.a3b48b3.1277b3ac8db54ebdaaa55faba838a3a0',
	agent = navigator.userAgent.match( /(iPhone|iPod|Android)/i ),
	limit = 50,
	currentLocation = window.location.hash,
	cleanCurrentLocation = currentLocation.replace('#','');
	
	if(currentLocation == '') {
		cleanCurrentLocation = 'brasil';
	}

var brasilgram = function() {
	return {
		init: function() {
			brasilgram.loadImages();
			if(!agent){
				brasilgram.social();
			}
		},
		social: function(){
			$.getScript('http://platform.twitter.com/widgets.js');
			
			$.getScript("http://connect.facebook.net/pt_BR/all.js#xfbml=1", function(){
				FB.init({status: true, cookie: true, xfbml: true, oauth: true});
			});
				
			$.getScript('https://apis.google.com/js/plusone.js');
		},
		setGrid: function(){
			$('#ri-grid').gridrotator({
				rows : 4,
				columns : 8,
				maxStep : 2,
				interval : 2000,
				preventClick: false,
				w1024 : {
					rows : 5,
					columns : 6
				},
				w768 : {
					rows : 5,
					columns : 5
				},
				w480 : {
					rows : 6,
					columns : 4
				},
				w320 : {
					rows : 7,
					columns : 4
				},
				w240 : {
					rows : 7,
					columns : 3
				},
			});
		},
		loadImages: function() {
			var getImagesURL = 'https://api.instagram.com/v1/tags/'+cleanCurrentLocation+'/media/recent?client_id=be52cb013dda4c47a03cdd5689896c37&count='+limit+'&access_token='+ accessToken +'&callback=?'
			$.ajax({
				type: "GET",
				dataType: "jsonp",
				cache: false,
				url: getImagesURL,
				success: function(resp) {
					window.location.hash='#'+cleanCurrentLocation;
					
					$('#ri-grid').append('<ul id="instagram"></ul>');
					
					$.each(resp.data, function(i,photos){
			   			var photo = photos.images.low_resolution.url,
							url = photos.link;
						
						$('#instagram').append('<li><a href="'+url+'" target="_blank"><img src="'+photo+'" /></a></li>');
					});
					
					brasilgram.setGrid();
				}
			});
		}
	}
}();

$(function(){
	brasilgram.init();
	
	$('#open-menu').click(function(e){
		e.preventDefault();
		$("#states").slideToggle();
	});
});