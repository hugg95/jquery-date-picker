/**
 * A customizable date picker based on jQuery.
 * @author Victor Li lncwwn@gmail.com
 * @version 0.1
 * Released under terms of the MIT lincense.
 */

(function($) {

    // default setting
	var defaults = {
		container: 'body',
		language: 'cn', // ['cn', 'en']
		mode: 'single', // ['single', 'range']
        weekStart: 7,   // [1, 2, 3, 4, 5, 6]
        format: '',
        prefix: '',
        theme: 'normal'
	};

    // the html structure of date-picker
    var structure = {
        container: '',
        picker: '',
        header: '',
        body: '',
        footer: ''
    };

    // container's default id is 'jq-date-picker'
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

    var weeks = {
    	enShort: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    	cnShort: ['一', '二', '三', '四', '五', '六', '日'],
    	enLong: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    	cnLong: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    };

    // default pickers count is 1, language is English, container is 'body' element
    var pickersNum = 1,
        language = 'en',
        container = 'body',
        weekStart = 1,
        prefix = '',
        format = '',
        date = [];

    /**
     * generates dates for each date-picker
     */
    var generateDates = function() {
        var curr =  new Date(),
            currYear = curr.getFullYear(),
            currMonth = curr.getMonth() + 1,
            currDate = curr.getDate();

        date.push({curr: curr, currYear: currYear, currMonth: currMonth, currDate: currDate});

        for (var i = 1; i < pickersNum; i++) {
            var next = new Date(),
                nextYear = currYear,
                nextMonth = currMonth + i,
                nextDate = currDate;
            nextYear = nextMonth > 12 ? nextYear + 1 : nextYear;
            nextMonth = nextMonth > 12 ? nextMonth - 12 : nextMonth;
            next.setFullYear(nextYear);
            next.setMonth(nextMonth - 1);
            next.setDate(nextDate);

            date.push({curr: next, currYear: nextYear, currMonth: nextMonth, currDate: nextDate});
        }

    };

    /**
     * parse calendar's setting
     */
    var parseSetting = function() {
        var __setting = $.fn.calendar.settings,
            __container = __setting.container,
            __mode = __setting.mode,
            __language = __setting.language;

        switch (__mode) {
            case 'single': pickersNum = 1; break;
            case 'range': pickersNum = 2; break;
            default: pickersNum = 1; break;
        }

        switch (__language) {
            case 'cn': language = 'cn'; break;
            case 'en': language = 'en'; break;
            default: language = 'en'; break;
        }

        weekStart = __setting.weekStart;
        prefix = __setting.prefix;
        format = __setting.format;
        container = __container ? __container : container;
    };

    /**
     * after the initial operation, the whole date-picker will be available
     */
    var init = function() {

        parseSetting();
        generateDates();
        renderStructure();

        for (var i = 0; i < pickersNum; i++) {
            renderYearMonth();
            renderWeeks(i);
            for (var j = 0; j < 4; j++) {
                createSingleContainer(i);
            }
            renderCells(i);
        }
    };

    /**
     * assemble the structure of date-picker
     * @param num how many date-pickers will be generated
     */
    var assembleStructure = function(num) {
        var container = $(structure.container),
            picker = $(structure.picker),
            header = $(structure.header),
            body = $(structure.body),
            footer = $(structure.footer);

        picker.append(header).append(body).append(footer);

        if (!num) num = 1;
        for (var i = 0; i < num; i++) {
            var picker = picker.attr('id', 'picker-' + i).attr('data-id', i);
            container.append(picker.clone());
        }

        if (prefix) {
            container.attr('id', prefix + '-date-picker');
        }

        return container;
    };

    /**
     * render the structure of date-picker
     */
    var renderStructure = function() {
        $(container).html(assembleStructure(pickersNum));
    };

    /**
     * Creates a single line of container for fill every seven dates
     * @param pickerId id of picker instance
     */
    var createSingleContainer = function(pickerId) {
        var id = prefix ? prefix + '-date-picker' : 'jq-date-picker',
            panel = $('#' + id).find('#picker-' + pickerId).find('.cal-body'),
            container = $('<div class="cal-per-week"></div>');
        for (var i = 0; i < 7; i++) {
            var perDate = $('<span class="cal-per-date"></span>');
            container.append(perDate);
        }
        panel.append(container);
    };

    /**
     * render weeks
     * @param pickerId  id of per picker instance
     */
    var renderWeeks = function(pickerId) {
        var __weekStart = weekStart,
            id = prefix ? prefix + '-date-picker' : 'jq-date-picker',
            panel = $('#' + id).find('#picker-' + pickerId).find('.cal-weeks'),
            weeksData = weeks[language + 'Short'];
        __weekStart--;

        var firstDay = $('<span class="cal-day"></span>');
        $(panel[0]).append(firstDay.text(weeksData[__weekStart]));
        for (var i = 1; i < weeks[language + 'Short'].length - __weekStart; i++) {
            var perDay = $('<span class="cal-day"></span>');
            panel.append(perDay.text(weeks[language + 'Short'][i + __weekStart]));
        }
        for (var i = 0; i < __weekStart; i++) {
            var perDay = $('<span class="cal-day"></span>');
            panel.append(perDay.text(weeks[language + 'Short'][i]));
        }
    };

    /**
     * sets current year and month for each date-picker
     * @param pickerId id of per picker instance
     */
    var renderYearMonth = function(pickerId) {
        if (typeof pickerId === 'undefined') {
            for (var i = 0; i < pickersNum; i++) {
                var yearMonth = formatDate.call(date[i].curr, format);
                $('#picker-' + i).find('.cal-year-month').text(yearMonth);
            }
        } else {
            var yearMonth = formatDate.call(date[pickerId].curr, format);
            $('#picker-' + pickerId).find('.cal-year-month').text(yearMonth);
        }
    };

    /**
     * fills cells with dates for each date-picker
     * @param pickerId id of per picker instance
     */
    var renderCells = function(pickerId) {
        var __weekStart = weekStart,
            cells = $('#picker-' + pickerId).find('.cal-per-date');
        cells.text('').removeClass('has-date');
    	var firstDayOfMonth = getFirstDayOfMonth(date[pickerId].curr),
    		datesOfMonth = getDatesOfMonth(date[pickerId].curr);

        var firstDate;
        if (firstDayOfMonth < __weekStart) {
            firstDate = firstDayOfMonth - weekStart + 7;
        } else {
            firstDate = firstDayOfMonth - weekStart
        }

    	var firstFillCells = $('#picker-' + pickerId).find('.cal-per-date:eq(' + firstDate + '), .cal-per-date:gt(' + firstDate + ')'),
            last,
            curr = new Date(date[pickerId].curr);
    	for (var i = 1; i <= datesOfMonth; i++) {
            if (firstFillCells[i - 1]) {
                curr.setDate(i);
                var dataDate = formatDate.call(curr, format);
                $(firstFillCells[i - 1]).text(i).addClass('has-date').attr('data-date', dataDate);
                last = i;
            }
    	}

        var lastCellIndex = cells.index($('.cal-per-date:last'));

        // render the rest dates
        if (last < datesOfMonth) {
            var times = datesOfMonth - last > 7 ? 2 : 1;
            for (var i = 0; i < times; i++) {
                createSingleContainer(pickerId);
            }
            var lastFillCells = $('#picker-' + pickerId).find('.cal-per-date:gt(' + lastCellIndex + ')');
            var rest = datesOfMonth - last;
            for (var i = 0; i < rest; i++) {
                if (lastFillCells[i]) {
                    curr.setDate(last + i + 1);
                    var dataDate = formatDate.call(curr, format);
                    $(lastFillCells[i]).text(last + i + 1).addClass('has-date').attr('data-date', dataDate);
                }
            }
        }
    };

    var getFirstDayOfMonth = function(date) {
    	var temp = new Date(date);
    	temp.setDate(0);
    	return temp.getDay() + 1;
    };

    var getDatesOfMonth = function(date) {
    	var currMonth = date.getMonth() + 1,
    		dateOfNextMonth = new Date(date);
    		dateOfNextMonth.setMonth(currMonth);
    	return parseInt((dateOfNextMonth.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    };

    /**
     * Go to the next month
     */
    var nextMonth = function(pickerId) {
        var i = pickerId;
        if (date[i].currMonth < 12) {
            date[i].currMonth++;
        } else {
            date[i].currMonth = 1;
            date[i].currYear++;
        }
        date[i].curr.setFullYear(date[i].currYear);
        date[i].curr.setMonth(date[i].currMonth - 1);
    };

    /**
     * Go to the previous month
     */
    var prevMonth = function(pickerId) {
        var i = pickerId;
        if (date[i].currMonth > 1) {
            date[i].currMonth--;
        } else {
            date[i].currMonth = 12;
            date[i].currYear--;
        }
        date[i].curr.setFullYear(date[i].currYear);
        date[i].curr.setMonth(date[i].currMonth - 1);
    };

    /**
     * format date
     * @param format date format
     */
    var formatDate = function(format) {
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
        var seperator = {
            en: {slash: '/', dash: '-', colon: ':'},
            ch: {y: '年', m: '月', d: '日', h: '时', m: '分', s: '秒'}
        };

        if (!format) {
            if (language) {
                
            }
        }

    	var formatted;

    	switch (format) {
    		case 'yyyy/mm/dd':
                formatted = o.y + '/' + o.m + '/' + o.d; break;
            case 'yyyy-mm-dd':
                formatted = o.y + '-' + o.m + '-' + o.d; break;
            case 'yyyy/mm/dd hh:mm:ss':
                formatted = o.y + '/' + o.m + '/' + o.d + ' ' + o.hh + ':' + o.mm + ':' + o.ss; break;
            case 'yyyy-mm-dd hh:mm:ss':
                formatted = o.y + '/' + o.m + '/' + o.d + ' ' + o.hh + ':' + o.mm + ':' + o.ss; break;
            case 'hh:mm:ss':
                 formatted = o.hh + ':' + o.mm + ':' + o.ss; break;
            default:
                 formatted = o.y + '/' + o.m + '/' + o.d; break;
    	}

        return formatted;

    };

    var addListener = function(target, event, fn) {
        $('body').on(event, target, function() {
            if (typeof fn === 'function') {
                var that = this;
                fn(that);
            }
        });
    };

    // events array of calendar
    var events = [
        {
            t: '.next',
            e: 'click',
            f: function(target) {
                var id = $(target).closest('.per-picker').attr('data-id');
                nextMonth(id);
                renderYearMonth(id);
                renderCells(id);
            }
        },
        {
            t: '.prev',
            e: 'click',
            f: function(target) {
                var id = $(target).closest('.per-picker').attr('data-id');
                prevMonth(id);
                renderYearMonth(id);
                renderCells(id);
            }
        }
    ];

    $.fn.calendar = function(options) {
        $.fn.calendar.settings = $.extend(defaults, options);
        init();

        for (var i = 0; i < events.length; i++) {
            addListener(events[i].t, events[i].e, events[i].f);
        }
    };

 })(jQuery);

