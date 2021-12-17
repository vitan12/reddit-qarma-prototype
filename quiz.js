$( function() {
	queryDocument()
});

var domCount = 0;

function handleUsers(obj, isPost) {
	var tagSpan = $("<span>");
	tagSpan.css({
		"background-color": "orange", 
		"border-radius": "5px", 
		"padding": "2px", 
		"margin": "3px"
	});

	if (isPost) {
		tagSpan.text("I am a post");
	} else {
		tagSpan.text("I am a commenter");
	}

	tagSpan.click(function() {
		// var modal = $('<div class="modal", id="myModal">');
		// var modalDialog = $('<div class="modal-dialog", role="document">');
		// var modalContent = $('<div class="modal-content">');
		// var modalHeader = $('<div class="modal-header">');
		// var header = $('<h5 class="modal-title", id="exampleModalLongTitle">');
		// header.text("quiz goes here");
		// modalHeader.append(header);
		// modalContent.append(modalHeader);
		// modalDialog.append(modalContent)
		// modal.append(modalDialog);
		chrome.runtime.sendMessage({cmd: "read_file"}, function(html){
			$("body").prepend($(html));
			console.log(html);
		});
		$('#myModal').modal('show');
	})

	$(tagSpan).insertAfter(obj);
}


function queryDocument(){
	var newCount = $('div').length
	console.log(newCount);
	if(newCount != domCount){
		domCount = newCount;

		$('[data-event-action="title"]').each(function(i){
			handleUsers(this, true)
		}, null);

		$('.author, .Post__username, .ProfileSidebar__nameTitleLink, .CommentHeader__username, [data-click-id="user"], a[href*="user/"]').each( function(i){
			handleUsers(this, false)
		}, null);
	}
}
