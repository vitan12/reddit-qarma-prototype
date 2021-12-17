import React from 'react';
import ReactDOM from 'react-dom';
import Foreground from './components/Foreground.js';
import UserFlair from './components/UserFlair.js';
import PostFlair from './components/PostFlair.js';
import Quiz from './components/Quiz.js';
import Form from './components/Form.js'
import Moderation from './components/Moderation.js'


var subreddit = window.location.href.split('/')[4]

var username = document.querySelector('div[id="header-bottom-right"]').querySelector('span[class="user"]').querySelector('a').innerHTML;
var post_op = $('p:contains("submitted")').find('a[class*="author"]').text()

// ReactDOM.findDOMNode(<instance-of-outermost-component>).getElementsByClassName('snap') // Returns the elements
var post_url = "placeholder"
var url = window.location.href
var posts = $('[id^="test_post"]');
var comments = $('[id^="test_comment"]');

// posts.each(function() {
//     post_url = $(this).attr('post_url')
//     console.log('i gotta be inserted', this);
//     ReactDOM.render(<PostFlair post_url={$(this).attr('post_url')} />, document.querySelector('#' + this.id));
// })

if (window.location.href.split('/').at(-2) == subreddit) {
    var all_posts = Array.from(document.querySelectorAll('span[id^="check_for_flair"]'));
    for (let i = 0; i < all_posts.length;  i++) {
        var curr_post = all_posts[i];
        var username = curr_post.getAttribute('post_user');
        var the_url = curr_post.getAttribute('post_url');
        fetch(url_base + '/entry_exists/' + username + '/' + btoa(the_url) + '/' + curr_post.id)
            .then(response => response.json())
            .then(json => {
                console.log('rendering...', curr_post.id)
                ReactDOM.render(<PostFlair should_render={json.result} />, document.querySelector('#' + json.id));
            })
    }
}

if (url.includes('comments')) {
    comments.each(function() {
        fetch(url_base + '/user_answered_frq/' + username + '/' + btoa(document.querySelector('p[class="title"]').querySelector('a').href))
            .then(response => response.json())
            .then(json => {
                var props = {
                    op: post_op,
                    url: document.querySelector('p[class="title"]').querySelector('a').href,
                    username: $(this).attr('username'),
                    cur_user: username,
                    should_render: json.frq
                }
                fetch(url_base + '/user_answered_frq/' + $(this).attr('username') + '/' + btoa(document.querySelector('p[class="title"]').querySelector('a').href))
                    .then(response => response.json())
                    .then(json => {
                        props.opponent_responded = json.frq;  
                        fetch(url_base + '/passing/' + $(this).attr('username') + '/' + btoa(document.querySelector('p[class="title"]').querySelector('a').href))
                            .then(response => response.json())
                            .then(json => {
                                props.opponent_quiz_score = json.passing.passing;
                                fetch(url_base + '/get_subreddit_options/' + subreddit)
                                    .then(response => response.json())
                                    .then(json => {
                                        props.minCorrect = json.minCorrect;
                                        fetch(url_base + '/upvotes/' + $(this).attr('username') + '/' + btoa(document.querySelector('p[class="title"]').querySelector('a').href))
                                            .then(response => response.json())
                                            .then(json => {
                                                props.upvotes = json.upvotes.upvotes;
                                                ReactDOM.render(<UserFlair {...props} />, document.querySelector('#' + this.id));
                                        })
                                })
                            })
                    })
            });
    })
    $('#post_toolbar').each(function() {
        fetch(url_base + '/what_exists/' + post_op + '/' + btoa(document.querySelector('p[class="title"]').querySelector('a').href))
            .then(response => response.json())
            .then(json => {
                console.log('what exists, ', json);
                if (!json.mcq) {
                    return;
                }
                var props = {
                    op: post_op,
                    mcq: json.mcq,
                    frq: json.frq,
                    url: document.querySelector('p[class="title"]').querySelector('a').href,
                    cur_user: username,
                    should_render: json.frq
                }
                fetch(url_base + '/get_subreddit_options/' + subreddit)
                .then(response => response.json())
                .then(json => {
                    props.minCorrect = json.minCorrect;
                    ReactDOM.render(<Quiz {...props} />, document.querySelector('#' + this.id));
                })
            });
    })
    
}

$('span[id^="inject_form"]').each(function() {
    console.log('injecting form..');
    fetch(url_base + '/get_subreddit_options/' + subreddit)
    .then(response => response.json())
    .then(json => {
        var elem = document.querySelector('span[id^="inject_form"]');
        var props = {
            op: username,
            subreddit: subreddit,
            length: json.lengthQuiz,
            threshold: json.qarmaThreshold
        }
        fetch(url_base + '/qarma/' + username)
        .then(response => response.json())
        .then(json => {
          props.qarma = json.qarma;  
          ReactDOM.render(<Form {...props} />, document.querySelector('#' + elem.id));
        })
    });
})

if (document.querySelector('div[id^="inject_moderation"]') != undefined) {
    console.log('injecting moderation..');
    fetch(url_base + '/get_subreddit_options/' + subreddit)
        .then(response => response.json())
        .then(json => {
            var elem = document.querySelector('div[id^="inject_moderation"]');
            var props = {
                subreddit: subreddit,
                min: json.minCorrect,
                length: json.lengthQuiz,
                threshold: json.qarmaThreshold
            }
            ReactDOM.render(<Moderation {...props} />, document.querySelector('#' + elem.id));
        });
}

