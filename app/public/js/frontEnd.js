$(document).ready(function() {

	var path;
	var data;
	var postIdArray = window.location.href.split('=');

	function relocateWindow() {
		data = $.param(data);
		window.location = (window.location.origin + path + data);
	}

	$('.col-single-post').click(function() {
		data = {
			postId: $(event.target).attr('data-obj-id')
		}
		path = '/detail?';
		relocateWindow();
	});

	$('.btn-save-opinion').click(function() {
		postIdArray.reverse();
		data = {
			username: $('#username').val().trim(),
			q1: $('#q1').text().trim(),
			a1: $('#convinced').val().trim(),
			q2: $('#q2').text().trim(),
			a2: $('#Makeyoulaugh').val().trim(),
			q3: $('#q3').text().trim(),
			a3: $('#comeAgain').val().trim(),
			postId: postIdArray[0]
		}
		console.log("submit button hit", data)
		path = '/submit'
		relocateWindow();
	});
	$('.btn-show-opinions').click(function() {
		postIdArray.reverse();
		data = {
			showOpinion: true, 
			postId: postIdArray[0]
		}
		path = '/showopinion';
		relocateWindow();
	});

	$('.btn-create-opinion').click(function() {
		postIdArray.reverse();
		data = {
			showOpinion: false,
			postId: postIdArray[0]
		}
		path = '/detail?';
		relocateWindow();
	});

	$('.grid').masonry({
  	// options
  	itemSelector: '.col-single-post'
	});
});