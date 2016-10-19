var windowWidth, windowHeight, availWidth, availHeight, postWidth, postHeight;
var postsPerRow = 6;
var basePostWidth = 180;
var basePostHeight = 135;
var postMargin = 8;
var postRatio = basePostWidth / basePostHeight;
var tooSmall = false;
var minFontSize = 15;
var minLineHeight = 19;
var imageRatio = 1120 / 752;
var panelOpen = false;
var isTouch = false;
var autoZoom = true;
var stopLoading = false;
var showPinch = true;

$(function ()
{

    isTouch = Modernizr.touch;
    isPhone = $(window).width() < 768 ? true : false;
    var $grid = $('#grid');
    var $posts = $('.post');
    var $images = $('.post a');
    var numImages = isTouch ? $images.length : $images.length * 2;
    var imagesLoaded = 0;
    var $container = $('#container');
    var $title = $('header h1');
    var $intro = $('#title');
    var $nav = $('header nav li');
    var $body = $('body');
    var $loader = $('#loader');
    var $single = $('#single');
    var $image = $('#image');
    var home_uri = $('header h1 a').attr('href');
    $('.post a').click(function (e)
    {
        e.preventDefault();
    });
    var clickEvent = Modernizr.touch ? 'touchstart' : 'click';

    if(!isTouch)
    {
    $(document).click(function(e) {
        if ($('.text-open').length && panelOpen) {

            $('.text-open').removeClass('.text-open').fadeOut('', function() {
                panelOpen = false;
            });


        }
    });
    }

    $('#content article').each(function ()
    {
        var $this = $(this);
        $this.data('height', $this.height());
        $this.find('.close').click(function ()
        {

            $this.removeClass('text-open').fadeOut('', function ()
            {
                panelOpen = false;
            });
        })
    });
    $('div.text').on('click', 'a', function (e)
    {
        e.stopPropagation();
    })

    var is_loading = function ()
    {
        $loader.addClass('isLoading');
        $body.addClass('no-cursor');
    }
    var not_loading = function ()
    {
        $loader.removeClass('isLoading');
        $body.removeClass('no-cursor');
    }
    var is_single = function ()
    {
        $loader.addClass('single');
        $body.addClass('no-cursor');
    }
    var not_single = function ()
    {
        $loader.removeClass('single');
        $body.removeClass('no-cursor');
    }
    var check_load = function ()
    {
        imagesLoaded++;

        if (imagesLoaded >= numImages)
        {
            init_site();
        }
    }
    var init_site = function ()
    {

        setTimeout(function ()
        {
            $('#title').fadeOut();
        }, 50 * $posts.length);
        setTimeout(function ()
        {
            $('header').css(
            {
                display: 'none',
                visibility: 'visible'
            }).fadeIn(600, function ()
            {

                init_posts();
            });
        }, 50 * $posts.length);
    }
    var init_posts = function ()
    {
        var inc = 20;
        var timer = inc;
        var speed = 200;
        $posts.each(function ()
        {
            var $this = $(this);
            var title = $this.data('title');
            setTimeout(function ()
            {
                $this.addClass('ready').find('img.dark').fadeIn();
            }, timer);
            timer += inc;
            $(this).hover(function ()
            {
                $(this).find('img.dark').stop(true, true).fadeOut();
            }, function ()
            {
                $(this).find('img.dark').stop(true, true).fadeIn();
            })
            $(this).find('a').first().click(function (ev)
            {
                ev.preventDefault();
                $posts.removeClass('selected')
                $(this).parent().addClass('selected');
                $activePost = $(this).parent();
                $('.post').removeClass('active');
                $activePost.addClass('active');
                clearSingle($(this).attr('href'), title);
            });

            if (Math.floor(timer / $posts.length) == 20 && autoZoom)
            {
                autoZoom = false;
                not_loading();
                if ($('.post.active').length)
                {
                    setTimeout(function ()
                    {

                        $('.post.active a').first().click();
                    }, 700);
                }
            }
        });
    }
    var resize = function ()
    {
        windowWidth = $(this).width();
        windowHeight = $(this).height();

        if(windowWidth > 1500) windowWidth = 1500;

        availWidth = windowWidth - 80;
        availHeight = windowHeight - 80;
        postWidth = (availWidth - (5 * postMargin)) / postsPerRow;

        if (postWidth > 335)
        {
            postWidth = 335;
            availWidth = (postWidth * postsPerRow) + (postMargin * 5)
        }
        postHeight = postWidth / postRatio;
        var singleColumn = postWidth + postMargin;
        var doubleColumn = (postWidth + postMargin) * 2;
        var tripleColumn = ((postWidth + postMargin) * 3) - postMargin;
        if (windowWidth > 767 && !isTouch)
        {
            $container.width(availWidth);
            $title.width(doubleColumn);
            $('article').each(function ()
            {
                $(this).width(doubleColumn - postMargin).height('auto');
                var h = $(this).outerHeight();
                var rows = Math.ceil(h / postHeight);
                var thisHeight = Math.ceil((rows * postHeight) + ((rows - 1) * postMargin));
                if ($(this).hasClass('about'))
                {
                    $(this).css('left', doubleColumn);
                    $(this).height(thisHeight + 1);
                }
                else if ($(this).hasClass('contact'))
                {
                    $(this).css('left', doubleColumn * 2);
                    $(this).height(thisHeight + 1);
                }
                else if ($(this).hasClass('bike-right'))
                {
                    $(this).css(
                    {
                        'left': doubleColumn - 8,
                        width: doubleColumn + 5
                    });
                }
            });
            $nav.width(singleColumn);
            $('#single nav > ul li:not(.last)').width(singleColumn);

            $('a.back').parent().width(doubleColumn);

            $('#details').css('left', doubleColumn);
            var typeRatio = postWidth / basePostWidth;
            var fontSize = minFontSize * typeRatio;
            var lineHeight = minLineHeight * typeRatio;
            if (fontSize < minFontSize) fontSize = minFontSize;
            if (lineHeight < minLineHeight) lineHeight = minLineHeight;

            var left = 0;
            var top = 0;
            var count = 1;
            $posts.each(function ()
            {
                $(this).css(
                {
                    top: top,
                    left: left,
                    width: postWidth,
                    height: postHeight
                });
                count++;
                left += (postWidth + postMargin);
                if (count > 6)
                {
                    top += (postHeight + postMargin);
                    left = 0;
                    count = 1;
                }
            });

            $('#grid').height(top + 60);
        }

        var singleWidth = $('#container').width();
        var singleHeight = singleWidth / imageRatio;

        $single.width(singleWidth).height(singleHeight);
        $('#image').height(singleHeight);

        if ($('#image').length)
        {
            var $img = $('#image');
            var pos = $img.offset();
            imagePos = {
                top: pos.top,
                left: pos.left,
                right: pos.left + singleWidth,
                bottom: pos.top + singleHeight
            }
        }
    }
    var clearSingle = function (src, title)
    {
        if (panelOpen) return false;
        if ($('#image').length)
        {
            $('#image').hide();

            $single.html('').removeClass('loaded');
            load_single(src, title);

        }
        else
        {
            load_single(src, title);
        }
    }
    var load_single = function (src, title)
    {
        if (panelOpen) return false;
        stopLoading = true;
        is_loading();

        $grid.css('opacity', 0);
        $single.show();
        scrollPage(0)
        $.post(src,
        {
            single: true,
            touch: isTouch,
            ajax: true
        }, function (result)
        {

            update_browser(src, title);

            var $tmp = $('<div id="tmp"/>');
            $tmp.html(result);
            $data = $tmp.find('#single').html();

            if (!isTouch)
            {
                var i = new Image();
                $(i).load(function ()
                {
                    $single.append($data);
                    resize();
                    init_single();
                    $single.find('#data').fadeIn();

                    not_loading();

                    preload_fullres($single.find('#image img'));
                });
                i.src = $(result).find('#image img').attr('src');
            }
            else
            {
                $single.append($data);
                var postPos = $posts.index($posts.filter('.selected'));
                if (postPos == 0)
                {
                    $single.find('a.previous').hide();
                }
                if (postPos == ($posts.length - 1))
                {
                    $single.find('a.next').hide();
                }
                resize();
                if (Modernizr.ipad) $single.append('<div id="zoompause" style="position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:999"/>')
                init_single();
                $single.find('#data').show();
                var pinchTime = 0;
                var si = new Image();
                $(si).load(function ()
                {

                    setTimeout(function ()
                    {

                        $single.find('img.place').show();
                        if (!isPhone) init_touch_pan();
                        else not_loading();
                    }, pinchTime);
                });
                si.src = $single.find('img.place').attr('src');
            }
        });

    }
    var preload_fullres = function ($img)
    {
        var hiSrc = $img.data('hi');
        var curSrc = $img.attr('src');

        var i = new Image();
        $(i).load(function ()
        {
            $single.addClass('loaded');
            var $hiRes = $('<img/>');
            $hiRes.attr('src', hiSrc).css('display', 'none').addClass('full-res');
            $zoom = $hiRes;
            $img.parent().append($hiRes);

        });
        i.src = hiSrc;
    }
    var init_tiles = function ()
    {
        var loadedTiles = 0;
        var left = 0;
        var top = 0;
        var totalTiles = $('#tiles div.tile').length;

        var start = new Date();
        var startedAt = start.getTime();
        stopLoading = false;
        var process_tile = function ()
        {
            if (stopLoading) return false;
            $tiles = $('#tiles div.tile:not(.ready)');
            var numTiles = $tiles.length;
            var tilesPerLoad = 16;
            var loadedTilesThisTime = 0;

            if (!$tiles.length)
            {
                not_loading();
                $('img.place,#zoompause').hide();
                if (showPinch && !isPhone)
                {
                    $('#pinch').fadeIn();
                    pinchTime = 1500;
                    showPinch = false;
                    setTimeout(function ()
                    {
                        $('#pinch').fadeOut();
                    }, 3000);
                }
                var end = new Date();
                var endedAt = end.getTime();

            }
            else
            {
                $tilesToLoad = $tiles.slice(0, (tilesPerLoad));

                $tilesToLoad.each(function ()
                {
                    var $tile = $(this);
                    var tile_index = $(this).data('tile');
                    var t = top;
                    var l = left;
                    $.post(theme_base + '/tile.php',
                    {
                        post_id: post_id,
                        tile_src: tile_src,
                        tile: tile_index
                    }, function (result)
                    {

                        if (result == 0)
                        {

                        }
                        else
                        {
                            var tile = new Image();
                            $(tile).load(function ()
                            {
                                var $img = $('<img/>');
                                $img.attr('src', theme_base + '/' + result);
                                $tile.css(
                                {
                                    position: 'absolute',
                                    width: 640,
                                    top: t,
                                    left: l
                                });
                                $tile.append($img);
                                loadedTiles++;
                                loadedTilesThisTime++;

                                $tile.addClass('ready');
                                if ((loadedTilesThisTime == tilesPerLoad) || (loadedTiles == totalTiles)) process_tile();
                            });
                            tile.src = theme_base + '/' + result;
                        }
                    });
                    left += 640;
                    if (left > 2600)
                    {
                        left = 0;
                        top += 640;
                    }
                });
            }
        }
        process_tile();
    }
    var init_touch_pan = function ()
    {
        if (isTouch)
        {

            $('#image #tiles').smoothZoom(
            {
                width: '100%',
                height: '100%',
                use_3D_Transform: true,
                zoom_BUTTONS_SHOW: 'NO',
                pan_BUTTONS_SHOW: 'NO',
                pan_LIMIT_BOUNDARY: 'YES',
                zoom_MAX: 80,

                responsive: true,
                container: 'image',
                border_SIZE: 0,
                animation_SPEED_PAN: 10,
                animation_SMOOTHNESS: 1,
                background_COLOR: 'transparent',
                on_IMAGE_LOAD: function ()
                {
                    init_tiles();

                }
            });

        }
    }
    var init_single = function ()
    {
        var cls = 'plus';
        $zoom = $('#image img');
        $('#content').addClass('single');
        $('#single a.details').click(function ()
        {

            $('#single #details').addClass('text-open').fadeIn('', function ()
            {
                panelOpen = true;
            });
        });
        $('#single .close').click(function ()
        {

            $('#single #details').hide().fadeOut('', function ()
            {
                $(this).removeClass('text-open');
                panelOpen = false;
            });
        });
        $('p.share a').click(function ()
        {

            $('.share-bike').fadeToggle();
            $(this).parent().toggleClass('open');
        });
        $('a.back').click(function ()
        {

            $single.fadeOut('', function ()
            {
                $(this).html('').removeClass('loaded');
                $loader.attr('class','');
            });
            $('#content').removeClass('single');
            update_browser(home_uri, '')
            $grid.fadeTo('', 1);
        });

        if (!isTouch)
        {

            $('#image').click(function (ev) {});
        }
        if (isTouch)
        {
            $('a.next').click(function ()
            {
                nextPost();
            });
            $('a.previous').click(function ()
            {
                prevPost();
            });
        }
    }
    var isOverImage = function (mouseLeft, mouseTop)
    {
        return ($('#image').length && $('#image').is(':visible')) && mouseLeft > imagePos.left && mouseLeft < imagePos.right && mouseTop > (imagePos.top + 30) && mouseTop < imagePos.bottom && !panelOpen;
    }
    var setCursor = function (ev)
    {
        if (isOverImage(ev.pageX, ev.pageY))
        {
        	$('body').css('cursor','none');
            if (!$('body').hasClass('no-cursor'))
            {
                if ($zoom.hasClass('zoom'))
                {
                    $loader.removeClass('plus prev next');
                    $loader.attr('class', 'minus');
                    panZoom(ev, true)
                }
                else
                {

                    var left = ev.pageX - imagePos.left;
                    var w = $(this).width();
                    var right = imagePos.right - ev.pageX;
                    if (left < 200 && $activePost.prev().length) cls = "prev";
                    else if (right < 200 && $activePost.next().length) cls = "next";
                    else cls = 'plus';
                    $loader.attr('class', cls);
                }
            }
        }
        else
        {
        	$('body').css('cursor','auto');
            $loader.removeClass('plus prev next minus');
        }
    }
    if (!isTouch)
    {
        $(document).mousemove(function (e)
        {
            $loader.css(
            {
                top: e.pageY - 16,
                left: e.pageX - 16
            });

            if ($('#image').length && imagePos != undefined)
            {
                setCursor(e);
            }
        }).click(function (ev)
        {
            if ($('#image').length && imagePos != undefined)
            {
                if (isOverImage(ev.pageX, ev.pageY))
                {
                    var cls = $loader.attr('class');
                    if (cls == 'next') nextPost();
                    else if (cls == 'prev') prevPost();
                    else if (cls == 'plus' || cls == 'minus')
                    {
                        zoomIfLoaded(ev);
                    }
                }
            }
        });
    }
    var isZoomed = false;
    var zoomIfLoaded = function (ev)
    {
        if (panelOpen) return false;
        if ($single.hasClass('loaded'))
        {
            not_loading();
            zoomPost(ev);
        }
        else
        {
            is_loading();
            setTimeout(function ()
            {
                zoomIfLoaded(ev);
            }, 300);
        }
    }
    var zoomPost = function (ev)
    {
        if (!isTouch)
        {
            if (!isZoomed)
            {

                $zoom.addClass('zoom');
                $('img.place').hide();
                $('img.full-res').show();
                isZoomed = true;
                $loader.attr('class', 'index minus');
                panZoom(ev, false);
                autoZoom = true;
            }
            else
            {
                $zoom.removeClass('zoom');
                $('img.place').show();
                $('img.full-res').hide();
                isZoomed = false;
                $loader.attr('class', 'index plus');
            }
        }
    }
    var panZoom = function (e, animate)
    {
        if (isTouch) return false;
        var $parent = $('#image');
        var parentWidth = $parent.width();
        var parentHeight = $parent.height();
        var imgWidth = $zoom.width();
        var imgHeight = $zoom.height();
        var off = $parent.offset();
        var mx = e.pageX - off.left;
        var my = e.pageY - off.top;
        var wRatio = (parentWidth / imgWidth) * 100;
        var hRatio = (parentHeight / imgHeight) * 100;
        var maskY = 0 - Math.round(((my / hRatio) * 100));
        var maskX = 0 - Math.round(((mx / wRatio) * 100));
        var minX = -(parentWidth / 2);
        var maxX = -(imgWidth - (parentWidth / 2));
        var minY = -(parentWidth / 2);
        var maxY = -(imgHeight - (parentHeight / 2));
        if (maskX > minX) maskX = minX;
        if (maskX < maxX) maskX = maxX;
        if (maskY > minY) maskY = minY;
        if (maskY < maxY) maskY = maxY;
        if (animate)
        {
            $zoom.stop(true, false).animate(
            {
                'top': maskY + (parentHeight / 2),
                'left': maskX + (parentWidth / 2)
            }, 500, 'easeOutQuint');
        }
        else
        {
            $zoom.stop(true, false).css(
            {
                'top': maskY + (parentHeight / 2),
                'left': maskX + (parentWidth / 2)
            });
        }
    }
    var nextPost = function ()
    {
        var $n = $activePost.next();
        if ($n.length)
        {
            $n.find('a').click();
            if (Modernizr.touch)
            {
                $('a.previous').show();
                if (!$n.next().length) $('a.next').hide();
            }
        }
    }
    var prevPost = function ()
    {
        var $n = $activePost.prev();
        if ($n.length)
        {
            $n.find('a').click();
            if (Modernizr.touch)
            {
                $('a.next').show();
                if (!$n.prev().length) $('a.previous').hide();
            }
        }
    }
    var update_browser = function (uri, title)
    {
        if ('pushState' in window.history)
        {
            window.history.pushState('', title, uri);
        }
        else
        {
        	var parts = uri.split('/');
            location.hash = parts[parts.length - 2];
        }
    }
    is_loading();
    $(window).resize(resize).resize();
    $intro.fadeIn(1000);
    timeout = 0;
    postsToLoad = 6;
    totalPostsLoaded = 0;
    var init_post = function ($post, timer)
    {
        var myDate = new Date();
        var end = myDate.getTime();
        var loadTime = end - timer;
        timeout += loadTime > 100 ? 0 : 5;
        $post.addClass('loaded');
        totalPostsLoaded++;
        console.log(totalPostsLoaded);
        if (totalPostsLoaded == postsToLoad)
        {
            totalPostsLoaded = 0;
            preload_posts();
        }

        setTimeout(function ()
        {
            if ($post.css('display') == 'none') $post.fadeIn('');
            else $post.css(
            {
                visibility: 'visible',
                display: 'none'
            }).fadeIn('');
        }, timeout);
    }
    var preload_posts = function ()
    {
        $toLoad = $posts.filter(':not(.loaded)');
        console.log('Before rand',$toLoad.length);
        $toLoad = $toLoad.sort(function ()
        {
            return (Math.round(Math.random()) - 0.5)
        });


        if($toLoad.length < postsToLoad)
        {
        	postsToLoad = $toLoad.length

        }

        if (!$toLoad.length)
        {
            init_site();
        }
        else
        {
            $toLoad.slice(0, postsToLoad).each(function ()
            {
                var $this = $(this).find('a').first();
                var date = new Date();
                var timer = date.getTime();
                var $post = $(this);
                var iloaded = 0;

                var light = new Image();
                $(light).load(function ()
                {
                    $this.append('<img src="' + this.src + '" class="light">');
                    iloaded++;
                    if (isTouch) iloaded++;
                    if (iloaded == 2)
                    {
                        init_post($post, timer);

                    }
                });
                light.src = $this.data('light');
                if (!isTouch)
                {

                    var dark = new Image();
                    $(dark).load(function ()
                    {
                        $this.append('<img src="' + this.src + '" class="dark">');
                        iloaded++;
                        if (iloaded == 2)
                        {
                            init_post($post, timer);

                        }
                    });
                    dark.src = $this.data('dark');
                }
            });
        }
    }
    preload_posts();

    $('header nav li a[target!="_blank"]').click(function (ev)
    {
        ev.preventDefault();
        panelOpen = false;
        var cls = $(this).attr('class');
        var $text = $('article.' + cls);
        $('#content article:not(.' + cls + '),#details').fadeOut();
        if ($text.length)
        {
            $text.addClass('text-open').fadeIn('', function ()
            {
                panelOpen = true;
            });

        }
    });
    $('#single #back').click(function ()
    {
        $single.hide();
        $grid.show();
        not_single();
    });
    window.scrollTo(0, 1);
});

function scrollPage(to)
{
    $('body,html').animate(
    {
        scrollTop: to
    }, 700, 'easeInOutQuint');
}
