(function($) {

	var defaults = {
		container: 'body',
		language: 'cn',
		mode: 'single'
	};

	var _html = '<div id="calendar" class="cal-style">'
            		+ '<div class="cal-header">'
                		+ '<div class="cal-info">'
                    		+ '<span class="prev"><span class="prev-icon"></span></span>'
                    		+ '<span class="cal-year-month">2014年6月</span>'
                    		+ '<span class="next"><span class="next-icon"></span></span>'
                		+ '</div>'
                		+ '<div class="cal-weeks"></div>'
            		+ '</div>'
            		+ '<div class="cal-body"></div>'
            		+ '<div class="cal-footer"></div>'
        		+ '</div>';

    var weeks = {
    	enShort: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    	cnShort: ['一', '二', '三', '四', '五', '六', '七'],
    	enLong: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    	cnLong: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    };

    /**
     * render the calendar
     */
    var render = function(options) {
    	var container = options.container,
    		language = options.language;
        $(container).html($(_html));
        
        // render weeks
        var weeksPanel = $('#calendar').find('.cal-weeks'),
        	weeksData = weeks[language + 'Short'];
        weeksData.forEach(function(d) {
        	var perDay = $('<span class="cal-day"></span>');
        	weeksPanel.append(perDay.text(d));
        });

        // render dates
        var datesPanel = $('#calendar').find('.cal-body');
        for (var i = 1; i <= 5; i++) {
        	var perWeek = $('<div class="cal-per-week"></div>');
        	for (var j = (i - 1) * 7 + 1; j <= i * 7 && j <= 31; j++) {
        		var perDate = $('<span class="cal-per-date"></span>');
        		perDate.text(j);
        		perWeek.append(perDate);
        	}
        	datesPanel.append(perWeek);
        }
    };

    var getFirstDayInMonth = function(date) {
    	var temp = new Date(date);
    	temp.setDate(0);
    	return temp.getDay() + 1;
    };

    var getDatesInMonth = function(date) {
    	var currMonth = date.getMonth() + 1,
    		dateOfNextMonth = new Date(date);
    		dateOfNextMonth.setMonth(currMonth);
    	return parseInt((dateOfNextMonth.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    };

    $.fn.calendar = function(options) {
        var settings = $.extend(defaults, options);
        render(settings);
    };
 })(jQuery);
