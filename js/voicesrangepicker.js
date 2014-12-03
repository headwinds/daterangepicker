// credits 
// http://foxrunsoftware.github.io/DatePicker/
// http://www.dangrossman.info/2012/08/20/a-date-range-picker-for-twitter-bootstrap/

window.drp = {};

$(document).ready(function() {


	//////////////////////////////////////////// VARIABLES

	var currentFocusId = null;
	var prevFocusId = null;
	var baseStartMoment = null;
	var baseEndMoment = null; 

	var bCompareChecked = false;
	
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

	/////////////////////////////////////////// INIT

	var init = function(){

		$("#compareGroup").hide();
	
		setValidMessage();

		// focus on the first base bate
		setCurrentFocus("inputBaseEndDate");

		$("#testsContainer").hide();

		setupEvents();
		
	};

	

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

	 /////////////////////////////////////////// GETTERS & SETTERS

	 var setCurrentFocus = function( inputId ) {

		currentFocusId = inputId;

		console.log("current focus: " + currentFocusId);

		
	 	var curInputEl = $("#" + currentFocusId);
	 	
	 	// ...then focus here
	 	var el = $("#" + currentFocusId).get(0);
	    var elemLen = el.value.length;

	    el.selectionStart = elemLen;
	    el.selectionEnd = elemLen;
	    el.focus();
	    el.setSelectionRange(0,elemLen);

	    // 

	    if ( null !== prevFocusId ) {
	    	
	    	var prevInputEl = $("#" + prevFocusId);
	   		prevInputEl.removeClass("baseRangeSelected");
	   	}

	    curInputEl.addClass("baseRangeSelected"); 

	    prevFocusId = currentFocusId;


	 }

	 var setErrorMessage = function( messageStr ){

	 	messageStr = (typeof messageStr !== "undefined") ? messageStr : "Valid Base Range: start date occurs before end date";

	 	$("#validationMessage").text(messageStr);
	 }

	 var setValidMessage = function( messageStr ){

	 	messageStr = (typeof messageStr !== "undefined") ? messageStr : "Valid Base Range: start date occurs before end date";

	 	$("#validationMessage").text(messageStr);
	 }

	 var setBaseDate = function( startDate, endDate, posStr ){

	 	console.log(arguments, " setBaseDate ");

	 	var baseDate = (posStr === "Start") ? startDate : endDate; 

		var baseNumDateStr = baseDate.getDate() + "/" + baseDate.getMonth() + "/" + baseDate.getFullYear();
	    $("#inputBase" + posStr + "Date").val(baseNumDateStr);
	    
	 }

	 var setCompareDate = function( startDate, endDate, posStr ){

		console.log(arguments, " setCompareDate ");

	 	var compareDate = (posStr === "Start") ? startDate : endDate; 

		var compareNumDateStr = compareDate.getDate() + "/" + compareDate.getMonth() + "/" + compareDate.getFullYear();
	    $("#inputCompare" + posStr + "Date").val(compareNumDateStr);
	 }

	 var setBaseRangeMessage = function(dates){

	 	var baseStartDateStr = dates[1].getDate()+' '+dates[1].getMonthName(true)+', '+ dates[1].getFullYear();
	    var baseEndDateStr = dates[0].getDate()+' '+dates[0].getMonthName(true)+', '+ dates[0].getFullYear();

	    baseRangeStr = "Base: " + baseStartDateStr + ' - ' + baseEndDateStr;

	    if ( dates.length > 2 ) {

	    	var compareStartDateStr = dates[3].getDate()+' '+dates[3].getMonthName(true)+', '+ dates[3].getFullYear();
	    	var compareEndDateStr = dates[2].getDate()+' '+dates[2].getMonthName(true)+', '+ dates[2].getFullYear();

	    	baseRangeStr += " to " + compareStartDateStr + " - " + compareEndDateStr;

	    }	

	    $("#baseRange").text( baseRangeStr ) 
	 }

	 var getDateMoment = function( posStr ){

	 	var dateStr = $("#input" + posStr + "Date").val();       	
      	dateStr = dateStr.trim();

      	dateStr = ( dateStr.indexOf("/") ) ? dateStr.split("/").join("-") : dateStr;

      	var dateArray = dateStr.split("-");

      	var dateNum = Number(dateArray[0]);
      	var monthNum = Number(dateArray[1]);
      	var yearNum = Number(dateArray[2]);

      	var dateMoment = moment();
      	
      	dateMoment.date(dateNum);
      	dateMoment.month(monthNum);
      	dateMoment.year(yearNum)
		
      	return dateMoment; 

	 }



	 /////////////////////////////////////////// EVENTS


	 var setupEvents = function(){

	 	// FOCUS START BASE
	 	$("#inputBaseStartDate").on("focus", function(){
	 		console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR - maybe not necessary...	

	 	$("#inputBaseStartDate").on("blur", function(){
			console.log("blur");

	 	});

	 	// FOCUS END BASE

	 	$("#inputBaseEndDate").on("focus", function(){
	 		console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// FOCUS START COMPARE

	 	$("#inputCompareStartDate").on("focus", function(){
	 		console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// FOCUS END COMPARE

	 	$("#inputCompareEndDate").on("focus", function(){
	 		console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});	

	 	//$("#inputBaseStartDate")

	 }

	 /////////////////////////////////////////// VALIDATION

	 

	 var validate = function( newDateStr ) {

	 	var isValid = false;

	 	var testDateStr = newDateStr.trim().replace("/", "-");

	 	/*
	 	var dateArray = newDateStr.trim().split("/");
	 	var dayNum = Number( dateArray[0] );
	 	var monthNum = Number( dateArray[1] );
	 	var yearNum = Number( dateArray[2] ); 

	 	var testDate = moment();
		
		var testDate = testDate.day( dayNum ); 
		var testDate = testDate.month( monthNum ); 
		var testDate = testDate.year( yearNum ); 
		*/


		isValid = moment(testDateStr, 'DD-MM-YYYY', true).isValid(); // this doesn't seem to be reliable?!

		return isValid;
			
	 };

	 validateAllDates = function(dates){

	 	displayBaseRangeError();

	 	return false;
	 }

	 var validateStartBeforeEnd = function( startDateMoment, endDateMoment ){

	 	console.log(arguments, " validateStartBeforeEnd ");

	 	 false;

	 	var diffDays = Number(startDateMoment.diff(endDateMoment, 'days') );

	 	var bResult = ( diffDays > 0 ) ? true : false;

	 	console.log("validateStartBeforeEnd diff: " + bResult); 

	 	if ( !bResult ) displayBaseRangeError(); 

	 	return bResult;
	 };

	 var displayBaseRangeError = function(){

	 	$("#validationMessage").addClass("errorMessage");
	 	$("#validationMessage").text("invalid Base Range: start date occurs after end date");

	 }
        
    

	// 3 CALENDARS 


	var to = new Date();
	var from = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 14);


	var calendars = $('#datepicker-calendar').DatePicker({
		  inline: true,
		  date: [from, to],
		  calendars: 3,
		  mode: 'range',
		  onChange: function(dates,el) {

		  	console.log(arguments, "Picker - dates change event currentFocusId: " + currentFocusId);

		  	var bValidDates = validateAllDates(dates);

		  		// what is my curent focus?

		  	if (bValidDates)	{
		  		
		  		switch(currentFocusId){

		  			case "inputBaseStartDate" :

		  				var endDate = baseEndMoment._d;
		  				var startDate = dates[1]; // the change!
		  				
		  				setBaseDate(startDate, endDate, "Start");
		  				setBaseRangeMessage([startDate, endDate]);

		  				calendars.DatePickerSetDate([ endDate, startDate ], true)

		  				break;

		  			case "inputBaseEndDate" :
		  				var endDate = dates[0]; // the change!
		  				var startDate = baseStartMoment._d;

		  				setBaseDate(startDate, endDate, "End");
		  				setBaseRangeMessage([startDate, endDate]);

		  				calendars.DatePickerSetDate([ endDate, startDate ], true)

		  				break;	

		  			case "inputCompareStartDate" :

		  				var baseEndDate = baseEndMoment._d; 
		  				var baseStartDate = baseStartMoment._d;

		  				var endDate = compareEndMoment._d; 
		  				var startDate = dates[3]; // the change!

		  				setCompareDate(startDate, endDate, "Start");
		  				setBaseRangeMessage(dates);

		  				calendars.DatePickerSetDate([ baseEndDate, baseStartDate, endDate, startDate ], true);

		  				break;
		  			case "inputCompareEndDate" :

		  				var baseEndDate = baseEndMoment._d; 
		  				var baseStartDate = baseStartMoment._d;

		  				var endDate = dates[2]; // the change!
		  				var startDate = compareStartMoment._d;

		  				setCompareDate(startDate, endDate, "End");
		  				setBaseRangeMessage(dates);

		  				calendars.DatePickerSetDate([ baseEndDate, baseStartDate, endDate, startDate ], true);

		  				break;	

		  		};  

		  	}   
		  	
		}

	});

	// COMPARE INPUT RANGE 


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

		var endDate = curRange[0]._d;
		var startDate = curRange[1]._d;

		setBaseDate(startDate, endDate, "Start" );
		setBaseDate(startDate, endDate, "End" );

		calendars.DatePickerSetDate([ endDate, startDate ], true)

	}

	var setCalendarsByPreviousCompareRange = function() {

		console.log(previousRange, " setCalendarsByPreviousCompareRange ");

		var baseDates = [ curRange[0]._d, curRange[1]._d ]; 

		var dates = [ previousRange[0]._d, previousRange[1]._d ];  

		var compareNumStartDateStr = dates[1].getDate() + "/" + dates[1].getMonth() + "/" + dates[1].getFullYear();
	    var compareNumEndDateStr = dates[0].getDate() + "/" + dates[0].getMonth() + "/" + dates[0].getFullYear();

	    $("#inputCompareStartDate").val(compareNumStartDateStr);
	    $("#inputCompareEndDate").val(compareNumEndDateStr);
  
        var baseStartDateStr = dates[1].getDate()+' '+ curRange[1].format("MMM") +', '+ dates[1].getFullYear();
        var baseEndDateStr = dates[0].getDate()+' '+ curRange[0].format("MMM") +', '+ dates[0].getFullYear();
       
 	    setBaseRangeMessage(dates);

 	    var baseStart = baseDates[1];
 	    var baseEnd = baseDates[0];
 	    var compareStart = dates[1];
 	    var comapareEnd = dates[0];

 	    calendars.DatePickerSetDate([ baseEnd, baseStart, comapareEnd, compareStart ], true)

	}

	setCalendarsByCurBaseRange();

	// APPLY & CANCEL 

	$("#applyDates").on("click", function(){

	}); 

	$("#cancelDates").on("click", function(){

	}); 

	// SET VALUES

	baseStartMoment = getDateMoment( "BaseStart" ); //getBaseStartDate();
	baseEndMoment = getDateMoment( "BaseEnd" );

	setBaseRangeMessage([baseStartMoment._d, baseEndMoment._d]);

	compareStartMoment = getDateMoment( "CompareStart" );
	compareEndMoment = getDateMoment( "CompareEnd" );

	console.log(baseStartMoment, "baseStartMoment");


	// GLOBAL API FOR TESTING 

	window.drp.baseStartMoment = baseStartMoment;
	window.drp.baseEndMoment = baseEndMoment;
	window.drp.validate = validate;
	window.drp.validateStartBeforeEnd = validateStartBeforeEnd;

	init();

});