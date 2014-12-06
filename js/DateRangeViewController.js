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
	var compareStartMoment = null;
	var compareEndMoment = null;

	var bCompareChecked = false;
	
	var log = true;

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

	// this could be backwards?! shouldn't the end come before the start?!

	var previousPeriod7DaysRange = [moment().subtract(7, 'days'), moment().subtract(13, 'days')];
	var previousPeriod30DaysRange = [moment().subtract(30, 'days'), moment().subtract(59, 'days')];
	var previousPeriod90DaysRange = [moment().subtract(90, 'days'), moment().subtract(179, 'days')];

	var getBaseRange = function( rangeIdStr ){

		var ranges = [];

		switch(rangeIdStr) {
			case "7days" :
				ranges = [baseEndMoment().subtract(6, 'days'), baseStartMoment()];
				break;
			case "30days" :
				ranges = [baseEndMoment().subtract(29, 'days'), baseStartMoment()];
				break;
			case "90days" :
				ranges = [baseEndMoment().subtract(89, 'days'), baseStartMoment()];
				break;
			default :
				ranges = [baseEndMoment().subtract(6, 'days'), baseStartMoment()];
				break;			
		}
	}

	var getCompareRange = function( rangeIdStr ){

		var ranges = [];

		switch(rangeIdStr) {
			case "7days" :
				ranges = [compareStartMoment().subtract(7, 'days'), compareEndMoment().subtract(13, 'days')];
				break;
			case "30days" :
				ranges = [compareStartMoment().subtract(30, 'days'), compareEndMoment().subtract(59, 'days')];
				break;
			case "90days" :
				ranges = [compareStartMoment().subtract(90, 'days'), compareEndMoment().subtract(179, 'days')];
				break;
			default :
				ranges = [compareStartMoment().subtract(7, 'days'), compareEndMoment().subtract(13, 'days')];
				break;			
		}
	}

	var updateBaseRanges = function(rangeIdStr){

		// 7 days
		baseRanges[0].range = getBaseRange("7days"); 

		// 30 days 
		baseRanges[1].range = getBaseRange("30days"); 

		// 90 dasy 
		baseRanges[2].range = getBaseRange("90days"); 
	}

	var updateCompareRanges = function(rangeIdStr){

		// 7 days
		compareRanges[0].range = getCompareRange("7days"); 

		// 30 days 
		compareRanges[1].range = getCompareRange("30days"); 

		// 90 dasy 
		compareRanges[2].range = getCompareRange("90days"); 
	}


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

	var baseRangeStr = "";

	/////////////////////////////////////////// INIT

	var init = function(){

		$("#compareGroup").hide();
	

		//$("#testsContainer").hide();
		setAllDisabled();

		setupEvents();
		
	};

	

	 //$('#inputBaseStartDate').DatePickerSetDate($('#inputBaseStartDate').val(), true);

	 $("#baseSelect").on("change", function(e){
	 	
	 	var idNum = Number(e.target.value);
	 	
	 	//if (log) console.log(e, "base select - idNum: " + idNum);

	 	if ( idNum === 3 ) {
	 		
	 		setBaseInputsEnabled();
	 		setCalendarsEnabled();

	 		// focus on the first base bate
			setCurrentFocus("inputBaseEndDate");

	 	} else {

	 		curRange = baseRanges[idNum].range;
		 	previousRange = previousRanges[idNum].range;

		 	setBaseInputsDisabled();
	 		setCalendarsDisabled();

	 	}

	 	if (!bCompareChecked) {
		 		
		 	setCalendarsByCurBaseRange(); 
		} else {

		 	setCalendarsByPreviousCompareRange();
		}
	 	

	 });

	 /////////////////////////////////////////// GETTERS & SETTERS

	 var setApplyDisabled = function(){
	 	$("#applyDates").addClass("disableApply");
	 }

	 var setApplyEnabled = function(){
	 	$("#applyDates").removeClass("disableApply");
	 }

	 var setCompareInputsDisabled = function() {

	 	console.log("setCompareInputsDisabled");

	 	$("#inputCompareStartDate").addClass("disableControl");
	 	$("#inputCompareEndDate").addClass("disableControl");
	 }

	 var setCompareInputsEnabled = function() {
	 	$("#inputCompareStartDate").removeClass("disableControl");
	 	$("#inputCompareEndDate").removeClass("disableControl");
	 }

	 var setBaseInputsDisabled = function() {
	 	$("#inputBaseStartDate").addClass("disableControl");
	 	$("#inputBaseEndDate").addClass("disableControl");
	 }

	 var setBaseInputsEnabled = function() {
	 	$("#inputBaseStartDate").removeClass("disableControl");
	 	$("#inputBaseEndDate").removeClass("disableControl");
	 }

	 var setCalendarsDisabled = function() {
	 	$("#datepicker-calendar").addClass("disableControl");
	 }

	 var setCalendarsEnabled = function(){
	 	$("#datepicker-calendar").removeClass("disableControl");
	 }

	 var setAllDisabled = function(){
	 	setCompareInputsDisabled();
	 	setBaseInputsDisabled();
	 	setCalendarsDisabled();
	 }

	 var setCurrentFocus = function( inputId ) {

		currentFocusId = inputId;

		if (log) console.log("current focus: " + currentFocusId);

		
	 	var curInputEl = $("#" + currentFocusId);
	 	
	 	// ...then focus here
	 	var el = $("#" + currentFocusId).get(0);
	    var elemLen = el.value.length;

	    el.selectionStart = elemLen;
	    el.selectionEnd = elemLen;
	    el.focus();
	    el.setSelectionRange(0,elemLen);

	    // 

	    if ( currentFocusId.indexOf("Compare") ) {

		    if ( null !== prevFocusId ) {
		    	
		    	var prevInputEl = $("#" + prevFocusId);
		   		prevInputEl.removeClass("compareRangeSelected");
		   	}

		    curInputEl.addClass("compareRangeSelected"); 

		} else {

			 if ( null !== prevFocusId ) {
		    	
		    	var prevInputEl = $("#" + prevFocusId);
		   		prevInputEl.removeClass("baseRangeSelected");
		   	}

		    curInputEl.addClass("baseRangeSelected");
			
		}

	    prevFocusId = currentFocusId;


	 }
	 
	 var setBaseDate = function( startDate, endDate, posStr ){

	 	if (log) console.log(arguments, " setBaseDate ");
	 	if (log) console.log(baseStartMoment, " setBaseDate baseStartMoment");

	 	var baseDate = (posStr === "Start") ? startDate : endDate; 

		var baseNumDateStr = baseDate.getDate() + "/" + ( baseDate.getMonth() + 1 )  + "/" + baseDate.getFullYear();
	    $("#inputBase" + posStr + "Date").val(baseNumDateStr);

	    // need up update the base moments 

	    if (posStr === "Start") {
	    	if (null !== baseStartMoment) {
	    		baseStartMoment.date( baseDate.getDate() );
	    		baseStartMoment.month( baseDate.getMonth() );
	    		baseStartMoment.year( baseDate.getFullYear() );
	    	}
	    } else {
	    	if (null !== baseEndMoment) {
	    		baseEndMoment.date( baseDate.getDate() );
	    		baseEndMoment.month( baseDate.getMonth() );
	    		baseEndMoment.year( baseDate.getFullYear() );
	    	}
	    }
	    
	 }

	 var setCompareDate = function( startDate, endDate, posStr ){

		if (log) console.log(arguments, " setCompareDate ");

	 	var compareDate = (posStr === "Start") ? startDate : endDate; 

		var compareNumDateStr = compareDate.getDate() + "/" + ( Number(compareDate.getMonth()) + 1 ) + "/" + compareDate.getFullYear();
	    $("#inputCompare" + posStr + "Date").val(compareNumDateStr);

		// need up update the compare moments 	    
	    if (posStr === "Start") {
	    	compareStartMoment.date( compareDate.getDate() );
	    	compareStartMoment.month( compareDate.getMonth() );
	    	compareStartMoment.year( compareDate.getFullYear() );
	    } else {
	    	compareEndMoment.date( compareDate.getDate() );
	    	compareEndMoment.month( compareDate.getMonth() );
	    	compareEndMoment.year( compareDate.getFullYear() );
	    }
	 }

	 var setBaseRangeMessage = function(dates){

	 	if (log) console.log(arguments, " setBaseRangeMessage ");

	 	var baseStartDateStr = dates[1].getDate()+' '+dates[1].getMonthName(true)+', '+ dates[1].getFullYear();
	    var baseEndDateStr = dates[0].getDate()+' '+dates[0].getMonthName(true)+', '+ dates[0].getFullYear();

	    baseRangeStr = "<span class='baseRangeTxt'>" + baseStartDateStr + ' - ' + baseEndDateStr + "</span>";

	    if ( dates.length > 2 ) {

	    	var compareStartDateStr = dates[3].getDate()+' '+dates[3].getMonthName(true)+', '+ dates[3].getFullYear();
	    	var compareEndDateStr = dates[2].getDate()+' '+dates[2].getMonthName(true)+', '+ dates[2].getFullYear();

	    	baseRangeStr += " <span style='font-size:12px; color: #666'>Compared to:</span> <span class='compareRangeTxt'>" + compareStartDateStr + " - " + compareEndDateStr + "</span>";;

	    	if (log) console.log(arguments, " setBaseRangeMessage - compare message: " + baseRangeStr);

	    }	

	    $("#baseRange").html( baseRangeStr ) 
	 }

	 var getDateMoment = function( posStr ){

	 	var dateStr = $("#input" + posStr + "Date").val();       	
      	dateStr = dateStr.trim();

      	dateStr = ( dateStr.indexOf("/") ) ? dateStr.split("/").join("-") : dateStr;

      	var dateArray = dateStr.split("-");

      	console.log(dateArray, "getDateMoment dateStr: " + dateStr + " posStr: " + posStr);

      	var monthNumDown = Number(dateArray[1]) -1; 

      	if ( posStr.indexOf("Compare") !== -1 ) {

      		console.log("got here!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      		monthNumDown = Number(dateArray[1]); 

      	} 

      	var dateNum = Number(dateArray[0]);
      	var monthNum = monthNumDown;

      	var yearNum = Number(dateArray[2]);

      	var dateMoment = moment();
      	
      	dateMoment.date(dateNum);
      	dateMoment.month(monthNum);
      	dateMoment.year(yearNum)

      	console.log(dateMoment, "getDateMoment posStr: " + posStr)
		
      	return dateMoment; 

	 }



	 /////////////////////////////////////////// EVENTS


	 var setupEvents = function(){

	 	// FOCUS START BASE
	 	$("#inputBaseStartDate").on("focus", function(){
	 		if (log) console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR - maybe not necessary...	

	 	$("#inputBaseStartDate").on("blur", function(){
			if (log) console.log("blur");

	 	});

	 	$("#inputBaseStartDate").bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			 if(code == 13) { 
			   onBaseInputEnterHandler("Start");
			 }
		});

	 	// FOCUS END BASE

	 	$("#inputBaseEndDate").on("focus", function(){
	 		if (log) console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR

	 	$("#inputBaseEndDate").on("blur", function(){
			if (log) console.log("blur");

	 	});

	 	// ENTER

	 	$("#inputBaseEndDate").bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			 if(code == 13) { 
			   onBaseInputEnterHandler("End");
			 }
		});


	 	// FOCUS START COMPARE

	 	$("#inputCompareStartDate").on("focus", function(){
	 		if (log) console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR

	 	$("#inputCompareStartDate").on("blur", function(){
			if (log) console.log("blur");

	 	});

	 	// ENTER

	 	$("#inputCompareStartDate").bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			 if(code == 13) { 
			   onCompareInputEnterHandler("Start");
			 }
		});

	 	// FOCUS END COMPARE

	 	$("#inputCompareEndDate").on("focus", function(){
	 		if (log) console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});	

	 	// BLUR

	 	$("#inputCompareEndDate").on("blur", function(){
			if (log) console.log("blur");

	 	});

	 	// ENTER

	 	$("#inputCompareEndDate").bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			 if(code == 13) { 
			   onCompareInputEnterHandler("End");
			 }
		});

	 	//$("#inputBaseStartDate")

	 }

	 //////////////////////////////////////////// HANDLERS

	 var onBaseInputEnterHandler = function( posStr ){
	 	var enteredDate = $("#inputBase" + posStr + "Date").val();
			   // 
		var bValid = isDate(enteredDate);

	    if (bValid) {
	   		
	   		if (posStr == "Start") baseStartMoment = getDateMoment("BaseStart");
	   		else baseEndMoment = getDateMoment("BaseEnd");
	   		
	   		setBaseDate(baseStartMoment._d, baseEndMoment._d, "Start");
	   		calendars.DatePickerSetDate([ baseEndMoment._d, baseStartMoment._d ], true);

	   		displayNoErrorMessage();

	    } else {
	   		
	   		var displayPos = (posStr !== "Start") ? "from:" : "to:";
	   		displayBaseRangeError('The '+ displayPos +' date is not properly formated (DD/MM/YYYY)'); 
	    }
	 }

	 var onCompareInputEnterHandler = function( posStr ){
	 	var enteredDate = $("#inputCompare" + posStr + "Date").val();
			   // 
		var bValid = isDate(enteredDate);

	    if (bValid) {
	   		
	   		if (posStr == "Start") compareStartMoment = getDateMoment("CompareStart");
	   		else compareEndMoment = getDateMoment("CompareEnd");
	   		
	   		setComapreDate(compareStartMoment._d, compareEndMoment._d, "Start");
	   		calendars.DatePickerSetDate([ baseEndMoment._d, baseStartMoment._d, compareEndMoment._d, compareStartMoment._d ], true);

	   		displayNoErrorMessage();

	    } else {
	    	
	    	var displayPos = (posStr !== "Start") ? "from:" : "to:";
	   		displayBaseRangeError('The '+ displayPos +' date is not properly formated (DD/MM/YYYY)'); 
	    }
	 }

	 /////////////////////////////////////////// VALIDATION

	 

	 var isDate = function( newDateStr ) {

	 	if (log) console.log("isDate newDateStr: " + newDateStr)

	 	var parms = newDateStr.split(/[\.\-\/]/);
		var yyyy = parseInt(parms[2],10);
		var mm   = parseInt(parms[1],10);
		var dd   = parseInt(parms[0],10);
		var date = new Date(yyyy,mm-1,dd,0,0,0,0);

		var isValid = (date.getMonth()+1) && dd === date.getDate() && yyyy === date.getFullYear();
		
		if (log) console.log("isDate isValid: " + isValid)

		return isValid;

	
	 };

	 var validateAllDates = function(dates){

	 	// assume all dates are invalid
	 	var bResult = false;

	 	// base range
	 	// does the startdate come before the end ? if so, it's invalid
	 	var startDate = dates[1];
	 	var endDate = dates[0];

	 	var startDateMoment = moment().date( startDate.getDate() ).month( startDate.getMonth() ).year( startDate.getFullYear() );
	 	var endDateMoment =  moment().date( endDate.getDate() ).month( endDate.getMonth() ).year( endDate.getFullYear() );

	 	bResult = validateStartBeforeEnd(startDateMoment, endDateMoment);

	 	if (!bResult) {
	 		displayBaseRangeError();
	 		return bResult; 
	 	}

	 	if (dates.length > 2) {

	 		var startCompareDate = dates[3];
	 		var endCompareDate = dates[2];

	 		var startCompareDateMoment = moment().date( startCompareDate.getDate() ).month( startCompareDate.getMonth() ).year( startCompareDate.getFullYear() );
	 		var endCompareDateMoment =  moment().date( endCompareDate.getDate() ).month( endCompareDate.getMonth() ).year( endCompareDate.getFullYear() );
	 	
	 		bResult = validateStartBeforeEnd(startCompareDateMoment, endCompareDateMoment);
	 		
	 		var compareErrorMsg = 'Invalid Compare Range: the "to:" date occurs before the "from:" date';
	 		if (!bResult) displayBaseRangeError(compareErrorMsg);
	 	} 

	 	return bResult;
	 }

	 var validateStartBeforeEnd = function( startDateMoment, endDateMoment ){

	 	if (log) console.log(arguments, " validateStartBeforeEnd ");

	 	//var diffStart = moment( [ startDateMoment.year(), startDateMoment.month(), startDateMoment.date() ] );
	 	//var diffEnd =  moment( [ endDateMoment.year(), endDateMoment.month(), endDateMoment.date() ] );

	 	if (log) console.log("========== END ==========");
	 	if (log) console.log("year: " + endDateMoment.year() );
	 	if (log) console.log("month: " + Number ( Number( endDateMoment.month() ) + 1 ) );
	 	if (log) console.log("date: " + endDateMoment.date() );
	 	
	 	if (log) console.log("=========== START ============");
	 	if (log) console.log("year: " + startDateMoment.year() );
	 	if (log) console.log("month: " + Number ( Number( startDateMoment.month() ) + 1 ) );
	 	if (log) console.log("date: " + startDateMoment.date() );

	 	var diffDays = null;

	 	var endMonth = Number ( Number( endDateMoment.month() ) + 1 );
	 	var startMonth = Number ( Number( startDateMoment.month() ) + 1 );

	 	var bResult = false;

	 	if ( endDateMoment.year() <= startDateMoment.year() ) {

	 		if ( endMonth == startMonth ) {

	 			if ( endDateMoment.date() < startDateMoment.date() ) {

	 				diffDays = startDateMoment.date() - endDateMoment.date(); 
	 				bResult = true;

	 			} else {
	 				// invalid 
	 				bResult = false;
	 			}

	 		} else if ( endMonth < startMonth ) {
	 			// valid - more than a month
	 			bResult = true;

	 		} else if ( endMonth > startMonth ) {

	 			// invalid 
	 			bResult = false;
	 		} 

	 	} else {
	 		// valid - more than a year
	 		bResult = true;
	 	}
	
	 	if (log) console.log("validateStartBeforeEnd valid: " + bResult + " diffDays: " + diffDays); 

	 	if ( !bResult ) {
	 		setApplyDisabled();
	 		displayBaseRangeError();
	 	} else {
	 		setApplyEnabled();
	 		displayNoErrorMessage();
	 	} 

	 	return bResult;
	 };

	 var displayNoErrorMessage = function() {

	 	if ( $("#validationMessage").hasClass("errorMessage") ) $("#validationMessage").removeClass("errorMessage");

	 	$("#validationMessage").addClass("validMessage");
	 	$("#validationMessage").text('You have entered valid dates, please click Apply to continue');
	 }

	 var displayBaseRangeError = function( errorMsgStr ){

	 	errorMsgStr = ( typeof errorMsgStr !== "undefined" ) ? errorMsgStr : 'Invalid Base Range: the "to:" date occurs before the "from:" date';

	 	$("#validationMessage").addClass("errorMessage");
	 	$("#validationMessage").text(errorMsgStr);

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

		  	if (log) console.log(arguments, "Picker - dates change event currentFocusId: " + currentFocusId);

		  	var testDates = [];

		  	switch(currentFocusId){

		  			case "inputBaseStartDate" :

		  				var endDate = baseEndMoment._d;
		  				var startDate = dates[1]; // the change!
		  				
		  				testDates = [endDate, startDate]; 

		  				break;

		  			case "inputBaseEndDate" :
		  				var endDate = dates[0]; // the change!
		  				var startDate = baseStartMoment._d;

		  				testDates = [endDate, startDate]; 

		  				break;	

		  			case "inputCompareStartDate" :

		  				var baseEndDate = baseEndMoment._d; 
		  				var baseStartDate = baseStartMoment._d;

		  				var endDate = compareEndMoment._d; 
		  				var startDate = dates[3]; // the change!

		  				testDates = [baseEndDate, baseStartDate, endDate, startDate]; 

		  				break;
		  			case "inputCompareEndDate" :

		  				var baseEndDate = baseEndMoment._d; 
		  				var baseStartDate = baseStartMoment._d;

		  				var endDate = dates[2]; // the change!
		  				var startDate = compareStartMoment._d;

		  				testDates = [baseEndDate, baseStartDate, endDate, startDate]; 

		  				break;	

		  		};  

		  	var bValidDates = validateAllDates(testDates);

		  		// what is my curent focus?

		  	if (bValidDates)	{

		  		displayNoErrorMessage();
		  		
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
		  				setBaseRangeMessage([baseStartDate, baseEndDate, startDate, endDate]);

		  				console.log("all dates valid - should draw this compare start date");

		  				calendars.DatePickerSetDate([ baseEndDate, baseStartDate, endDate, startDate ], true);

		  				break;
		  			case "inputCompareEndDate" :

		  				var baseEndDate = baseEndMoment._d; 
		  				var baseStartDate = baseStartMoment._d;

		  				var endDate = dates[2]; // the change!
		  				var startDate = compareStartMoment._d;

		  				setCompareDate(startDate, endDate, "End");
		  				setBaseRangeMessage([baseStartDate, baseEndDate, startDate, endDate]);

		  				calendars.DatePickerSetDate([ baseEndDate, baseStartDate, endDate, startDate ], true);

		  				break;	

		  		};  

		  	}   
		  	
		}

	});

	// COMPARE INPUT RANGE 


	$("#inputCompareCheckbox").on("change", function(e) {
		if (log) console.log(e.currentTarget.checked);

		if ( e.currentTarget.checked ) {
			setCalendarsByPreviousCompareRange();
			
			if (null === compareStartMoment) {
				
				// 1. set them so that one can...
				setCalendarsByPreviousCompareRange();

				// 2. get them
				compareStartMoment = getDateMoment( "CompareStart" );
				compareEndMoment = getDateMoment( "CompareEnd" );
			}

			setBaseRangeMessage([baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, compareEndMoment._d]);

			$("#compareGroup").fadeIn();

		} else {
			setCalendarsByCurBaseRange();
			$("#compareGroup").fadeOut();

			// 

			setBaseRangeMessage([baseStartMoment._d, baseEndMoment._d]);
		}

		bCompareChecked = !bCompareChecked; 
	});

	$("#compareSelect").on("change", function(e){
		if (log) console.log("compare select - e.target.value: " + e.target.value);

		var idNum = Number(e.target.value);

		if ( idNum === 0) {
		 	//previousRange = previousRanges[idNum].range;
		 
		 	setCompareInputsDisabled();
	 		setCalendarsDisabled();

	 		setCalendarsByPreviousCompareRange(); 

	 	} else {

	 		setCompareInputsEnabled();
	 		setCalendarsEnabled();
	 	}

	 });

	var setCalendarsByCurBaseRange = function() {

		if (log) console.log(calendars, " setCalendarsByCurBaseRange ");

		var endDate = curRange[0]._d;
		var startDate = curRange[1]._d;

		setBaseDate(startDate, endDate, "Start" );
		setBaseDate(startDate, endDate, "End" );

		calendars.DatePickerSetDate([ endDate, startDate ], true)

	}

	var setCalendarsByPreviousCompareRange = function() {

		if (log) console.log(previousRange, " setCalendarsByPreviousCompareRange ");

		var baseDates = [ curRange[0]._d, curRange[1]._d ]; 

		var dates = [ previousRange[0]._d, previousRange[1]._d ];  

		var compareNumStartDateStr = dates[0].getDate() + "/" + (dates[0].getMonth() + 1) + "/" + dates[0].getFullYear();
	    var compareNumEndDateStr = dates[1].getDate() + "/" + (dates[1].getMonth() + 1) + "/" + dates[1].getFullYear();

	    $("#inputCompareStartDate").val(compareNumStartDateStr);
	    $("#inputCompareEndDate").val(compareNumEndDateStr);
  
        var baseStartDateStr = dates[1].getDate()+' '+ curRange[1].format("MMM") +', '+ dates[1].getFullYear();
        var baseEndDateStr = dates[0].getDate()+' '+ curRange[0].format("MMM") +', '+ dates[0].getFullYear();
       
 	    var baseStart = baseDates[1];
 	    var baseEnd = baseDates[0];
 	    var compareStart = dates[1];
 	    var comapareEnd = dates[0];

 	    setBaseRangeMessage([ baseStart, baseEnd, compareStart, comapareEnd ]);

 	    calendars.DatePickerSetDate([ baseEnd, baseStart, comapareEnd, compareStart ], true)

	}

	setCalendarsByCurBaseRange();
	

	// APPLY & CANCEL 

	$("#applyDates").on("click", function(){

		var data = (bCompareChecked) ? { 	baseStartDate: baseStartMoment._d, 
											baseEndDate: baseEndMoment._d, 
											compareStartDate: compareStartMoment._d, 
											compareEndDate: compareEndMoment._d,
											compareMode: true } : {  baseStartDate: baseStartMoment._d, 
																				baseEndDate: baseEndMoment._d, 
																				compareStartDate: null, 
																				compareEndDate: null,
																				compareMode: false };

		//ir.introspect.app.msgBus.trigger('applyDates');
		ir.introspect.app.msgBus.trigger('date:apply', data);
		
        ga('send', 'event', 'Tool Bar', 'click', 'apply dates');
			
		ir.introspect.app.msgBus.trigger("date:close"); 

		
	}); 

	$("#close-date").on("click", function(){
		ir.introspect.app.msgBus.trigger("date:close"); 
	});

	$("#cancelDates").on("click", function(){
		ir.introspect.app.msgBus.trigger("date:close"); 
	}); 

	// SET VALUES

	baseStartMoment = getDateMoment( "BaseStart" ); //getBaseStartDate();
	baseEndMoment = getDateMoment( "BaseEnd" );

	setBaseRangeMessage([baseStartMoment._d, baseEndMoment._d]);


	if (log) console.log(compareStartMoment, "compareStartMoment");


	// GLOBAL API FOR TESTING 

	window.drp.baseStartMoment = baseStartMoment;
	window.drp.baseEndMoment = baseEndMoment;
	window.drp.isDate = isDate;
	window.drp.validateStartBeforeEnd = validateStartBeforeEnd;

	init();

});