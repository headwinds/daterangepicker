// credits 
// http://foxrunsoftware.github.io/DatePicker/
// http://www.dangrossman.info/2012/08/20/a-date-range-picker-for-twitter-bootstrap/

$(document).ready(function() {


	var init = function(){

		$("#compareGroup").hide();
	};

	init();

	// VARIABLES
	
	/*
	requirements phase 1:

	Base
	i) Last Week 
	ii) Last Month 
	iii) Last 3 month 

	Compare 
	1) Previous Period 
	2) Custom Range

	*/


	// todayRange = [moment(), moment()];
	// yesterdayRange = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
	var last7DaysRange = [moment().subtract(6, 'days'), moment()];
	var last30DaysRange = [moment().subtract(29, 'days'), moment()];
	var last90DaysRange = [moment().subtract(89, 'days'), moment()];
	// thisMonthRange = [moment().startOf('month'), moment().endOf('month')];
	// lastMonthRange = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];
	// last3MonthsRange =
	// last6MonthsRange =
	// lastYearRange = 

	var previousPeriod7DaysRange = [moment().subtract(6, 'days'), moment().subtract(12, 'days')];
	var previousPeriod30DaysRange = [moment().subtract(29, 'days'), moment().subtract(58, 'days')];
	var previousPeriod90DaysRange = [moment().subtract(89, 'days'), moment().subtract(178, 'days')];


	var baseRanges = [
	     { label: 'Last 7 Days', range: last7DaysRange, id: 0},
	     { label: 'Last 30 Days', range: last30DaysRange, id: 1},
	     { label: 'Last 90 Days', range: last90DaysRange, id: 2}
    ]; 

    var previousRanges = [
	     { label: 'Previous Last 7 Days', range: previousPeriod7DaysRange, id: 0},
	     { label: 'Previous Last 30 Days', range: previousPeriod30DaysRange, id: 1},
	     { label: 'Previous Last 90 Days', range: previousPeriod90DaysRange, id: 2}
    ]; 

   
    var defaultRange = baseRanges[0].range;
    var curRange = defaultRange;

    var previousRange = previousRanges[0].range; 


	// BASE INPUT RANGE 

	var baseTo = new Date();
	var baseFrom = new Date(baseTo.getTime() - 1000 * 60 * 60 * 24 * 14);

	var baseRangeStr = "Base: ";

	 //$('#inputBaseStartDate').DatePickerSetDate($('#inputBaseStartDate').val(), true);

	 $("#baseSelect").on("change", function(e){
	 	
	 	var idNum = Number(e.target.value);
	 	
	 	//console.log(e, "base select - idNum: " + idNum);
	 	curRange = baseRanges[idNum].range;
	 	previousRange = previousRanges[idNum].range;

	 	if (!bCompareChecked) {
	 		
	 		setCalendarsByCurBaseRange(); 
	 	} else {

	 		setCalendarsByPreviousCompareRange();
	 	}

	 });


	 /////////////////////////////////////////// EVENTS


	 var setupEvents = function(){

	 	$("#inputBaseStartDate").on("focus", function(){
	 		console.log("focus");
	 	});

	 	$("#inputBaseStartDate").on("blur", function(){
			console.log("blur");

	 	});

	 	//$("#inputBaseStartDate")

	 }

	 /////////////////////////////////////////// VALIDATION

	 var validateDate = function( newDateStr ) {

	 	var dateArray = newDateStr.trim().split("/");

	 	var dayNum = Number( dateArray[0] );
	 	var monthNum = Number( dateArray[1] );
	 	var yearNum = Number( dateArray[2] ); 

	 	var testDate = moment();
		
		var testDate = testDate.day( dayNum ); 
		var testDate = testDate.month( monthNum ); 
		var testDate = testDate.year( yearNum ); 	
			
	 };
        
     setupEvents();

	// 3 CALENDARS 


	var to = new Date();
	var from = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 14);


	var calendars = $('#datepicker-calendar').DatePicker({
		  inline: true,
		  date: [from, to],
		  calendars: 3,
		  mode: 'range',
		  current: new Date(to.getFullYear(), to.getMonth() - 1, 1),
		  onChange: function(dates,el) {
		     
		   	  // BASE RANGE - START & END 

		      var baseNumStartDateStr = dates[0].getDate() + "/" + dates[0].getMonth() + "/" + dates[0].getFullYear();
		      var baseNumEndDateStr = dates[1].getDate() + "/" + dates[1].getMonth() + "/" + dates[1].getFullYear();

		      $("#inputBaseStartDate").val(baseNumStartDateStr);
		      $("#inputBaseEndDate").val(baseNumEndDateStr);

		      var baseStartDateStr = dates[0].getDate()+' '+dates[0].getMonthName(true)+', '+ dates[0].getFullYear();
		      var baseEndDateStr = dates[1].getDate()+' '+dates[1].getMonthName(true)+', '+ dates[1].getFullYear();

		      var baseRangeStr = "Base: " + baseStartDateStr + ' - ' + baseEndDateStr;

		      $("#baseRange").text( baseRangeStr ) 

			}
	});

	// COMPARE INPUT RANGE 

	var bCompareChecked = false;

	$("#inputCompareCheckbox").on("change", function(e) {
		console.log(e.currentTarget.checked);

		if ( e.currentTarget.checked ) {
			setCalendarsByPreviousCompareRange();
			$("#compareGroup").fadeIn();
		} else {
			setCalendarsByCurBaseRange();
			$("#compareGroup").fadeOut();
		}

		bCompareChecked = !bCompareChecked; 
	});

	$("#compareSelect").on("change", function(e){
		console.log(e, "compare select");

		var idNum = Number(e.target.value);

		if ( e.target.value === 0) {
		 	//previousRange = previousRanges[idNum].range;
		 	setCalendarsByPreviousCompareRange(); 
	 	}

	 });

	var setCalendarsByCurBaseRange = function() {

		console.log(calendars, " setCalendarsByCurBaseRange ");

		var dates = [ curRange[0]._d, curRange[1]._d ];  

		var baseNumStartDateStr = dates[0].getDate() + "/" + dates[0].getMonth() + "/" + dates[0].getFullYear();
	    var baseNumEndDateStr = dates[1].getDate() + "/" + dates[1].getMonth() + "/" + dates[1].getFullYear();

	    $("#inputBaseStartDate").val(baseNumStartDateStr);
	    $("#inputBaseEndDate").val(baseNumEndDateStr);
  
        var baseStartDateStr = dates[0].getDate()+' '+ curRange[0].format("MMM") +', '+ dates[0].getFullYear();
        var baseEndDateStr = dates[1].getDate()+' '+ curRange[1].format("MMM") +', '+ dates[1].getFullYear();
        
        baseRangeStr = "Base: " + baseStartDateStr + ' - ' + baseEndDateStr;
 	 
 	    $("#baseRange").text( baseRangeStr ); 

 	    calendars.DatePickerSetDate([ dates[0], dates[1] ], true);

	}

	var setCalendarsByPreviousCompareRange = function() {

		console.log(previousRange, " setCalendarsByPreviousCompareRange ");

		var baseDates = [ curRange[0]._d, curRange[1]._d ]; 

		var dates = [ previousRange[0]._d, previousRange[1]._d ];  

		var compareNumStartDateStr = dates[0].getDate() + "/" + dates[0].getMonth() + "/" + dates[0].getFullYear();
	    var compareNumEndDateStr = dates[1].getDate() + "/" + dates[1].getMonth() + "/" + dates[1].getFullYear();

	    $("#inputCompareStartDate").val(compareNumStartDateStr);
	    $("#inputCompareEndDate").val(compareNumEndDateStr);
  
        var baseStartDateStr = dates[0].getDate()+' '+ curRange[0].format("MMM") +', '+ dates[0].getFullYear();
        var baseEndDateStr = dates[1].getDate()+' '+ curRange[1].format("MMM") +', '+ dates[1].getFullYear();
       
 	 	var compareRangeStr = baseRangeStr + " to " + baseStartDateStr + " - " + baseEndDateStr;

 	    $("#baseRange").text( compareRangeStr ); 

 	    //calendars.date( baseDates[0], baseDates[1], dates[0], dates[1] );

 	    // calendars.DatePicker( { date: [ dates[0], dates[1] ] }); 
 	    calendars.DatePickerSetDate([ baseDates[0], baseDates[1], dates[0], dates[1] ], true)

	}

	setCalendarsByCurBaseRange();

	// APPLY & CANCEL 

	$("#applyDates").on("click", function(){

	}); 

	$("#cancelDates").on("click", function(){

	}); 

});