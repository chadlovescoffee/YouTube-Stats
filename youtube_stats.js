var $ = require('jquery');
var relative_date = require('relative_date');
var commas_to_number = require('commas_to_number');


$( document ).ready(function() {

    // include CSS
    $('head').prepend('<link rel="stylesheet" type="text/css" href="dist/youtube_stats.css">');


    // use new key (warner's) ??
    var apikey = 'AIzaSyB-maeYxfWggeDNhB2ITl1MNwe83DXoiyg';


    // Build Video ID array
    var video_id_array = [];
    var classes_array = [];
    var build_id_array = $('.youtube_stats').each(function () {

        var classes = $(this).attr('class');

        var video_source = $(this).attr('src');
        var video_source_split = video_source.split('/');
        var video_source_id_split = video_source_split[4].split('?');
        var video_source_id = video_source_id_split[0];

        video_id_array.push(video_source_id);
        classes_array.push(classes);
        $(this).addClass(video_source_id);
    });

    //console.log(video_id_array);
    //console.log(classes_array);


    // Build Video Views Array
    $.get('https://www.googleapis.com/youtube/v3/videos?id=' + video_id_array + '&key=' + apikey + '&part=statistics', function (array_stats) {

        var i = 0;
        var video_views_array = [];

        $(array_stats.items).each(function () {
            video_views_array.push(commas_to_number(array_stats.items[i].statistics.viewCount));
            ++i;
        });

        //console.log(video_views_array);
        get_title_and_date(video_views_array);
    });



    // Get Video Title & Publish Date
    function get_title_and_date(video_views_array){

        $.get('https://www.googleapis.com/youtube/v3/videos?id=' + video_id_array + '&key=' + apikey + '&part=snippet', function (array_snippets) {

            var i = 0;
            var video_title_array = [];
            var video_date_array = [];

            $(array_snippets.items).each(function () {

                video_title_array.push(array_snippets.items[i].snippet.title);
                video_date_array.push(relative_date(array_snippets.items[i].snippet.publishedAt));
                ++i;
            });

            //console.log(video_title_array);
            //console.log(video_date_array);

            update_view(video_views_array, video_title_array, video_date_array);
        });
    }


    function update_view(video_views_array, video_title_array, video_date_array){

        $('.youtube_stats').removeClass('youtube_stats');

        var i = 0;
        $(video_id_array).each(function () {

            var stats_html =
                    '<h3 class="title">' + video_title_array[i] + '</h3>' +
                    '<h6 class="views c1">' + video_views_array[i] + ' views</h6>' +
                    '<h6 class="post c2">|</h6>' +
                    '<h6 class="date c1">' + video_date_array[i] + '</h6>'
                ;

            $('.' + video_id_array[i]).wrap('<div class="ratio"></div>');
            $('.' + video_id_array[i]).parent().wrap('<div class="video"></div>');
            $('.' + video_id_array[i]).parent().parent().wrap('<div class="column_wrapper"></div>');
            $('.' + video_id_array[i]).parent().parent().parent().wrap( '<div class="' + classes_array[i] + '"></div>');
            $('.' + video_id_array[i]).parent().parent().parent().append( '<div class="stats">' + stats_html + '</div>');
            ++i;
        });
    }

});