// inject-script.js

// Jquery to add the elements where React should be added
var url_base = 'http://127.0.0.1:8000'

$(function() {
	queryDocument()
});

var identifier = 0;
var flair_identifier = 0;

function subredditHomepageInjection(obj, isPost) {
	var tagSpan = $("<span>");
	console.log('postflair ' + obj);
	switch (isPost) {
		case true:
			title = obj.querySelector('p[class="title"]');
			tagline = obj.querySelector('p[class^="tagline"]');
			the_url = obj.querySelector('p[class="title"] > a').getAttribute('data-href-url');
			if (the_url == null)
				break;
			tagSpan.attr({
				'id': 'check_for_flair' + flair_identifier,
				'post_url': obj.querySelector('p[class="title"] > a').getAttribute('data-href-url'),
				'post_user': obj.querySelector('p[class^="tagline"] > a').innerHTML
			})
			// a = title.querySelector('a');
			// title.insertBefore(tagSpan, a);
			title.innerHTML += tagSpan[0].outerHTML;
			flair_identifier += 1;
			break;
		case false:
			tagSpan.attr({ 
				'id': 'test_' + "comment_" + identifier,
				'username': $(obj).text()
			})
	}
	identifier += 1
	$(tagSpan).insertAfter(obj);
}


function postInjection(obj, isPost) {
	var tagSpan = $("<span>");
	switch (isPost) {
		case true:
			tagSpan.attr({ 
				'id': 'test_' + "post_" + identifier,
				'post_url': $(obj).attr('href')
			})
			break;
		case false:
			if (identifier == 1) {
				tagSpan.attr({ 
					'id': 'test_' + "comment_op_" + identifier,
					'username': $(obj).text()
				})
			} else {
				tagSpan.attr({ 
					'id': 'test_' + "comment_" + identifier,
					'username': $(obj).text()
				})
			}
	}
	identifier += 1
	$(tagSpan).insertAfter(obj);
}

function submissionFormInjection(obj) {
	var tagSpan = document.createElement('span');
	tagSpan.className = 'spacer';
	tagSpan.id = 'inject_form';
	obj.insertBefore(tagSpan, Array.from(obj.querySelectorAll("div[class='spacer']")).at(-3));
	console.log('form span injected');
}

function moderationInjection(obj) {
	var tagSpan = document.createElement('div');
	tagSpan.id = 'inject_moderation';
	obj.insertBefore(tagSpan, Array.from(obj.querySelectorAll("div[class^='linefield']")).at(2));
	console.log('moderation span injected');
}

function queryDocument() {
	switch (true) {
		case (window.location.href.includes("/comments/")):
			$('[data-event-action="title"]').each(function(){
				postInjection(this, true)
			}, null);

			$('p:contains("submitted")').find('a[class*="author"]').each( function(i){
				postInjection(this, false)
			}, null);

			$(".commentarea").find('div[class*="thing id"]').filter('.comment').find('.tagline').find('a[href*="user/"]').each( function(i){
				postInjection(this, false)
			}, null);
			var tagSpan = $("<span>");
			tagSpan.attr({
				'id' : 'post_toolbar' 
			})
			$(tagSpan).insertAfter($('.post-sharing-button').parent().siblings().last().children().first()); 
			break;
		case (window.location.href.includes("/submit")):
			const subreddit = window.location.href.split('\/').at(-2);
			// const checkExists = async () => {
			// 	// const response = await fetch(url_base + '/subreddit_exists/' + subreddit);
			// 	// if (response.ok) {
			// 	// 	const response_object = await response.json();
			// 	// 	if (response_object.result) {
			// 	const menuPage = document.querySelector('div[class="formtabs-content"]');
			// 	submissionFormInjection(menuPage);
			// }
			const menuPage = document.querySelector('div[class="formtabs-content"]');
			submissionFormInjection(menuPage);
			// checkExists();
			break;
		case (window.location.href.includes("/r/")):
			var top_matter = Array.from(document.querySelectorAll('div[class="top-matter"]'));
			for (let i = 0; i < top_matter.length; i++)
				subredditHomepageInjection(top_matter[i], true);
			$('.author, .Post__username, .ProfileSidebar__nameTitleLink, .CommentHeader__username, [data-click-id="user"], a[href*="user/"]').each( function(i){
				subredditHomepageInjection(this, false)
			}, null);
		case (window.location.href.includes("/about/edit")):
			const modmenuPage = document.querySelector('div[class="pretty-form"]');
			moderationInjection(modmenuPage);

	}
}