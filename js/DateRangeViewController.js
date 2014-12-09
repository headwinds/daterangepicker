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

	var bCustomBaseRange = false;
	var bCustomCompareRange = false;

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
	var last180DaysRange = [moment().subtract(179, 'days'), moment()];
	var last365DaysRange = [moment().subtract(364, 'days'), moment()];
	// thisMonthRange = [moment().startOf('month'), moment().endOf('month')];
	// lastMonthRange = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];
	// last3MonthsRange =
	// last6MonthsRange =
	// lastYearRange = 

	// this could be backwards?! shouldn't the end come before the start?!

	var previousPeriod7DaysRange = [moment().subtract(7, 'days'), moment().subtract(13, 'days')];
	var previousPeriod30DaysRange = [moment().subtract(30, 'days'), moment().subtract(59, 'days')];
	var previousPeriod90DaysRange = [moment().subtract(90, 'days'), moment().subtract(179, 'days')];
	var previousPeriod180DaysRange = [moment().subtract(180, 'days'), moment().subtract(359, 'days')];
	var previousPeriod365DaysRange = [moment().subtract(365, 'days'), moment().subtract(729, 'days')];

	var baseRanges = [
	     { label: 'Last 7 Days', range: last7DaysRange, id: 0},
	     { label: 'Last 30 Days', range: last30DaysRange, id: 1},
	     { label: 'Last 90 Days', range: last90DaysRange, id: 2},
	     { label: 'Last 180 Days', range: last180DaysRange, id: 3},
	     { label: 'Last 365 Days', range: last365DaysRange, id: 4}
    ]; 

    var previousRanges = [
	     { label: 'Previous Last 7 Days', range: previousPeriod7DaysRange, id: 0},
	     { label: 'Previous Last 30 Days', range: previousPeriod30DaysRange, id: 1},
	     { label: 'Previous Last 90 Days', range: previousPeriod90DaysRange, id: 2},
	     { label: 'Previous Last 180 Days', range: previousPeriod180DaysRange, id: 3},
	     { label: 'Previous Last 365 Days', range: previousPeriod365DaysRange, id: 4}
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
		$("#prismContainer").hide();
	

		//$("#testsContainer").hide();
		setAllDisabled();

		setupEvents();

		// after every control is ready, run the tests
		if (typeof mocha !== "undefined" ) {
			//mocha.run();
		}
		
	};


	 $("#baseSelect").on("change", function(e){
	 	
	 	var idNum = Number(e.target.value);

	 	if ( idNum === 4 ) {
	 		var warningStr =  "<span class='warningRangeTxt'> Warning: this year range may take a long time to load </span>";
	 		$("#validationMessage").html(warningStr);
	 	} else {
	 		$("#validationMessage").html("");
	 	}

	 	if ( idNum === 5 ) {
	 		
	 		setBaseInputsEnabled();
	 		setCalendarsEnabled();

	 		// focus on the first base bate
			setCurrentFocus("inputBaseEndDate");

			bCustomBaseRange = true; 

	 	} else {

	 		curRange = baseRanges[idNum].range;
		 	previousRange = previousRanges[idNum].range;

		 	setBaseInputsDisabled();
	 		setCalendarsDisabled();

	 		bCustomBaseRange = false; 

	 	}

	 	if (!bCompareChecked) {
		 		
		 	setCalendarsByCurBaseRange(); 

		} else {

		 	setCalendarsByPreviousCompareRange();
		}

		console.log("baseSelect change bCompareChecked: " + bCompareChecked );
	 	

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


	 	$("#datepicker-calendar .datepickerGoPrev").css("cursor", "pointer");
	 	$("#datepicker-calendar .datepickerGoNext").css("cursor", "pointer");
	 	$("#datepicker-calendar .datepickerGoPrev").css("pointer-events", "all");
	 	$("#datepicker-calendar .datepickerGoNext").css("pointer-events", "all");

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
	 	var curInputEl = $("#" + currentFocusId);

	 	if (  curInputEl.hasClass("errorInputTxt") ) curInputEl.removeClass("errorInputTxt"); 
	 	
	 	// ...then focus here
	 	var el = $("#" + currentFocusId).get(0);
	    var elemLen = el.value.length;

	    el.selectionStart = elemLen;
	    el.selectionEnd = elemLen;
	    el.focus();
	    el.setSelectionRange(0,elemLen);

	    // 
	    $("#inputBaseEndDate").removeClass("baseRangeSelected");
	    $("#inputBaseStartDate").removeClass("baseRangeSelected");
	    $("#inputCompareStartDate").removeClass("compareRangeSelected");
	    $("#inputCompareEndDate").removeClass("compareRangeSelected");

	    //

	    if ( currentFocusId.indexOf("Compare") !== -1 ) curInputEl.addClass("compareRangeSelected");
	    else curInputEl.addClass("baseRangeSelected");
		   	
	    prevFocusId = currentFocusId;


	 }
	 
	 var setBaseDate = function( startDate, endDate, posStr ){

	 	//if (log)  console.log(arguments, " setBaseDate ");
	 	//if (log)  console.log(baseStartMoment, " setBaseDate baseStartMoment");

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

		if (log)  console.log(arguments, "setCompareDate posStr: " + posStr);

	 	var compareDate = (posStr === "Start") ? startDate : endDate; 

		var compareNumDateStr = compareDate.getDate() + "/" + ( Number(compareDate.getMonth()) + 1 ) + "/" + compareDate.getFullYear();
	    $("#inputCompare" + posStr + "Date").val(compareNumDateStr);

		// need up update the compare moments 	    
	    if (posStr === "Start") {
	    	compareStartMoment.date( compareDate.getDate() );
	    	compareStartMoment.month( compareDate.getMonth() ); // both moment and date respect 0-11 as months 
	    	compareStartMoment.year( compareDate.getFullYear() );
	    } else {
	    	compareEndMoment.date( compareDate.getDate() );
	    	compareEndMoment.month( compareDate.getMonth() );
	    	compareEndMoment.year( compareDate.getFullYear() );
	    }
	 }

	 var setBaseRangeMessage = function(dates){

	 	//if (log)  console.log(arguments, " setBaseRangeMessage ");

	 	var baseStartDateStr = dates[1].getDate()+' '+dates[1].getMonthName(true)+', '+ dates[1].getFullYear();
	    var baseEndDateStr = dates[0].getDate()+' '+dates[0].getMonthName(true)+', '+ dates[0].getFullYear();

	    baseRangeStr = "<span class='baseRangeTxt'>" + baseStartDateStr + ' - ' + baseEndDateStr + "</span>";

	    if ( bCompareChecked ) {

	    	var compareStartDateStr; 
	    	var compareEndDateStr;

		    if ( dates.length > 2 ) {

		    	compareStartDateStr = dates[3].getDate()+' '+dates[3].getMonthName(true)+', '+ dates[3].getFullYear();
		    	compareEndDateStr = dates[2].getDate()+' '+dates[2].getMonthName(true)+', '+ dates[2].getFullYear();

		    } else {
		    	compareStartDateStr = compareStartMoment.date()+' '+compareStartMoment.format("MMMM")+', '+ compareStartMoment.year();
		    	compareEndDateStr = compareEndMoment.date()+' '+compareEndMoment.format("MMMM")+', '+ compareEndMoment.year();
		    }

		    var compareRangePartAStr =  "<span class='compareRangeTxt'>" + compareEndDateStr  + " - " +  compareStartDateStr + "</span>";
		    var compareRangePartBStr = "<span style='font-size:12px; color: #666'> - To -  </span>" ;
		    var compareRangePartCStr = baseRangeStr;

		    var compareRangeStr = compareRangePartAStr + compareRangePartBStr + compareRangePartCStr;

		    $("#baseRange").html( compareRangeStr ) ;

	    } else {
	    	$("#baseRange").html( baseRangeStr ) 
	    }	

	   
	 }

	 var getDateMoment = function( posStr ){

	 	var dateStr = $("#input" + posStr + "Date").val();       	
      	dateStr = dateStr.trim();

      	dateStr = ( dateStr.indexOf("/") ) ? dateStr.split("/").join("-") : dateStr;

      	var dateArray = dateStr.split("-");

      	console.log(dateArray, "getDateMoment dateStr: " + dateStr + " posStr: " + posStr);

      	var monthNumDown = Number(dateArray[1]) -1; 

      	//if ( posStr.indexOf("Compare") !== -1 ) {

      	//	monthNumDown = Number(dateArray[1]); 

      	//} 

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
	 		//if (log)  console.log("focus");
	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR 

	 	$("#inputBaseStartDate").on("blur", function(){
			if (log)  console.log("blur start");
			newDateAdded("BaseStart");
	 	});

	 	$("#inputBaseStartDate").bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			 if(code == 13) { 
			   newDateAdded("BaseStart");
			 }
		});

	 	// FOCUS END BASE

	 	$("#inputBaseEndDate").on("focus", function(){
	 		if (log)  console.log("focus end");
	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR

	 	$("#inputBaseEndDate").on("blur", function(){
			if (log)  console.log("blur end");
			 newDateAdded("BaseEnd");
	 	});

	 	// ENTER

	 	$("#inputBaseEndDate").bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			 if(code == 13) { 
			    newDateAdded("BaseEnd");
			 }
		});


	 	// FOCUS START COMPARE

	 	$("#inputCompareStartDate").on("focus", function(){
	 		//if (log)  console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR

	 	$("#inputCompareStartDate").on("blur", function(){
			//if (log)  console.log("blur");
			 newDateAdded("CompareStart");
	 	});

	 	// ENTER

	 	$("#inputCompareStartDate").bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			 if(code == 13) { 
			    newDateAdded("CompareStart");
			 }
		});

	 	// FOCUS END COMPARE

	 	$("#inputCompareEndDate").on("focus", function(){
	 		//if (log)  console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});	

	 	// BLUR

	 	$("#inputCompareEndDate").on("blur", function(){
			//if (log)  console.log("blur");
			newDateAdded("CompareEnd");
	 	});

	 	// ENTER

	 	$("#inputCompareEndDate").bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			 if(code == 13) { 
			   newDateAdded("CompareEnd");
			 }
		});

	 	//$("#inputBaseStartDate")

	 }

	 //////////////////////////////////////////// HANDLERS

	 // on enter or blur test the new date
	 var newDateAdded = function( posStr ){

	 	console.log("newDateAdded posStr: " + posStr);

	 	var inputBox = $("#input" + posStr + "Date");

	 	var enteredDate = inputBox.val();
			   // 
		var bValid = isDate(enteredDate);

		console.log("newDateAdded enteredDate: " + enteredDate);
		console.log("newDateAdded bValid: " + bValid);

		var bCompare = ( posStr.indexOf("Compare") != - 1); 

	    if (bValid) {

	    	if (bCompare) {

	    		console.log("newDateAdded - its a compare date" );

	    		if (posStr == "CompareStart") compareStartMoment = getDateMoment("CompareStart");
		   		else compareEndMoment = getDateMoment("CompareEnd");

		 		var comparePos = (posStr == "CompareStart") ? "Start" : "End";

		 		console.log("newDateAdded - and its set to: " + compareEndMoment._d );

		   		setCompareDate(compareStartMoment._d, compareEndMoment._d, comparePos);

	    	} else {
	   		
		   		if (posStr == "BaseStart") baseStartMoment = getDateMoment("BaseStart");
		   		else baseEndMoment = getDateMoment("BaseEnd");

		   		var basePos = (posStr == "BaseStart") ? "Start" : "End";

		   		setBaseDate(baseStartMoment._d, baseEndMoment._d, basePos);

	   		}

	   		if (bCompareChecked) {
		   			setCalendarsByPreviousCompareRange( baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, compareEndMoment._d );
		   	} else { 	
		   			setCalendarsByCurBaseRange( baseStartMoment._d, baseEndMoment._d );
		   	}

	   		displayNoErrorMessage();

	   		if (  inputBox.hasClass("errorInputTxt") ) inputBox.removeClass("errorInputTxt"); 

	   		// 


	    } else {

	    	var displayPos;

	    	if (bCompare) {
	   		
	   		 	displayPos = (posStr !== "CompareStart") ? "compare from:" : "compare to:";
	   		
	   		} else {
				displayPos = (posStr !== "BaseStart") ? "base from:" : "base to:";
	   		}

	   		displayBaseRangeError('The '+ displayPos +' date is not properly formated (DD/MM/YYYY)'); 

	   		inputBox.addClass("errorInputTxt"); 
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

	 	//if (log)  console.log("isDate newDateStr: " + newDateStr)

	 	var parms = newDateStr.split(/[\.\-\/]/);

	 	var yearStr = String(parms[2]);

	 	if ( yearStr.length > 4 ) {
	 		return isValid = false;
	 	}

		var yyyy = parseInt(yearStr,10);

		var mm   = parseInt(parms[1],10);
		var dd   = parseInt(parms[0],10);
		var date = new Date(yyyy,mm-1,dd,0,0,0,0);

		var isValid = (date.getMonth()+1) && dd === date.getDate() && yyyy === date.getFullYear();
		
		if (log)  console.log("isDate yyyy: " + yyyy);
		if (log)  console.log("isDate date: " + date);

		return isValid;

	
	 };

	 var validateAllDates = function(dates){

	 	// assume all dates are invalid
	 	var bResult = false;

	 	console.log("---- validateAllDates ----");
	 	console.log(dates, "dates");

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
	 	
	 		
	 		console.log("startCompareDateMoment._d: " + startCompareDateMoment._d);
	 		console.log("endCompareDateMoment._d: " + endCompareDateMoment._d);

	 		bResult = validateStartBeforeEnd(startCompareDateMoment, endCompareDateMoment);
	 		
	 		var compareErrorMsg = 'Invalid Compare Range: the compare "to:" date occurs before the compare "from:" date';

	 		if (!bResult) {
	 			
	 			displayBaseRangeError(compareErrorMsg)
	 			return bResult;
	 		}

	 		console.log("---- 4 date validation ----");
	 		console.log("compare start: " + startCompareDateMoment._d);
	 		console.log("compare end: " + endCompareDateMoment._d);
	 		console.log("base start: " + startDateMoment._d);
	 		console.log("base end: " + endDateMoment._d);

	 		// does the compare start or end date came before the base end date ?!
	 		bResult = validateStartBeforeEnd(endDateMoment, startCompareDateMoment );

	 		if (!bResult) {
	 			compareErrorMsg = 'Invalid Compare Range: compare "to" occurs before base "from"';
	 			displayBaseRangeError(compareErrorMsg)
	 			return bResult;
	 		}

	 		console.log("test 1 bResult: " + bResult);

	 		bResult = validateStartBeforeEnd(endDateMoment, endCompareDateMoment );

	 		console.log("test 2 bResult: " + bResult);

	 		if (!bResult) {
	 			compareErrorMsg = 'Invalid Compare Range: compare "from" occurs before base "from"';
	 			displayBaseRangeError(compareErrorMsg)
	 			return bResult;
	 		}

	 	
	 	} 

	 	return bResult;
	 }

	 var validateStartBeforeEnd = function( startDateMoment, endDateMoment ){

	 	if (log)  console.log(arguments, " validateStartBeforeEnd ");

	 	//var diffStart = moment( [ startDateMoment.year(), startDateMoment.month(), startDateMoment.date() ] );
	 	//var diffEnd =  moment( [ endDateMoment.year(), endDateMoment.month(), endDateMoment.date() ] );

	 	if (log)  console.log("========== END ==========");
	 	if (log)  console.log("year: " + endDateMoment.year() );
	 	if (log)  console.log("month: " + Number ( Number( endDateMoment.month() ) + 1 ) );
	 	if (log)  console.log("date: " + endDateMoment.date() );
	 	
	 	if (log)  console.log("=========== START ============");
	 	if (log)  console.log("year: " + startDateMoment.year() );
	 	if (log)  console.log("month: " + Number ( Number( startDateMoment.month() ) + 1 ) );
	 	if (log)  console.log("date: " + startDateMoment.date() );

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
	 				diffDays = startDateMoment.date() - endDateMoment.date(); 
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
	
	 	if (log)  console.log("validateStartBeforeEnd valid: " + bResult + " diffDays: " + diffDays); 

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
		  onChange: function(dates, el) {

		  	if (log) console.log(arguments, "Date changed event currentFocusId: " + currentFocusId);

		  	var selectedDate = dates[0];
		  	if (log) console.log("selected date is: " + selectedDate);

		  	var testDates = [];

		  	switch(currentFocusId){

		  			case "inputBaseStartDate" :

		  				var endDate = baseEndMoment._d;
		  				var startDate = selectedDate; // the change!
		  				
		  				testDates = [endDate, startDate]; 

		  				break;

		  			case "inputBaseEndDate" :
		  				var endDate = selectedDate; // the change!
		  				var startDate = baseStartMoment._d;

		  				testDates = [endDate, startDate]; 

		  				break;	

		  			case "inputCompareStartDate" :

		  				var baseEndDate = baseEndMoment._d; 
		  				var baseStartDate = baseStartMoment._d;

		  				var compareEndDate = compareEndMoment._d; 
		  				var compareStartDate = selectedDate; // the change!

		  				testDates = [baseEndDate, baseStartDate, compareEndDate, compareStartDate]; 

		  				break;
		  			case "inputCompareEndDate" :

		  				var baseEndDate = baseEndMoment._d; 
		  				var baseStartDate = baseStartMoment._d;

		  				var compareEndDate = selectedDate; // the change!
		  				var compareStartDate = compareStartMoment._d;

		  				console.log(" +++++ focussed on inputCompareEndDate +++++++++");

		  				testDates = [baseEndDate, baseStartDate, compareEndDate, compareStartDate]; 

		  				break;	

		  		};  

		  	var bValidDates = validateAllDates(testDates);

		  		// what is my curent focus?

		  	if (bValidDates)	{

		  		displayNoErrorMessage();
		  		
		  		switch(currentFocusId){

		  			case "inputBaseStartDate" :

		  				var endDate = baseEndMoment._d;
		  				var startDate = selectedDate; // the change!
		  				
		  				setBaseDate(startDate, endDate, "Start");
		  				setBaseRangeMessage([startDate, endDate]);

		  				calendars.DatePickerSetDate([ endDate, startDate ], true)

		  				break;

		  			case "inputBaseEndDate" :
		  				var endDate = selectedDate; // the change!
		  				var startDate = baseStartMoment._d;

		  				setBaseDate(startDate, endDate, "End");
		  				setBaseRangeMessage([startDate, endDate]);

		  				calendars.DatePickerSetDate([ endDate, startDate ], true)

		  				break;	

		  			case "inputCompareStartDate" :

		  				var baseEndDate = baseEndMoment._d; 
		  				var baseStartDate = baseStartMoment._d;

		  				var compareEndDate = compareEndMoment._d; 
		  				var compareStartDate = selectedDate; // the change!

		  				setCompareDate(compareStartDate, compareEndDate, "Start");
		  				setBaseRangeMessage([baseStartDate, baseEndDate, compareStartDate, compareEndDate]);

		  				console.log("all dates valid - should draw this compare start date");

		  				calendars.DatePickerSetDate([ baseEndDate, baseStartDate, compareEndDate, compareStartDate ], true);

		  				break;
		  			case "inputCompareEndDate" :

		  				var baseEndDate = baseEndMoment._d; 
		  				var baseStartDate = baseStartMoment._d;

		  				var compareEndDate = selectedDate; // the change!
		  				var compareStartDate = compareStartMoment._d;

		  				console.log( " --- finally --- ");

		  				setCompareDate(compareStartDate, compareEndDate, "End");
		  				setBaseRangeMessage([baseStartDate, baseEndDate, compareEndDate, compareStartDate ]);

		  				calendars.DatePickerSetDate([ baseEndDate, baseStartDate, compareStartDate, compareEndDate ], true);

		  				break;	

		  		};  

		  	}   
		  	
		}

	});

	// COMPARE INPUT RANGE 


	$("#inputCompareCheckbox").on("change", function(e) {
		//if (log)  console.log(e.currentTarget.checked);

		if ( e.currentTarget.checked ) {
			
			bCompareChecked = true; 

			if (null === compareStartMoment) {

				// 1. 
				var dates = ( bCustomBaseRange ) ? getPreviousCustomBaseRange() : [ previousRange[0]._d, previousRange[1]._d ];

				var compareNumStartDateStr = dates[0].getDate() + "/" + ( dates[0].getMonth() + 1 ) + "/" + dates[0].getFullYear();
			    var compareNumEndDateStr = dates[1].getDate() + "/" + ( dates[1].getMonth() + 1 ) + "/" + dates[1].getFullYear();

			    $("#inputCompareStartDate").val(compareNumStartDateStr);
			    $("#inputCompareEndDate").val(compareNumEndDateStr);

				// 2. get them
				compareStartMoment = getDateMoment( "CompareStart" );
				compareEndMoment = getDateMoment( "CompareEnd" );
				
			} 

			setCalendarsByPreviousCompareRange();

			
			$("#compareGroup").fadeIn();

		} else {

			bCompareChecked = false;

			
			if ( bCustomBaseRange ) setCalendarsByCurBaseRange(baseStartMoment._d, baseEndMoment._d)
			else setCalendarsByCurBaseRange();

			$("#compareGroup").fadeOut();

		}

	});

	$("#compareSelect").on("change", function(e){
		//if (log)  console.log("compare select - e.target.value: " + e.target.value);

		var idNum = Number(e.target.value);

		if ( idNum === 0) {
		 	//previousRange = previousRanges[idNum].range;
		 
		 	setCompareInputsDisabled();
	 		setCalendarsDisabled();

	 		setCalendarsByPreviousCompareRange(); 

	 		bCustomCompareRange = false; 

	 	} else {

	 		setCompareInputsEnabled();
	 		setCalendarsEnabled();

	 		setCurrentFocus("inputCompareEndDate");

	 		bCustomCompareRange = true; 
	 	}

	 });

	//////////////////////////////////////////////////////////////////////// BASE RANGE

	var setCalendarsByCurBaseRange = function( startDate, endDate ) {

		//if (log)  console.log(calendars, " setCalendarsByCurBaseRange ");

		startDate = (typeof startDate === "undefined") ? curRange[1]._d : startDate;
		endDate = (typeof endDate === "undefined") ? curRange[0]._d : endDate;

		setBaseDate(startDate, endDate, "Start" );
		setBaseDate(startDate, endDate, "End" );

		calendars.DatePickerSetDate([ endDate, startDate ], true);
	 	
		setBaseRangeMessage([startDate, endDate]);

	}

	//////////////////////////////////////////////////////////////////////// COMPARE RANGE 

	var getPreviousCustomBaseRange = function(){

		var diffDays = Number ( baseStartMoment.diff( baseEndMoment, "days") ) + 1;

		console.log("getPreviousCustomBaseRange diffDays: " + diffDays);

		var previousCompareStartMoment = moment().year( baseEndMoment.year() ).month( baseEndMoment.month() ).date( baseEndMoment.date() ).subtract(1, 'days');
		var previousCompareEndMoment = moment().year( baseEndMoment.year() ).month( baseEndMoment.month() ).date( baseEndMoment.date() ).subtract(diffDays, 'days');

		var previousCustomRange = [previousCompareStartMoment._d, previousCompareEndMoment._d];

		console.log(previousCustomRange, "getPreviousCustomBaseRange");

		return previousCustomRange; 
	}


	var setCalendarsByPreviousCompareRange = function() {

		if (log)  console.log("setCalendarsByPreviousCompareRange bCustomBaseRange: " + bCustomBaseRange + " vs bCustomCompareRange: " + bCustomCompareRange);

		var dates;

		if ( bCustomBaseRange && bCustomCompareRange ) {

			dates = [compareStartMoment._d, compareEndMoment._d];

		} else if ( !bCustomBaseRange && bCustomCompareRange ) {

			dates = [compareStartMoment._d, compareEndMoment._d];

	    } else if ( bCustomBaseRange && !bCustomCompareRange ) {
			dates =  getPreviousCustomBaseRange();
		} else {
			dates = [ previousRange[0]._d, previousRange[1]._d ];
		}

		
		var compareNumStartDateStr = dates[0].getDate() + "/" + (dates[0].getMonth() + 1) + "/" + dates[0].getFullYear();
	    var compareNumEndDateStr = dates[1].getDate() + "/" + (dates[1].getMonth() + 1) + "/" + dates[1].getFullYear();

	    $("#inputCompareStartDate").val(compareNumStartDateStr);
	    $("#inputCompareEndDate").val(compareNumEndDateStr);

	   	if (!bCustomBaseRange) setCalendarsByCurBaseRange();
         
 	    var baseStart = baseStartMoment._d;
 	    var baseEnd = baseEndMoment._d;
 	    
 	    var compareStart = dates[1];
 	    var comapareEnd = dates[0];

 	    calendars.DatePickerSetDate([ baseEnd, baseStart, comapareEnd, compareStart ], true);

 	    setBaseRangeMessage([ baseStart, baseEnd, compareStart, comapareEnd ]);

	}

	setCalendarsByCurBaseRange();
	

	// APPLY & CANCEL 

	$("#applyDates").on("click", function(){

		ir.introspect.app.msgBus.trigger("date:close"); 

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


	//if (log)  console.log(compareStartMoment, "compareStartMoment");


	// GLOBAL API FOR TESTING 

	window.drp.baseStartMoment = baseStartMoment;
	window.drp.baseEndMoment = baseEndMoment;

	window.drp.compareStartMoment = compareStartMoment;
	window.drp.compareEndMoment = compareEndMoment;
	
	window.drp.isDate = isDate;
	window.drp.validateStartBeforeEnd = validateStartBeforeEnd;
	window.drp.getDateMoment = getDateMoment;

	init();

});