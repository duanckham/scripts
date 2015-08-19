!function() {
    if (location.hostname !== 'paimai.jd.com') return;

    var hello = 10;
    var timer;
    var limitPrice = 0;
    var optimalPrice = 0;
    var username = $('#userinfo').val();
    var me = '****' + username.substr(username.length - 4, 4);

    var thingID = location.pathname.substr(1);
    var thingAPI = 'http://paimai.jd.com/services/englishCurrent.action?paimaiId=' + thingID;

    var kill = function(price) {
        $('#bidPrice').val(price);
        bid();
    };

    var looper = function(done) {
        return function() {
            $.get(thingAPI, function(r) {
                r = r.replace('null(', '').replace(')', '');
                r = JSON.parse(r);
                done(r);
            });
        };
    };

    var killer = function() {
        var k = setInterval(looper(function(data) {
            var currentPrice = parseInt(data.currentPrice);
            var remainTime = parseInt(data.remainTime);
            var optimalPrice = currentPrice + 50;
            
            window.currentPrice = currentPrice;

            // OVER
            if (remainTime === -1) {
                clearInterval(k);
                return alert('Done.');
            }

            if (currentPrice > limitPrice) {
                clearInterval(k);
                return alert('Forget it.');
            }

            // KILL
            if (data.bidRecords.length && data.bidRecords[0].username !== me) {
                kill(Math.min(optimalPrice, limitPrice));
            }
        }), 500);
    };

    var processer = function(data) {
        var currentPrice = parseInt(data.currentPrice);
        var remainTime = parseInt(data.remainTime / 1000);
        var optimalPrice = currentPrice + 50;

        console.log('RemainTime', remainTime, 's, Current Price', currentPrice, 'RMB, Optimal Price', optimalPrice, 'RMB');
        
        window.currentPrice = currentPrice;

        if (currentPrice > limitPrice) {
            clearInterval(timer);
            alert('Forget it.');
            return;
        }

        if (remainTime < 3) {
            clearInterval(timer);
            killer();
        }
    };

    $(document).keydown(function(e) {
        if (hello === 0) return;
        if (e.keyCode === 65) hello--;
        if (hello === 0) {
            limitPrice = parseInt(prompt('Proce Limit', ''));
            timer = setInterval(looper(processer), 1000);
        }
    });
}(window);
