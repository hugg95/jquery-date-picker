/**
 * A customizable date picker based on jQuery.
 * @author Victor Li lncwwn@gmail.com
 * @version 1.0
 * Released under terms of the MIT lincense.
 */

(function($) {

    // default setting
	var defaults = {
		container: 'body',
		language: 'cn', // ['cn', 'en']
		mode: 'single', // ['single', 'range']
        weekStart: '7', // [1, 2, 3, 4, 5, 6]
        theme: 'normal',
	};

    // the html structure of date-picker
    var structure = {
        container: '',
        picker: '',
        header: '',
        body: '',
        footer: ''
    };

    structure.container = '<div id="jq-date-picker" class="cal-style"></div>';
    structure.picker = '<div class="per-picker"></div>';
    structure.header = '<div class="cal-header">' +
                            '<div class="cal-info">' +
                                '<span class="prev"><span class="prev-icon"></span></span>' +
                                '<span class="cal-year-month"></span>' +
                                '<span class="next"><span class="next-icon"></span></span>' +
                            '</div>' +
                            '<div class="cal-weeks"></div>' +
                        '</div>';
    structure.body = '<div class="cal-body"></div>';
    structure.footer = '<div class="cal-footer"></div>';

	/*var _html = '<div id="jq-date-picker" class="cal-style">'
                    + '<div class="per-picker">'
            		    + '<div class="cal-header">'
                		    + '<div class="cal-info">'
                    		    + '<span class="prev"><span class="prev-icon"></span></span>'
                    		    + '<span class="cal-year-month"></span>'
                    		    + '<span class="next"><span class="next-icon"></span></span>'
                		    + '</div>'
                		    + '<div class="cal-weeks"></div>'
            		    + '</div>'
            		    + '<div class="cal-body"></div>'
            		    + '<div class="cal-footer"></div>'
                    + '</div>'
        		+ '</div>';*/

    var weeks = {
    	enShort: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    	cnShort: ['一', '二', '三', '四', '五', '六', '日'],
    	enLong: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    	cnLong: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    };

    // Sets the default current date is now
    var current = new Date(),
    	currYear = current.getFullYear(),
    	currMonth = current.getMonth() + 1,
    	currDate = current.getDate();

    /**
     * Render the calendar
     */
    var init = function() {
        // set options for global use
        var options = $.fn.calendar.settings,
    	    container = options.container,
            mode = options.mode,
    		language = options.language;
        var pickersNum = 1;
        switch (mode) {
            case 'single': pickersNum = 1; break;
            case 'range': pickersNum = 2; break;
            default: pickersNum = 1; break;
        }

        var structure = assembleStructure(pickersNum);
        $(container).html(structure);

        // render weeks
        /*var weeksPanel = $('#jq-date-picker').find('.cal-weeks'),
        	weeksData = weeks[language + 'Short'];
        weeksData.forEach(function(d) {
        	var perDay = $('<span class="cal-day"></span>');
        	weeksPanel.append(perDay.text(d));
        });*/
        for (var i = 0; i < pickersNum; i++) {
           renderWeeks(i);
        }

        // render some cells to show date
        /*var datesPanel = $('#jq-date-picker').find('.cal-body');
        for (var i = 1; i <= 5; i++) {
        	var perWeek = $('<div class="cal-per-week"></div>');
        	for (var j = (i - 1) * 7 + 1; j <= i * 7; j++) {
        		var perDate = $('<span class="cal-per-date"></span>');
        		perWeek.append(perDate);
        	}
        	datesPanel.append(perWeek);
        }*/
        for (var i = 0; i < pickersNum; i++) {
            for (var j = 0; j < 4; j++) {
                createSingleContainer(i);
            }
        }
        //for (var i = 0; i < 4; i++) {
        //    createSingleContainer();
        //}
    };

    /**
     * Assemble the structure of date-picker
     * @param num how many date-pickers will be generated
     */
    var assembleStructure = function(num) {
        var container = $(structure.container),
            picker = $(structure.picker),
            header = $(structure.header),
            body = $(structure.body),
            footer = $(structure.footer);

        picker.append(header).append(body).append(footer);

        if (!num) var num = 1;
        for (var i = 0; i < num; i++) {
            var picker = picker.attr('id', 'picker-' + i);
            container.append(picker.clone());
        }

        return container;
    };

    /**
     * Creates a single line of container for fill every seven dates
     * @param pickerId id of picker instance
     */
    var createSingleContainer = function(pickerId) {
        var panel = $('#jq-date-picker').find('#picker-' + pickerId).find('.cal-body'),
            container = $('<div class="cal-per-week"></div>');
        for (var i = 0; i < 7; i++) {
            var perDate = $('<span class="cal-per-date"></span>');
            container.append(perDate);
        }
        panel.append(container);
    };

    /**
     * Render weeks
     * @param pickerId  id of per picker instance
     */
    var renderWeeks = function(pickerId) {
        var options = $.fn.calendar.settings;
        // gets language and week-start
        var  language = options.language,
             weekStart = options.weekStart;

        var panel = $('#jq-date-picker').find('#picker-' + pickerId).find('.cal-weeks'),
            weeksData = weeks[language + 'Short'];
        weekStart--;

        var firstDay = $('<span class="cal-day"></span>');
        $(panel[0]).append(firstDay.text(weeksData[weekStart]));
        for (var i = 1; i < weeks[language + 'Short'].length - weekStart; i++) {
            var perDay = $('<span class="cal-day"></span>');
            panel.append(perDay.text(weeks[language + 'Short'][i + weekStart]));
        }
        for (var i = 0; i < weekStart; i++) {
            var perDay = $('<span class="cal-day"></span>');
            panel.append(perDay.text(weeks[language + 'Short'][i]));
        }
    };

    /**
     * Sets current year and month for calendar
     * @param pickerId id of per picker instance
     */
    var renderYearMonth = function(pickerId) {
        var yearAndMonth = format.call(current);
        $('.cal-year-month').text(yearAndMonth);
    };

    /**
     * Fills cells with dates
     */
    var renderCells = function() {
        var options = $.fn.calendar.settings,
            cells = $('.cal-per-date');
        cells.text('').removeClass('has-date');
    	var firstDayInMonth = getFirstDayInMonth(current),
    		datesInMonth = getDatesInMonth(current);

        var weekStart = options.weekStart;
        var firstDate;
        if (firstDayInMonth < weekStart) {
            firstDate = firstDayInMonth - weekStart + 7;
        } else {
            firstDate = firstDayInMonth - weekStart
        }

    	var firstFillCells = $('.cal-per-date:eq(' + firstDate + '), .cal-per-date:gt(' + firstDate + ')'),
            last,
            curr = new Date(current);
    	for (var i = 1; i <= datesInMonth; i++) {
            if (firstFillCells[i - 1]) {
                curr.setDate(i);
                var dataDate = format.call(curr);
                $(firstFillCells[i - 1]).text(i).addClass('has-date').attr('data-date', dataDate);
                last = i;
            }
    	}

        var lastCellIndex = cells.index($('.cal-per-date:last'));

        // render the rest dates
        if (last < datesInMonth) {
            var times = datesInMonth - last > 7 ? 2 : 1;
            for (var i = 0; i < times; i++) {
                createSingleContainer();
            }
            var lastFillCells = $('.cal-per-date:gt(' + lastCellIndex + ')');
            var rest = datesInMonth - last;
            for (var i = 0; i < rest; i++) {
                if (lastFillCells[i]) {
                    curr.setDate(last + i + 1);
                    var dataDate = format.call(curr);
                    $(lastFillCells[i]).text(last + i + 1).addClass('has-date').attr('data-date', dataDate);
                }
            }
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

    /**
     * Go to the next month
     */
    var nextMonth = function() {
        if (currMonth < 12) {
            currMonth++;
        } else {
            currMonth = 1;
            currYear++;
        }
        current.setFullYear(currYear);
        current.setMonth(currMonth - 1);
    };

    /**
     * Go to the previous month
     */
    var prevMonth = function() {
        if (currMonth > 1) {
            currMonth--;
        } else {
            currMonth = 12;
            currYear--;
        }
        current.setFullYear(currYear);
        current.setMonth(currMonth - 1);
    };

    var format = function(format) {
    	if (!this instanceof Date) {
    		return;
    	}

        var o = {
            y: this.getFullYear(),
            m: this.getMonth() + 1,
            d: this.getDate(),
            hh: this.getHours(),
            mm: this.getMinutes(),
            ss: this.getSeconds()
        };

    	var formatted;

    	switch (format) {
    		case 'yyyy/mm/dd':
                formatted = o.y + '/' + o.m + '/' + o.d;
                break;
            case 'yyyy-mm-dd':
                formatted = o.y + '-' + o.m + '-' + o.d;
                break;
            case 'yyyy/mm/dd hh:mm:ss':
                formatted = o.y + '/' + o.m + '/' + o.d + ' ' + o.hh + ':' + o.mm + ':' + o.ss;
                break;
            case 'yyyy-mm-dd hh:mm:ss':
                formatted = o.y + '/' + o.m + '/' + o.d + ' ' + o.hh + ':' + o.mm + ':' + o.ss;
                break;
            case 'hh:mm:ss':
                 formatted = o.hh + ':' + o.mm + ':' + o.ss;
                 break;
             default:
                 formatted = o.y + '/' + o.m + '/' + o.d;
                 break;
    	}
        return formatted;

    };

    var addListener = function(target, event, fn) {
        $('body').on(event, target, function() {
            if (typeof fn === 'function') {
                fn();
            }
        });
    };

    var events = [
        {
            t: '.next',
            e: 'click',
            f: function() {
                nextMonth();
                init();
                renderYearMonth();
                renderCells();
            }
        },
        {
            t: '.prev',
            e: 'click',
            f: function() {
                prevMonth();
                init();
                renderYearMonth();
                renderCells();
            }
        }
    ];

    for (var i = 0; i < events.length; i++) {
        addListener(events[i].t, events[i].e, events[i].f);
    }

    $.fn.calendar = function(options) {
        $.fn.calendar.settings = $.extend(defaults, options);
        init();
        renderYearMonth();
        renderCells();
    };

 })(jQuery);

