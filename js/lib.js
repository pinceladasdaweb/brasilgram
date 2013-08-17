var Browser = function () {
    var u = navigator.userAgent;
    return {
        m: u.match(/(iPhone|iPod|Android)/i)
    }
}();

var Social = {
    init: function () {
        this.fetch();
    },
    getScript: function (url, callback) {
        var head = document.getElementsByTagName("head")[0], done = false, script = document.createElement("script");
        script.src = url;

        script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                done = true;
                if (callback && typeof ("callback") === "function") {
                    callback();
                }
            }
        }

        head.appendChild(script);
    },
    fetch: function () {
        var self = this;

        if (typeof (twttr) !== 'undefined') {
            twttr.widgets.load();
        } else {
            self.getScript('//platform.twitter.com/widgets.js');
        }

        if (typeof (FB) !== 'undefined') {
            FB.init({ status: true, cookie: true, xfbml: true, oauth: true });
        } else {
            self.getScript("//connect.facebook.net/pt_BR/all.js#xfbml=1", function () {
                FB.init({ status: true, cookie: true, xfbml: true, oauth: true });
            });
        }

        if (typeof (gapi) !== 'undefined') {
            var matches = document.body.querySelectorAll('.g-plusone'), index = 0, length = matches.length;
            while (index += 1 < length) {
                gapi.plusone.go();
            }
        } else {
            self.getScript('//apis.google.com/js/plusone.js');
        }
    }
}

var brasilgram = (function () {
    var module = {
        limit: 50,
        curLocation: window.location.hash,
        setGrid: function(){
            $('#ri-grid').gridrotator({
                rows: 4,
                columns: 8,
                maxStep: 2,
                interval: 2000,
                preventClick: false,
                w1024: {
                    rows: 5,
                    columns: 6
                },
                w768: {
                    rows: 5,
                    columns: 5
                },
                w480: {
                    rows: 6,
                    columns: 4
                },
                w320: {
                    rows: 7,
                    columns: 4
                },
                w240: {
                    rows: 7,
                    columns: 3
                },
            });
        },
        getHash: function (url) {
            return url.replace('#','');
        },
        imgUrl: function (location, limit) {
            return 'https://api.instagram.com/v1/tags/'+ location +'/media/recent?client_id=be52cb013dda4c47a03cdd5689896c37&count='+ limit +'&callback=?';
        },
        default: function () {
            var cleanLocation = module.getHash(module.curLocation);
            if (cleanLocation == '') {
                module.curLocation = 'brasil';
            }

            if (!Browser.m) {
                Social.init();
            }
        },
        events: function () {
            var menu = $('#open-menu'),
                states = $('#states'),
                links = states.find('a');
            
            menu.click(function (e) {
                e.preventDefault();
                states.slideToggle();
            });

            links.click(function(e) {
                e.preventDefault();
                var loc = this.href,
                    hash = loc.split('#')[1];

                states.slideToggle();
                $('#instagram').remove();

                module.setup(module.imgUrl(hash, module.limit));
            });
        },
        loadImages: function () {
            var cleanLocation = module.getHash(module.curLocation);
            
            module.setup(module.imgUrl(cleanLocation, module.limit));
        },
        template: function (url, photo) {
            return '<li><a href="' + url + '" target="_blank"><img src="' + photo + '" /></a></li>';
        },
        setup: function (url) {
            var grid = $('#ri-grid'), 
                instagram = $('<ul/>', {
                id: 'instagram',
                class: 'cf'
            }).appendTo(grid);

            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                cache: false,
                url: url
            }).then(function(resp) {
                if (resp.meta.code == '200') {
                    var data = resp.data, i, len;

                    for (i = 0, len = data.length; i < len; i += 1 ) {
                        var photo = data[i].images.low_resolution.url,
                            url = data[i].link;

                        $(instagram).append(module.template(url, photo));
                    }

                    module.setGrid();
                } else {
                    throw new Error ('A API do instagram está indisponível');
                }
            });
        },
        init: function () {
            module.default();
            module.events();
            module.loadImages();
        }
    };

    return {
        init: module.init
    };

}());