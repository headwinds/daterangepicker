// credits 
// http://foxrunsoftware.github.io/DatePicker/
// http://www.dangrossman.info/2012/08/20/a-date-range-picker-for-twitter-bootstrap/

window.drp = {};

$(document).ready(function() {


	ir = (typeof ir !== "undefined") ? ir : { introspect: { app: 
															{ msgBus: { trigger: function(){} }, 
															appModel:{ bind: function(){} } 
															}
														  } 
											};

	ga = (typeof ga !== "undefined") ? ga : function(){};  


	//////////////////////////////////////////// VARIABLES

	var currentFocusId = null;
	var prevFocusId = null;

	var bShiftCalendar = false;

	var baseStartMoment = null;
	var baseEndMoment = null; 
	var compareStartMoment = null;
	var compareEndMoment = null;

	var bCustomBaseRange = false;
	var bCustomCompareRange = false;

	var bCompareChecked = false;
	
	var log = false;
	var limLog = true

	var dateIndex = 0;
	
	// BASE 

	var invalidMessageStr = 'Invalid: the "from:" date is after the "to:" date. Please click Reset to try again.';

	// 0 - last 7 days
	var last7DaysRange = [moment().subtract(6, 'days'), moment()];
	// 1 - last week
	var lastWeekRange = [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')];
	// 2 - last 30 days 
	var last30DaysRange = [moment().subtract(29, 'days'), moment()];
	// 3 - last month 
	var lastMonthRange = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];
	// 4 - last 3 months
	var last3MonthRange = [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month') ];
	// 5 - last 6 months
	var last6MonthRange = [moment().subtract(6, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];
	// 6 - 365 days
	var last365DaysRange = [moment().subtract(365, 'days'), moment()];
	// 7 - this year
	var thisYearRange =  [moment().startOf('year'), moment()];

	// COMPARE 

	// 0 - last 7 days 
	var previousPeriod7DaysRange = [moment().subtract(13, 'days'), moment().subtract(7, 'days')];
	// 1 - last week
	var previousPeriodLastWeekRange = [moment().subtract(2, 'week').startOf('week'), moment().subtract(2, 'week').endOf('week')];
	// 2 - last 30 days 
	var previousPeriod30DaysRange = [moment().subtract(59, 'days'), moment().subtract(30, 'days')];
	// 3 - last month 
	var previousPeriodLastMonthRange = [moment().subtract(2, 'month').startOf('month'), moment().subtract(2, 'month').endOf('month')];
	// 4 - last 3 months
	var previousPeriodlast3MonthRange = [moment().subtract(6, 'month').startOf('month'), moment().subtract(4, 'month').endOf('month')];
	// 5 - last 6 months
	var previousPeriodLast6MonthRange = [moment().subtract(12, 'month').startOf('month'), moment().subtract(7, 'month').endOf('month')];
	// 6 - 365 days
	var previousPeriod365DaysRange = [moment().subtract(730, 'days'), moment().subtract(366, 'days')];
	// 7 - this year
	var diffDaysThisYear = moment().diff( moment().startOf('year'), "days" ); 
	var previousThisYearStart = moment().subtract(1, 'year').endOf('year').subtract(diffDaysThisYear, 'days');
	var previousThisYearEnd = moment().subtract(1, 'year').endOf('year');

	var previousPeriodThisYearRange = [previousThisYearStart, previousThisYearEnd];

	//console.log(previousPeriodThisYearRange, "previousPeriodThisYearRange: ");

	
	var previousYearRange = [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')];
	

	/*
	var previousPeriod7DaysRange = [moment().subtract(7, 'days'), moment().subtract(13, 'days')];
	var previousPeriod30DaysRange = [moment().subtract(30, 'days'), moment().subtract(59, 'days')];
	var previousPeriod90DaysRange = [moment().subtract(90, 'days'), moment().subtract(179, 'days')];
	var previousPeriod180DaysRange = [moment().subtract(180, 'days'), moment().subtract(359, 'days')];
	var previousPeriod365DaysRange = [moment().subtract(365, 'days'), moment().subtract(729, 'days')];
	*/

	var baseRanges = [
		{ label: 'Last 7 Days', range: last7DaysRange, id: 0},
		{ label: 'Last Week', range: lastWeekRange, id: 1},
	    { label: 'Last 30 Days', range: last30DaysRange, id: 2},
	    { label: 'Last Month', range: lastMonthRange, id: 3},
	    { label: 'Last 3 Months', range: last3MonthRange, id: 4},
	    { label: 'Last 6 Months', range: last6MonthRange, id: 5},
	    { label: 'Last 365 Days', range: last365DaysRange, id: 6},
	    { label: 'This year', range: thisYearRange, id: 7}
    ]; 

    var previousRanges = [
   		 { label: 'Previous Last 7 Days', range: previousPeriod7DaysRange, id: 0},
	     { label: 'Previous Last Week', range: previousPeriodLastWeekRange, id: 1},
	     { label: 'Previous Last 30 Days', range: previousPeriod30DaysRange, id: 2},
	     { label: 'Previous Last Month', range: previousPeriodLastMonthRange, id: 3},
	     { label: 'Previous Last 3 Months', range: previousPeriodlast3MonthRange, id: 4},
	     { label: 'Previous Last 6 Months', range: previousPeriodLast6MonthRange, id: 5},
	     { label: 'Previous Last 365 Days', range: previousPeriod365DaysRange, id: 6},
	     { label: 'Previous Last Year', range: previousPeriodThisYearRange, id: 7}
    ]; 

   
    var defaultRange = baseRanges[2].range;
    var curRange = defaultRange;

    var previousRange = previousRanges[2].range; 

    // 1 DAY MODE

    var bOneDayMode = false; // defaults to true
 

	// BASE INPUT RANGE 

	var baseTo = new Date();
	var baseFrom = new Date(baseTo.getTime() - 1000 * 60 * 60 * 24 * 14);

	var baseRangeStr = "";

	var multipleHeight = $("#dateCardContainer").height();
	var oneDateHeight = 130;

	/////////////////////////////////////////// INIT

	var init = function(){

		setCalendarsByCurBaseRange();

		baseStartMoment = getDateMoment( "BaseStart" ); //getBaseStartDate();
		baseEndMoment = getDateMoment( "BaseEnd" );

		$("#compareGroup").hide();
		$("#prismContainer").hide();


		$("#multipleDayContainer").hide();
	

		//$("#testsContainer").hide();
		setAllDisabled();

		disableCompareSelect();

		setupEvents();

		// after every control is ready, run the tests
		if (typeof mocha !== "undefined" ) {
			//mocha.run();
		}

		$("#inputCompareCheckbox").attr("checked", false);


		displayNoErrorMessage();

		$("#shield").show(); // shields for preselected dates in IE


		// TESTING
		var bTesting = true;

		if ( ( document.domain === "headwinds.net" || document.domain === "localhost" ) && bTesting ) {
			setupOneDayCheck();

		
			var startDate = new Date();
			startDate.setDate(25);
			startDate.setMonth(6); 
			
			var endDate = new Date();
			//endDate.setDate(21);  

			var startCompareDate = new Date();
			startCompareDate.setDate(9); 
			startCompareDate.setMonth(6); 

			var endCompareDate = new Date(); 
			endCompareDate.setDate(24);
			endCompareDate.setMonth(3); 

			var baseRange = [startDate, endDate];
			var compareRange = [startDate, endDate, startCompareDate, endCompareDate];

			var bBaseMode = false;
			
			var rangeSelectIds = ["4","1"];

			setMode(bBaseMode, compareRange, rangeSelectIds);
			

		}
	
		
	};

	/*
	
	rangeSelectIds an array of either "0" to "7" for base or "0" or "1" for compare
	ie ["5", "1"];
	*/

	var setMode = function(bBaseMode, dates, rangeSelectIds ) {
		console.log("DateRangeViewController - setMode - bBaseMode: ", arguments);

		reset();
		
		if ( bBaseMode ) {

			bCompareChecked = false;

			setBaseDate( dates[0],null,"Start"); // set both start and end 
			setBaseDate( null, dates[1],"End");

			//var difObj = getRangeDiffDays( baseStartMoment, baseEndMoment ); 
			//selectBaseOption( difObj.option );

			selectBaseOption( rangeSelectIds[0] );

	    	curRange = [baseStartMoment, baseEndMoment]; // now safe to set the range after setting both start and end

	    	switch ( rangeSelectIds[0] ) {
	    		case "0" :
	    			previousRange = previousRanges[0].range;
	    			break;
	    		case "1" :
	    			previousRange = previousRanges[1].range;
	    			break;
	    		case "2" :
	    			previousRange = previousRanges[2].range;
	    			break;
	    		case "3" :
	    			previousRange = previousRanges[3].range;
	    			break;
	    		case "4" :
	    			previousRange = previousRanges[4].range;
	    			break;
	    		case "5" :
	    			previousRange = previousRanges[5].range;
	    			break;	
	    		case "6" :
	    			previousRange = previousRanges[6].range;
	    			break;	
	    		case "7" :
	    			previousRange = previousRanges[7].range;
	    			break;	
	    		case "8" :
	    			previousRange = previousRanges[8].range;
	    			break;						
	    		default :
	    			previousRange = previousPeriod30DaysRange;
	    			break;		

	    	}
	    	

	    	console.log("DateRangeViewController - setMode - previousRange: ", previousRange);

			drawDates(); 


		} else {
			
			bCompareChecked = true;

			var compareSelectId = rangeSelectIds[1];

			if ( compareSelectId === "2" ) compareSelectId = "0"; // default

			selectCompareOption( compareSelectId );

			setBaseDate( dates[0],null,"Start");
			setBaseDate( null, dates[1],"End");

			setCompareDate( dates[2],null,"Start");
			setCompareDate( null, dates[3],"End");

			//var difObj = getRangeDiffDays( baseStartMoment, baseEndMoment ); 
			//selectBaseOption( difObj.option );
			selectBaseOption( rangeSelectIds[0] );
			

			curRange = [baseStartMoment, baseEndMoment];
			//previousRange = [compareStartMoment, compareEndMoment]; 

			//previousRange = 

			drawDates(); 
		}
	}

	var testSetDates = function(){
		
		// 7 days
		
		/*
		last7DaysRange
		lastWeekRange
		last30DaysRange
		lastMonthRange
		last3MonthRange
		last6MonthRange
		last365DaysRange
		thisYearRange

		previousPeriod7DaysRange
		previousPeriodLastWeekRange
		previousPeriod30DaysRange
		previousPeriodLastMonthRange
		previousPeriodlast3MonthRange
		previousPeriodLast6MonthRange
		previousPeriod365DaysRange
		previousPeriodThisYearRange
		*/

		// 7 days test 
		//setDatesWithMomentRanges([last7DaysRange]); 

		// last weeek range
		//setDatesWithMomentRanges([lastWeekRange]); 

		// last 30 days
		//setDatesWithMomentRanges([last30DaysRange]); 

		// last month
		setDatesWithMomentRanges([lastMonthRange]);

		// last 3 month
		//setDatesWithMomentRanges([last3MonthRange]); 

		// last 6 month
		//setDatesWithMomentRanges([last6MonthRange]); 

		// last 365 days
		//setDatesWithMomentRanges([last365DaysRange]); 

		// this year 
		//setDatesWithMomentRanges([previousPeriodThisYearRange]); 



		//setDates();
	}

	var selectBaseOption = function( valStr ){
		$("#baseSelect select").val(valStr);
	}

	var selectCompareOption = function( valStr ){
		
		
		//$('#inputCompareCheckbox').prop('checked', true);
		$('#inputCompareCheckbox').click();
		//inputCompareCheckbox

		setTimeout( function(){
			$("#compareSelect select").val(valStr);
		}, 50);
		

	}

	var getRangeDiffDays = function(startDateMoment, endDateMoment) {

		var startDateMomentClone = startDateMoment.clone();
		var endDateMomentClone = endDateMoment.clone();

		var duration = moment.duration(endDateMomentClone.diff(startDateMomentClone));
		var days = Math.ceil( duration.asDays() );
		//var days = duration.asDays();

		var option = 0;

		var todayDate = new Date(); 

		var today =  todayDate.getMonth() + "-" + todayDate.getDate() + "-" + todayDate.getFullYear(); 

		var startDateNum = Number( endDateMoment._d );
		var startDate = new Date(startDateNum);

		var startDateStr =  startDate.getMonth() + "-" + startDate.getDate() + "-" + startDate.getFullYear(); 

		console.log("DateRangeViewController - getRangeDiffDays - Day diff: " + days);
		console.log("DateRangeViewController - getRangeDiffDays - startDateStr: " + startDateStr);
		console.log("DateRangeViewController - getRangeDiffDays - today: " + today);
		console.log("---------------------------------------------");

		if ( startDateStr === today && days === 6 ) {
			option = 0; 
		} else if ( days > 0 && days < 8 ) {
			option = 1; 
		} else if ( days === 29 && startDateStr === today) {
			option = 2;
		} else if ( days >= 8 && days <= 31  ) {
			option = 3;
		} else if ( days > 31 && days <= 93 ) {
			option = 4;
		} else if ( days > 93 && days <= 180 ) {
			option = 5;
		}  else if ( days > 180 && days <= 364 ) {
			option = 7;
		} else if ( days === 365 ) {
			option = 6;
		} else {
			option = 2;
		}

		
		return { days: days, option: option}; 
	}

	var setDatesWithMomentRanges = function( moments ) {

		if ( moments.length > 1 ) {

			var startBaseMoment = moments[0][0];
			var endBaseMoment = moments[0][1];

			var startCompareMoment = moments[1][0];
			var endCompareMoment = moments[1][1];

			var baseRangeDiffDays = getRangeDiffDays(startBaseMoment, endBaseMoment); 
			var baseRangeDiffDays = getRangeDiffDays(startCompareMoment, endCompareMoment); 


		} else {

			var startBaseMoment = moments[0][0];
			var endBaseMoment = moments[0][1];

			var diffDays = getRangeDiffDays(startBaseMoment, endBaseMoment);

			console.log("DateRangeViewController - setDatesWithMomentRanges - diffDays: " + diffDays);

		}

	}



	var setupOneDayCheck = function(){

		console.log("DateRangeViewController - setupOneDayCheck");

		$("#inputOneDayCheckbox").on("change", function(e) {
		
			bOneDayMode = ( e.currentTarget.checked ) ? false : true;

			if (bOneDayMode) {
				$("#multipleDayContainer").hide();
				$("#oneDayContainer").show();
				$("#dateCardContainer").height(oneDateHeight);
			} else {
				$("#multipleDayContainer").show();
				$("#oneDayContainer").hide();
				$("#dateCardContainer").height(multipleHeight)
			}
				
		});

		$("#oneDateSelect").on("change", function(e){
	 	
	 		var idNum = Number(e.target.value);

	 		var day;

	 		switch(idNum) {

	 			case 0 :
	 				day = moment().format("MM/DD/YYYY");
	 				break;
	 			case 1 : 
	 				day = moment().subtract(7, 'days').format("MM/DD/YYYY");
	 				break;	 
	 			case 2 :
	 				day = moment().subtract(2, 'weeks').format("MM/DD/YYYY");
	 				break;
	 			case 3 	:
	 				day = moment().subtract(1, 'months').format("MM/DD/YYYY");
	 				break;
	 			case 4 :
	 				day = "";
	 				break;	
	 		}

	 		console.log(idNum)


	 		//if (day !== "") $("#oneDayDate").val(date);
	 		//else $("#oneDayDate").

	 		$("#oneDayDate").val(day);

	 	});

	 	var today = moment().format("MM/DD/YYYY");
	 	$("#oneDayDate").val(today);
	 	$("#dateCardContainer").height(oneDateHeight);


	 	$("#inputOneDayCheckbox").click();

	 	//$("#dateCardContainer").css("height", "410px");
			
	}

	var reset = function(){

		console.log("---- reset ----")

		$("#baseRange").text("");
		$("#validationMessage").text("");

		if  ( $("#validationMessage").hasClass("errorMessage") ) $("#validationMessage").removeClass("errorMessage"); 

		$('#datepicker-calendar').DatePickerClear();

		// 
		baseStartMoment = null;
		baseEndMoment = null; 
		compareStartMoment = null;
		compareEndMoment = null;

		$("#baseSelect select").val("0");
		if  ( $("#baseSelect").hasClass("disableApply") ) $("#baseSelect").removeClass("disableApply"); 

		
		bCustomBaseRange = false;
		bCustomCompareRange = false;
		bCompareChecked = false;

		// reset to last 30 instead 7 days

		//curRange = last7DaysRange;
	    //previousRange = previousPeriod7DaysRange; 

	    curRange = last30DaysRange;
	    previousRange = previousPeriod30DaysRange; 

		setCalendarsByCurBaseRange();

		baseStartMoment = curRange[0]; //getDateMoment( "BaseStart" ); //getBaseStartDate();
		baseEndMoment = curRange[1]; //getDateMoment( "BaseEnd" );

		setBaseRangeMessage([baseStartMoment._d, baseEndMoment._d]);

		// remove focus
		if  ( $("#inputCompareEndDate").hasClass("compareRangeSelected") ) $("#inputCompareEndDate").removeClass("compareRangeSelected"); 
		if  ( $("#inputCompareStartDate").hasClass("compareRangeSelected") ) $("#inputCompareStartDate").removeClass("compareRangeSelected"); 
		if  ( $("#inputBaseEndDate").hasClass("baseRangeSelected") ) $("#inputCompareEndDate").removeClass("baseRangeSelected"); 
		if  ( $("#inputBaseStartDate").hasClass("baseRangeSelected") ) $("#inputBaseStartDate").removeClass("baseRangeSelected"); 

		if  ( $("#inputCompareEndDate").hasClass("disableApply") ) $("#inputCompareEndDate").removeClass("disableApply"); 
		if  ( $("#inputCompareStartDate").hasClass("disableApply") ) $("#inputCompareStartDate").removeClass("disableApply"); 
		if  ( $("#inputBaseEndDate").hasClass("disableApply") ) $("#inputCompareEndDate").removeClass("disableApply"); 
		if  ( $("#inputBaseStartDate").hasClass("disableApply") ) $("#inputBaseStartDate").removeClass("disableApply"); 

		removeErrorTxt(); 
		
		setAllDisabled();

		$("#baseSelect select").val("2");
		$("#compareSelect select").val("0");
		
		$('#inputCompareCheckbox').prop('checked', false);

		disableCompareSelect();
		enableCheckBox();

		/*
		enableBaseTo();
		enableCompareTo();
		enableBaseFrom();
		enableCompareFrom();
		*/


		setApplyEnabled();

		$("#compareGroup").hide();
	}

	var removeErrorTxt = function(){
		if  ( $("#inputCompareEndDate").hasClass("errorInputTxt") ) $("#inputCompareEndDate").removeClass("errorInputTxt"); 
		if  ( $("#inputCompareStartDate").hasClass("errorInputTxt") ) $("#inputCompareStartDate").removeClass("errorInputTxt"); 
		if  ( $("#inputBaseEndDate").hasClass("errorInputTxt") ) $("#inputBaseEndDate").removeClass("errorInputTxt"); 
		if  ( $("#inputBaseStartDate").hasClass("errorInputTxt") ) $("#inputBaseStartDate").removeClass("errorInputTxt"); 
		if  ( $("#validationMessage").hasClass("errorInputTxt") ) $("#validationMessage").removeClass("errorInputTxt"); 
	}


	 $("#baseSelect").on("change", function(e){
	 	
	 	var idNum = Number(e.target.value);

	 	//console.log("base select idNum: " + idNum);

	 	if ( idNum === 6 || idNum === 7 ) {
	 		var warningStr =  "<span class='warningRangeTxt'> Warning: </span> this year range may take a long time to load";
	 		$("#validationMessage").html(warningStr);
	 	} else {
	 		$("#validationMessage").html("");
	 	}

	 	if ( idNum === 8 ) {

	 		if (bCompareChecked) {
	 			reset();
	 			$("#baseSelect select").val(8);

	 		}

	 		console.log("DateRangeViewController - baseSelect - custom");

	 		bCustomBaseRange = true; 
	 		
	 		setBaseInputsEnabled();
	 		setCalendarsEnabled();

	 		disableCheckBox(); 
	 		disableBaseTo();

	 		disableCompareSelect();
	 		// focus on the first base bate
			setCurrentFocus("inputBaseStartDate");

			clearBaseDates();
		
			$("#validationMessage").text("Please enter 2 dates for your Base range before continuing");

			$("#shield").hide();

			return;

	 	} else {

	 		bCustomBaseRange = false; 

	 		setApplyEnabled(); 
	 		removeErrorTxt();

	 		curRange = baseRanges[idNum].range;
		 	previousRange = previousRanges[idNum].range;

		 	//console.log(curRange, "new curRange");
		 	//console.log(previousRange, "new previousRange");

		 	setBaseInputsDisabled();
	 		setCalendarsDisabled();

	 		enableCheckBox(); 
	 		enableCompareSelect();

	 		//calendars.DatePickerClear();

	 		$("#shield").show();

	 	}


	 	if (!bCompareChecked) {
		 		
		 	setCalendarsByCurBaseRange(); 

		} else {

		 	setCalendarsByPreviousCompareRange();
		 	//drawDates();
		}
	

		//if (log)  //console.log("baseSelect change bCompareChecked: " + bCompareChecked );
	 	

	 });

	 /////////////////////////////////////////// GETTERS & SETTERS

	 /////////////////////// BASE T0 & FROM

	 var disableBaseTo = function(){
	 	$("#inputBaseEndDate").addClass("disableApply");

	 	$("#inputBaseEndDate").prop('disabled',true);
	 }

	 var enableBaseTo = function(){
	 	$("#inputBaseEndDate").removeClass("disableApply");
	 	$("#inputBaseEndDate").removeClass("disableControl");

	 	$("#inputBaseEndDate").prop('disabled',false);

	 }

	 var disableBaseFrom = function(){
	 	$("#inputBaseStartDate").addClass("disableApply");

	 	$("#inputBaseStartDate").prop('disabled',true);
	 }

	 var enableBaseFrom = function(){
	 	$("#inputBaseStartDate").removeClass("disableApply");
	 	$("#inputBaseEndDate").removeClass("disableControl");

	 	$("#inputBaseEndDate").prop('disabled',false);
	 }

	 /////////////////////////////////////////////////// COMPARE T0 & FROM

	 var disableCompareTo = function(){
	 	$("#inputCompareEndDate").addClass("disableApply");

	 	$("#inputCompareEndDate").prop('disabled',true);
	 }

	 var enableCompareTo = function(){
	 	$("#inputCompareEndDate").removeClass("disableApply");
	 	$("#inputBaseEndDate").removeClass("disableControl");

	 	$("#inputCompareEndDate").prop('disabled',false);
	 	$("#inputBaseEndDate").prop('disabled',false);
	 }

	 var disableCompareFrom = function(){
	 	$("#inputCompareStartDate").addClass("disableApply");

	 	$("#inputCompareStartDate").prop('disabled',true);
	 }

	 var enableCompareFrom = function(){
	 	$("#inputCompareStartDate").removeClass("disableApply");
	 	$("#inputBaseEndDate").removeClass("disableControl");

	 	$("#inputCompareStartDate").prop('disabled',false);
	 	$("#inputBaseEndDate").prop('disabled',false);
	 }

	 /////////////////////////////////////////////////// CHECKBOX

	 var disableCheckBox = function(){
	 	
	 	$("#inputCompareCheckbox").addClass("disableApply");
	 	$("#compareRange").addClass("disableApply");

	 	$("#inputCompareCheckbox").prop('disabled',true);
	 	$("#compareRange").prop('disabled',true);

	 }

	 var enableCheckBox = function(){
	 	$("#inputCompareCheckbox").removeClass("disableApply");
	 	$("#compareRange").removeClass("disableApply");

	 	$("#inputCompareCheckbox").prop('disabled',false);
	 	$("#compareRange").prop('disabled',false);

	 }

	 var disableCompareSelect = function() {
	 	$("#compareSelect").addClass("disableApply");

	 	$("#compareSelect").prop('disabled',true);
	 }

	 var enableCompareSelect = function() {
	 	$("#compareSelect").removeClass("disableApply");
	 	$("#compareSelect").prop('disabled',false);
	 }

	 var setApplyDisabled = function(){
	 	$("#applyDates").addClass("disableApply");
	 	$("#applyDates").prop('disabled',true);
	 }

	 var setApplyEnabled = function(){
	 	$("#applyDates").removeClass("disableApply");
	 	$("#applyDates").prop('disabled',false);
	 }

	 var setCompareInputsDisabled = function() {

	 	//if (log)  //console.log("setCompareInputsDisabled");

	 	$("#inputCompareStartDate").addClass("disableControl");
	 	$("#inputCompareEndDate").addClass("disableControl");

	 	$("#inputCompareStartDate").prop('disabled',true);
	 	$("#inputCompareStartDate").prop('disabled',true);
	 }

	 var setCompareInputsEnabled = function() {
	 	$("#inputCompareStartDate").removeClass("disableControl");
	 	$("#inputCompareEndDate").removeClass("disableControl");

	 	$("#inputCompareStartDate").removeClass("disableApply");
	 	$("#inputCompareEndDate").removeClass("disableApply");

	 	$("#inputCompareStartDate").prop('disabled',false);
	 	$("#inputCompareEndDate").prop('disabled',false);


	 }

	 var setBaseInputsDisabled = function() {
	 	$("#inputBaseStartDate").addClass("disableControl");
	 	$("#inputBaseEndDate").addClass("disableControl");

		$("#inputBaseStartDate").prop('disabled',true);
	 	$("#inputBaseEndDate").prop('disabled',true);
	 }

	 var setBaseInputsEnabled = function() {
	 	$("#inputBaseStartDate").removeClass("disableControl");
	 	$("#inputBaseEndDate").removeClass("disableControl");

	 	$("#inputBaseStartDate").removeClass("disableApply");
	 	$("#inputBaseEndDate").removeClass("disableApply");

	 	$("#inputBaseStartDate").prop('disabled',false);
	 	$("#inputBaseEndDate").prop('disabled',false);
	 }

	 var setCalendarsDisabled = function() {
	 	$("#datepicker-calendar").addClass("disableControl");


	 	$("#datepicker-calendar .datepickerGoPrev").css("cursor", "pointer");
	 	$("#datepicker-calendar .datepickerGoNext").css("cursor", "pointer");
	 	$("#datepicker-calendar .datepickerGoPrev").css("pointer-events", "all");
	 	$("#datepicker-calendar .datepickerGoNext").css("pointer-events", "all");

	 	$("#datepicker-calendar").prop('disabled',true); 

	 }

	 var setCalendarsEnabled = function(){
	 	$("#datepicker-calendar").removeClass("disableControl");

	 	$("#datepicker-calendar").prop('disabled',false); 
	 }

	 var setAllDisabled = function(){
	 	setCompareInputsDisabled();
	 	setBaseInputsDisabled();
	 	setCalendarsDisabled();
	 }

	 var setCurrentFocus = function( inputId ) {

	 	//console.log("setCurrentFocus inputId: " + inputId)

		currentFocusId = inputId;
	 	var curInputEl = $("#" + currentFocusId);

	 	if (  curInputEl.hasClass("errorInputTxt") ) curInputEl.removeClass("errorInputTxt"); 
	 	
	 	// ...then focus here <-- this interferes with selecting a date with the cursor requiring 2 clicks
	 	// I think I need to transfer focus to the calender as the user begins to mouse over it if I want to keep this code 
	 	// but for now I'll remove it 
	 	/*
	 	var el = $("#" + currentFocusId).get(0);
	    var elemLen = el.value.length;
	    el.selectionStart = elemLen;
	    el.selectionEnd = elemLen;
	    el.focus();
	    el.setSelectionRange(0,elemLen);
		*/

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

	 	//console.log(arguments, " setBaseDate ");
	 	//// //if (log)   //console.log(baseStartMoment, " setBaseDate baseStartMoment");

	 	var baseDate = (posStr === "Start") ? startDate : endDate; 

		var baseNumDateStr = ( baseDate.getMonth() + 1 ) + "/" + baseDate.getDate() + "/" + baseDate.getFullYear();

		//console.log(baseDate, " baseDate setBaseDate");
	    
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


	 var clearBaseDates = function(){

	 	  //console.log("clearBaseDates");
	 	
	 	$("#inputBaseStartDate").val("");
	 	$("#inputBaseEndDate").val("");

	 	$('#datepicker-calendar').DatePickerClear();

	 	baseStartMoment = null;
	 	baseEndMoment = null;

	 	setApplyDisabled();

	 	setBaseRangeMessage();

	 	$("#validationMessage").text("Please enter 2 dates for your Base range before continuing");

	 }

	 var clearCompareDates = function(){
	 	$("#inputCompareStartDate").val("");
	 	$("#inputCompareEndDate").val("");

	 	calendars.DatePickerClear();

	 	var clearCompareDates = [ baseStartMoment._d, baseEndMoment._d ];
		calendars.DatePickerSetDate(clearCompareDates, bShiftCalendar);

	 	compareStartMoment = null;
	 	compareEndMoment = null;

	 	setBaseRangeMessage(clearCompareDates); 

	 	setApplyDisabled();

	 	$("#validationMessage").text("Please enter 2 dates for your Compare range.");
	 }

	 var setCompareDate = function( startDate, endDate, posStr ){

		//console.log(arguments, "setCompareDate posStr: " + posStr);

	 	var compareDate = (posStr === "Start") ? startDate : endDate; 

		var compareNumDateStr = ( Number(compareDate.getMonth()) + 1 ) + "/" + compareDate.getDate() + "/" + compareDate.getFullYear();
	    $("#inputCompare" + posStr + "Date").val(compareNumDateStr);

	    if ( null === compareStartMoment ) compareStartMoment = moment(); //getDateMoment("CompareStart");
	    if ( null === compareEndMoment ) compareEndMoment =  moment(); ///getDateMoment("CompareEnd");

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

	 	//console.log(arguments, " setBaseRangeMessage ");

	 	var baseRangeStr;

	 	 if ( null === baseStartMoment) {
	 	
	    	baseRangeStr = "<span class='baseRangeTxt'>Base Range: Please select 2 dates</span>";

		    $("#baseRange").html( baseRangeStr );

		 
		    return; 
		}

		dates[1] = ( typeof dates[1] !== "number" ) ? dates[1] : new Date( dates[1] ); 
		dates[0] = ( typeof dates[0] !== "number" ) ? dates[0] : new Date( dates[0] ); 

	 	var baseStartDateStr = dates[0].getMonthName(true) + ' ' + dates[0].getDate()+ ', '+ dates[0].getFullYear();
	    var baseEndDateStr = dates[1].getMonthName(true) + ' ' + dates[1].getDate() + ', '+ dates[1].getFullYear();


	    baseRangeStr = "<span class='baseRangeTxt'>" + baseStartDateStr + ' - ' + baseEndDateStr + "</span>";

	    if (bCompareChecked && null === compareStartMoment) {
	 	
	    	var customAStr =  "<span class='compareRangeTxt'>Compare Range: Please select 2 dates</span>";
	    	var customJoinStr = "<span style='font-size:12px; color: #666'> - To -  </span>" ;
		    var customFullStr = customAStr + customJoinStr + baseRangeStr;

		    $("#baseRange").html( customFullStr ) ;
	    	

	 		return; 	
	 	}


	    if ( bCompareChecked ) {

	    	var compareStartDateStr; 
	    	var compareEndDateStr;

		    if ( dates.length > 2 ) {

		    	compareStartDateStr = dates[2].getMonthName(true) + ' ' + dates[2].getDate() + ', '+ dates[2].getFullYear();
		    	compareEndDateStr = dates[3].getMonthName(true) + ' ' + dates[3].getDate() + ', '+ dates[3].getFullYear();

		    } else {
		    	compareStartDateStr = compareStartMoment.format("MMMM") + ' ' + compareStartMoment.date() + ', '+ compareStartMoment.year();
		    	compareEndDateStr = compareEndMoment.format("MMMM") + ' ' + compareEndMoment.date() + ', '+ compareEndMoment.year();
		    }

		    if ( compareStartDateStr === "NaN undefined, NaN" ) compareStartDateStr = " Please select compare start date ";
		    if ( compareEndDateStr === "NaN undefined, NaN" ) compareEndDateStr = " Please select compare end date";

		    var compareRangePartAStr =  "<span class='compareRangeTxt'>" + compareStartDateStr   + " - " +  compareEndDateStr + "</span>";
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

      	//console.log(dateArray, "getDateMoment dateStr: " + dateStr + " posStr: " + posStr);

      	var dateMoment = moment();
      	
      	dateMoment.month( dateArray[0] - 1);
      	dateMoment.date( dateArray[1] );
      	dateMoment.year( dateArray[2] );

      	//if (log)  //console.log(dateMoment, "getDateMoment posStr: " + posStr)
		
      	return dateMoment; 

	 }



	 /////////////////////////////////////////// EVENTS


	 var setupEvents = function(){

	 	var checkAlpha = function(event){

	 		var code = (event.keyCode ? event.keyCode : event.which);

	 		////console.log("keycode : " + event.keyCode);

	 		/*
			 if (!(
		            (code >= 48 && code <= 57) //numbers
		            || (code == 47) //forward slash 
		            || (code == 45) //dash
		        )
		        || (code == 46 && $(this).val().indexOf('.') != -1)
		       )

	 		*/

		    if (!(
		            (code >= 48 && code <= 57) //numbers
		            || (code == 47) //forward slash 
		        )
		        || (code == 46 && $(this).val().indexOf('.') != -1)
		       )
		    event.preventDefault();
	 	}


	 	ir.introspect.app.appModel.bind('change:viewMode', function(){

	 		//console.log("DateRangeViewController heard view mode change");
	 		// reset(); 

	 	});


	 	// FOCUS START BASE
	 	$("#inputBaseStartDate").on("focus", function(){
	 		//// //if (log)   //console.log("focus");
	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	$("#inputBaseStartDate").on("keypress", function(event){
	 		//// //if (log)   //console.log("focus");
	 		//setCurrentFocus( $(this).attr("id") );
	 		// check for alpha
	 		checkAlpha(event);

	 		// enter 
	 		var code = event.keyCode || event.which;
			 if(code == 13) { 
			   newDateAdded("BaseStart");
			 }
	 	});

	 	// BLUR 

	 	$("#inputBaseStartDate").on("blur", function(){
			// //if (log)   //console.log("blur start");
			newDateAdded("BaseStart");
	 	});

	 	/*
	 	$("#inputBaseStartDate").bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			 if(code == 13) { 
			   newDateAdded("BaseStart");
			 }
		});
		*/

	 	// FOCUS END BASE

	 	$("#inputBaseEndDate").on("focus", function(){
	 		// //if (log)   //console.log("focus end");
	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR

	 	$("#inputBaseEndDate").on("blur", function(){
			// //if (log)   //console.log("blur end");
			 newDateAdded("BaseEnd");
	 	});

	 	// ENTER

	 	$("#inputBaseEndDate").on('keypress', function(e) {

	 		checkAlpha(e);

			var code = e.keyCode || e.which;
			 if(code == 13) { 
			    newDateAdded("BaseEnd");
			 }
		});


	 	// FOCUS START COMPARE

	 	$("#inputCompareStartDate").on("focus", function(){
	 		//// //if (log)   //console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR

	 	$("#inputCompareStartDate").on("blur", function(){
			//// //if (log)   //console.log("blur");
			 newDateAdded("CompareStart");
	 	});

	 	// ENTER

	 	$("#inputCompareStartDate").on('keypress', function(e) {

	 		checkAlpha(e);

			var code = e.keyCode || e.which;
			 if(code == 13) { 
			    newDateAdded("CompareStart");
			 }
		});

	 	// FOCUS END COMPARE

	 	$("#inputCompareEndDate").on("focus", function(){
	 		//// //if (log)   //console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});	

	 	// BLUR

	 	$("#inputCompareEndDate").on("blur", function(){
			//// //if (log)   //console.log("blur");
			newDateAdded("CompareEnd");
	 	});

	 	// ENTER

	 	$("#inputCompareEndDate").on('keypress', function(e) {

	 		checkAlpha(e);

			var code = e.keyCode || e.which;
			 if(code == 13) { 
			   newDateAdded("CompareEnd");
			 }
		});

	 	//$("#inputBaseStartDate")

	 }

	 //////////////////////////////////////////// HANDLERS


	 var drawDates = function(){

	 	console.log(" -- DRAW DATES -- bCompareChecked: " + bCompareChecked);
	 	
	 	if (!bCompareChecked) {
	 		
	 		setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d  ]);
			calendars.DatePickerSetDate([ baseStartMoment._d, baseEndMoment._d ], bShiftCalendar);
	 	
	 	} else {
	 		
	 		
	 	
	 		console.log(" baseStartMoment._d: " + baseStartMoment._d ); 
			console.log(" baseEndMoment._d: " + baseEndMoment._d ); 
			
			if (null !== compareStartMoment) console.log(" compareStartMoment._d: " + compareStartMoment._d ); 
			if (null !== compareEndMoment) console.log(" compareEndMoment._d: " + compareEndMoment._d ); 

			if ( null !== compareEndMoment ) {

				calendars.DatePickerSetDate([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, compareEndMoment._d  ], bShiftCalendar);

				setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, compareEndMoment._d  ]);

			} else if ( null !== compareStartMoment ) {

				var cloneTime = baseStartMoment.clone(); 

				var tempCompareEndDate = cloneTime.subtract(1, "days");

				calendars.DatePickerSetDate([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, tempCompareEndDate._d  ], bShiftCalendar);

				//setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d  ]);
				console.log("ok tempCompareEndDate: ", tempCompareEndDate);

				setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, tempCompareEndDate._d  ]);
			} 


			
		}
	 }

	 // BaseStart - FROM: 

	 var baseStartCaseHandler = function(startDate) { 

	 	setBaseDate(startDate, null, "Start");

	 	var bValidBaseFrom = validateBaseFrom();

	 	//console.log("baseStartCaseHandler bValidBaseFrom: " + bValidBaseFrom);

		if ( bValidBaseFrom ) {

			// disable both inputs 
			setBaseInputsDisabled();

			disableBaseFrom(); 
			
			enableBaseTo(); 

			baseStartMoment = getDateMoment("BaseStart");

			//console.log("calendars change baseStartMoment._d: " + baseStartMoment._d);

			setCurrentFocus("inputBaseEndDate");
			// don't draw until both are valid
			calendars.DatePickerSetDate(baseStartMoment._d, bShiftCalendar)

		} else {

		}
  	}

	 // BaseEnd - TO: 

	 var baseEndCaseHandler = function(endDate){

	 	console.log(endDate, "baseEndCaseHandler")
	 	
	 	setBaseDate(null, endDate, "End");

  		baseEndMoment = getDateMoment("BaseEnd");

		var bValidBaseTo = validateBaseTo();

		console.log(baseEndMoment, "baseEndCaseHandler bValidBaseTo: " + bValidBaseTo); 

		if ( bValidBaseTo ) {

			disableBaseTo(); 
			setCalendarsDisabled();

			enableCheckBox();

			if (null !== baseStartMoment) {
				//console.log("about to draw base dates");
				drawDates();
				setApplyEnabled();

			}

			//console.log("! CUSTOM BASE CHECK !---------");
			//console.log(baseStartMoment, "baseStartMoment");
			//console.log(baseEndMoment, "baseEndMoment");


		} else {
			
			// only clear the calendar after the first click so it can forget about the second date in the range and start again 
			$('#datepicker-calendar').DatePickerClear();

		}

	 }

	 // Compare end 

	 var compareEndCaseHandler = function(endDate){
	 	
	 	setCompareDate(null, endDate, "End");

		// ok we now have 2 dates for the compare range
		// are they valid?

		var validObj = validateCompareTo();

		if (validObj.bTestCompareStartvsCompareEnd && validObj.bTestCompareEndVsBaseStart ) {
			// disable both inputs 
			
			compareEndMoment = getDateMoment("CompareEnd");

			// but is the end within or after the base range?!
			var bTestCompareEndVsBaseStart = validateStartBeforeEnd(compareEndMoment, baseStartMoment, true, "validating compareEndMoment to baseStartMoment" );

			if ( bTestCompareEndVsBaseStart ) {

				// bring opacity back to 1
				enableCompareFrom();
				enableCompareTo();

				// then disable them
				setCompareInputsDisabled();
				setCalendarsDisabled();

				enableCheckBox(); 
				setApplyEnabled(); 

				$("#baseSelect").removeClass("disableApply"); 

				drawDates();

			} else {

				displayBaseRangeError('Invalid compare "from" date. Please click RESET to try again ');
				setApplyDisabled(); 
			}
	
		} 

	 }

	 // Compare start

	 var compareStartCaseHandler = function(startDate) {

	 	console.log("DateRangeViewController - startDate: " + startDate);

		setCompareDate(startDate, null, "Start");

		var bCompareFromValid = validateCompareFrom(); 

		console.log("DateRangeViewController - bCompareFromValid: " + bCompareFromValid);

		if ( bCompareFromValid ) {

			// but is the compare start before the base range end?

			// but is the end within or after the base range?!
			var bTestCompareStartVsBaseStart = validateStartBeforeEnd(compareStartMoment, baseStartMoment, true, "validating compareStartMoment to baseStartMoment" );

			if ( bTestCompareStartVsBaseStart ) {

				compareEndMoment = null; // should still be null here!	

				disableCompareFrom(); 
				setCurrentFocus("inputCompareEndDate");
				enableCompareTo(); 

				//compareEndMoment = getDateMoment("CompareEnd"); // ok to set it because it the same and fakes the draw
 
				drawDates(); // actually don't draw them because the final date has not been set
				//calendars.DatePickerSetDate(compareStartMoment._d, bShiftCalendar)

			} else {
				displayBaseRangeError('Invalid compare "from" date. Please click RESET to try again ');
				setApplyDisabled(); 
			}

		} else {
			// only clear the calendar after the first click so it can forget about the second date in the range and start again 
			//$('#datepicker-calendar').DatePickerClear();
		}
	 }

	 // on enter or blur test the new date
	 var newDateAdded = function( posStr ){

	 	 //console.log("newDateAdded posStr: " + posStr);

	 	var inputBox = $("#input" + posStr + "Date");

	 	var enteredDate = inputBox.val();
			   // 
		var checkDateObj = isDate(enteredDate);

		//console.debug("newDateAdded enteredDate: " + enteredDate);
		//console.log(checkDateObj.date, " checked date");


	    // Walk through Base From to Base To first

	    if (checkDateObj.isValid) {

		   	switch(posStr) {

		   		case "BaseStart" :

		   			baseStartCaseHandler(checkDateObj.date);
		   			break; 

		   		case "BaseEnd" :

		   			baseEndCaseHandler(checkDateObj.date); 
		   			break; 

		   		case "CompareStart" : 

		   			compareStartCaseHandler(checkDateObj.date); 
		   			break; 
		   		
		   		case "CompareEnd" : 

		  			compareEndCaseHandler(checkDateObj.date);
		   			break;

		   	}

	   } else {
	   		
	   		//setInvalidDate(posStr);

	   		inputBox.addClass("errorInputTxt");
	   		displayBaseRangeError("Invalid Date: Please click RESET to try again");
	   		//setCurrentFocus("input" + posStr + "Date");
	   }
	

	 };

	 var onCompareInputEnterHandler = function( posStr ){
	 	var enteredDate = $("#inputCompare" + posStr + "Date").val();
			   // 
		var bValid = isDate(enteredDate).isValid;

	    if (bValid) {
	   		
	   		if (posStr == "Start") compareStartMoment = getDateMoment("CompareStart");
	   		else compareEndMoment = getDateMoment("CompareEnd");
	   		
	   		setComapreDate(compareStartMoment._d, compareEndMoment._d, "Start");
	   		calendars.DatePickerSetDate([ baseEndMoment._d, baseStartMoment._d, compareEndMoment._d, compareStartMoment._d ], bShiftCalendar);

	   		displayNoErrorMessage();

	    } else {
	    	
	    	var displayPos = (posStr !== "Start") ? "from:" : "to:";
	   		displayBaseRangeError('The '+ displayPos +' date is not properly formated (DD/MM/YYYY)'); 
	    }
	 };

	 /////////////////////////////////////////// VALIDATION

	 

	 var isDate = function( newDateStr ) {

	 	//// //if (log)   //console.log("isDate newDateStr: " + newDateStr)

	 	var parms = newDateStr.split(/[\.\-\/]/);

	 	var yearStr = String(parms[2]);

	 	if ( yearStr.length > 4 ) {
	 		return isValid = false;
	 	}

		var yyyy = parseInt(yearStr,10);

		// US clients want mm/dd/yyyy not dd/mm/yyyy
		/*
		var mm   = parseInt(parms[1],10);
		var dd   = parseInt(parms[0],10);
		*/
		var mm   = parseInt(parms[0],10);
		var dd   = parseInt(parms[1],10);

		var date = new Date(yyyy,mm-1,dd,0,0,0,0);

		var isValid = (date.getMonth()+1) && dd === date.getDate() && yyyy === date.getFullYear();
		
		// //if (log)   //console.log("isDate yyyy: " + yyyy);
		// //if (log)   //console.log("isDate date: " + date);

		return {isValid: isValid, date: date};

	
	 };

	 //////////////////////////////////////////////////////////////////////// VALIDATION 

	 var validateStartBeforeEnd = function( startDateMoment, endDateMoment, bValidateLog, logMessage ){

	 	//console.log(arguments, " validateStartBeforeEnd ");

	 	//var diffStart = moment( [ startDateMoment.year(), startDateMoment.month(), startDateMoment.date() ] );
	 	//var diffEnd =  moment( [ endDateMoment.year(), endDateMoment.month(), endDateMoment.date() ] );
	 	if (bValidateLog) {
	 		console.log("+ validateStartBeforeEnd +");
	 		console.log("what: " + logMessage);
		 	console.log("START ============");
		 	console.log("year: " + startDateMoment.year() );
		 	console.log("month: " + Number ( Number( startDateMoment.month() ) + 1 ) );
		 	console.log("date: " + startDateMoment.date() );

		 	console.log("END ==========");
		 	console.log("year: " + endDateMoment.year() );
		 	console.log("month: " + Number ( Number( endDateMoment.month() ) + 1 ) );
		 	console.log("date: " + endDateMoment.date() );
	 	}

	 	var yearsDiff = endDateMoment.year() - startDateMoment.year();
	 	
	 	
	 	var monthsDiff = endDateMoment.month() - startDateMoment.month();
	 	console.log(monthsDiff, 'months' );
	 	

	 	var bResult = false;

	 	if ( yearsDiff >= 1 ) {

	 		if (bValidateLog) console.log(yearsDiff, 'years diff - all good' );

	 		//valid 
	 		bResult = true; 
	 		return bResult;

	 	} else {

		 	if ( monthsDiff >= 1 ) {

		 		//valid 
		 		bResult = true; 
		 		return bResult;

		 	} else {

		 		var daysDiff =  Number( endDateMoment.date() ) - Number( startDateMoment.date() );
		 		if (bValidateLog) console.log(daysDiff, 'days' );

		 		// be able to pick same day! 

		 		if ( daysDiff >= 0 ) {
		 			//valid 
		 			bResult = true; 

		 		} else {

		 			// invalid 
		 			bResult = false; 
		 		}

		 	}

		 }
	
	 	// //if (log)   //console.log("validateStartBeforeEnd valid: " + bResult + " diffDays: " + diffDays); 

	 	if ( !bResult ) {

	 		setApplyDisabled();

	 		displayBaseRangeError(invalidMessageStr);

	 		setCalendarsDisabled();

	 	} else {
	 		setApplyEnabled();
	 		displayNoErrorMessage();
	 	} 

	 	return bResult;
	 };

	 var validateBaseFrom = function(){

	 	var baseFromValid = false;

	 	//console.log(baseStartMoment, "<--baseStartMoment validateBaseFrom");

	 	if (null !== baseStartMoment) {

			// hmmmm - this is the first date so there is nothing to compare it against

		} else {
			// it's custom base range mode and the user still needs to set a second date 
			baseFromValid = true;
		}

	  	// if compare check 

	  	return baseFromValid; 
	 };

	 var validateBaseTo = function(){

	 	var baseToValid = false;

	 	// simple 2 date validation
	 	// is the from date after the to date?

	 	if (null !== baseStartMoment) {

		 	baseToValid = validateStartBeforeEnd(baseStartMoment, baseEndMoment, false, "validating baseStartMoment to baseEndMoment"); 

		 	if (!baseToValid) {

				displayBaseRangeError(invalidMessageStr);
			}

		 	//console.log("validateBaseTo 1 valid? " + baseToValid); 

		 	// complex 3 date validation with compare checked	
		 	if ( bCompareChecked ) {
		 		baseToValid = validateStartBeforeEnd(baseStartMoment, compareStartMoment, false, "validating baseStartMoment to compareStartMoment"); 

		 		if (!baseToValid) {
					displayBaseRangeError(invalidMessageStr);
				}

		 	}

		 	//console.log("validateBaseFrom 2 valid? " + baseToValid); 

		 	if (baseToValid ) {
				displayNoErrorMessage();
			}

		} else {
			// it's custom base range mode and the user still needs to set a second date 
			$("#validationMessage").text(" ");

			enableCompareSelect();


			baseToValid = true;
		}
	

	 	return baseToValid; 
	 };


	 var validateCompareFrom = function() {
	 	

	 	var bTestCompareEndVsBaseEnd = false;

	 	if (!bCustomCompareRange) {
		 	bTestCompareEndVsBaseEnd= validateStartBeforeEnd(baseEndMoment, compareEndMoment, false, "validating baseEndMoment to compareEndMoment" );
		 
		 	
		 	if (bTestCompareEndVsBaseEnd ) {
				displayNoErrorMessage();
			}

			if (!bTestCompareEndVsBaseEnd) {
				displayBaseRangeError(invalidMessageStr);
			}

		} else {
			bTestCompareEndVsBaseEnd = true;
		}

	 	return bTestCompareEndVsBaseEnd;
	 };

	 var validateCompareTo = function(){

	 	var bTestCompareStartvsCompareEnd = false;
	 	var bTestCompareEndVsBaseStart = false;

	 	if (null !== compareStartMoment ) {

	 		console.log("validating compare to")

		 	bTestCompareStartvsCompareEnd =  validateStartBeforeEnd(compareStartMoment, compareEndMoment, true, "validating compareStartMoment to compareEndMoment"); 
			bTestCompareEndVsBaseStart = validateStartBeforeEnd(compareEndMoment, baseStartMoment, false, "validating compareEndMoment to baseStartMoment");

			//console.log("validateCompareTo b1: " + bTestCompareStartvsCompareEnd + " b2: " + bTestCompareStartVsBaseEnd);

			if (!bTestCompareStartvsCompareEnd) {
				displayBaseRangeError(invalidMessageStr);
			}

			if (!bTestCompareEndVsBaseStart) {
				displayBaseRangeError(invalidMessageStr);
			}

			if (bTestCompareStartvsCompareEnd && bTestCompareEndVsBaseStart ) {
				displayNoErrorMessage();
			}
		} else {

			return { bTestCompareStartvsCompareEnd: true, bTestCompareStartVsBaseEnd: true }
		}

		return { bTestCompareStartvsCompareEnd: bTestCompareStartvsCompareEnd, bTestCompareEndVsBaseStart: bTestCompareEndVsBaseStart }

	 };

	 var displayNoErrorMessage = function() {

	 	if ( $("#validationMessage").hasClass("errorMessage") ) $("#validationMessage").removeClass("errorMessage");

	 	$("#validationMessage").addClass("validMessage");
	 	$("#validationMessage").text('Please click Apply to continue');
	 }

	 var displayBaseRangeError = function( errorMsgStr ){

	 	errorMsgStr = ( typeof errorMsgStr !== "undefined" ) ? errorMsgStr : 'Invalid Base Range: the "to:" date occurs before or on the "from:" date';

	 	$("#validationMessage").addClass("errorMessage");
	 	$("#validationMessage").text(errorMsgStr);

	 };

	 
	// 3 CALENDARS 

	var getDateFromCalendarDates = function( dates, posStr ) {

		var calendarDate; 

		if ( dates.length === 2 ) {

			if ( posStr === "start" ) {
				calendarDate = dates[0];
			} else {
				
				if ( String(dates[3]) === "Invalid Date" ) {
					compareStartDate = dates[1];

					var fixCompareMoment = moment().month( compareStartDate.getMonth() ).day( compareStartDate.getDate() ).subtract(1, 'days'); 
					calendarDate = fixCompareMoment._d;

					//console.log("W I L D C A R D");

				} else {
					calendarDate = dates[1];
				}	
			}

		} else {

			calendarDate = dates[0];

		}	

		return calendarDate; 
	}

	var onCalendarsChange = function(dates, el) {

	  //console.log(arguments, "Date changed event currentFocusId: " + currentFocusId);

	  	var bBaseFocus = ( currentFocusId.indexOf("Base") !== - 1);

	  	var fromDate = dates[0];
	  	var toDate = dates[1];

	  	var testDates = [];

	  	switch(currentFocusId) {

  			case "inputBaseStartDate" :

  				var compareStartDate = getDateFromCalendarDates(dates, "start");
  				
  				// this fixes an odd edge case if a user leaves the process after only picking the first date
  				if ( String(compareStartDate) === "Invalid Date" ) compareStartDate = dates[1];

  				baseStartCaseHandler(compareStartDate); 

  				break;

  			case "inputBaseEndDate" :
  				
  				var baseEndDate = getDateFromCalendarDates(dates, "end"); 
  				baseEndCaseHandler(baseEndDate); 

  				break;	

  			case "inputCompareStartDate" :

  				var compareStartDate = getDateFromCalendarDates(dates, "start"); 
  				compareStartCaseHandler(compareStartDate);
  				
  				break;

  			case "inputCompareEndDate" :

  				var compareEndDate = getDateFromCalendarDates(dates, "end"); 
  				compareEndCaseHandler(compareEndDate); 

  				break;	

	  	};  
	};   

	var to = new Date();
	var from = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 14);

	var calendars = $('#datepicker-calendar').DatePicker({
		  inline: true,
		  date: [from, to],
		  calendars: 3,
		  mode: 'range',
		  onRangeChange: function(){
		  	// //if (log)  //console.log(arguments, "Calendars range change")
		  }, 
		  onChange: onCalendarsChange,
		  	
	});

	// COMPARE INPUT RANGE 


	$("#inputCompareCheckbox").on("change", function(e) {
		
		console.log("++++++++++++++++++++++++++++++++++++++++++");
		console.log("DateRangeViewController - compare clicked");
		console.log("DateRangeViewController - baseStartMoment: ", baseStartMoment);
		console.log("DateRangeViewController - baseEndMoment: ", baseEndMoment);
		console.log("DateRangeViewController - compareStartMoment: ", compareStartMoment);
		console.log("DateRangeViewController - compareEndMoment: ", compareEndMoment);

		var curTargetChecked = e.currentTarget.checked;

		console.log("DateRangeViewController - curTargetChecked: " + curTargetChecked);
		console.log("DateRangeViewController - bCustomBaseRange: " + curTargetChecked);


		if ( curTargetChecked ) {
			
			bCompareChecked = true; 

			//console.log(compareStartMoment, "compare checked - what is compareStartMoment?");

			if (null === compareStartMoment && !bCustomBaseRange ) {

				// 1. 
				// I can't call getPreviousCustomBaseRange() until compareStartMoment is defined!

				//var dates = ( bCustomBaseRange ) ? getPreviousCustomBaseRange() : [ previousRange[0]._d, previousRange[1]._d ];

				//var dates = ( baseStartMoment !== null ) ? [ baseStartMoment._d, baseEndMoment._d ] : [ previousRange[0]._d, previousRange[1]._d ];
				var dates = [ previousRange[0]._d, previousRange[1]._d ];
				var compareNumStartDateStr = dates[0].getDate() + "/" + ( dates[0].getMonth() + 1 ) + "/" + dates[0].getFullYear();
			    var compareNumEndDateStr = dates[1].getDate() + "/" + ( dates[1].getMonth() + 1 ) + "/" + dates[1].getFullYear();

			    $("#inputCompareStartDate").val(compareNumStartDateStr);
			    $("#inputCompareEndDate").val(compareNumEndDateStr);

				// 2. get them
				compareStartMoment = getDateMoment( "CompareStart" );
				compareEndMoment = getDateMoment( "CompareEnd" );
	

				
			} 

			setCalendarsByPreviousCompareRange();

			enableCompareSelect();
			//$("#compareGroup").show();
			$("#compareGroup").css("display", "inline-block");

		} else {

			bCompareChecked = false;

			
			if ( bCustomBaseRange ) setCalendarsByCurBaseRange(baseStartMoment._d, baseEndMoment._d)
			else setCalendarsByCurBaseRange();

			disableCompareSelect();
			$("#compareGroup").hide();

		}

	});

	$("#compareSelect").on("change", function(e){
		//// //if (log)   //console.log("compare select - e.target.value: " + e.target.value);

		var idNum = Number(e.target.value);

		if ( idNum === 0) {
		 	//previousRange = previousRanges[idNum].range;
		 	bCustomCompareRange = false; 

		 	enableCheckBox(); 
		 
		 	setCompareInputsDisabled();
	 		
	 		// the base range could be in custom mode
	 		if (!bCustomBaseRange) setCalendarsDisabled();

	 		// revert possible custom date back to previous
	 		//compareStartMoment = getDateMoment("CompareStart");
	 		//compareEndMoment = getDateMoment("CompareEnd");
	 		
	 		if (bCustomBaseRange) {
	 			
	 			// do nothing... don't set compare dates yet since setCalendarsByPreviousCompareRange() will do that

	 		} else {
	 			

	 			setCompareDate(previousRange[0]._d, null, "Start");
	 			setCompareDate(null, previousRange[1]._d, "End");
	 		}


	 		setCalendarsByPreviousCompareRange(); 

	 		displayNoErrorMessage();
	 		setApplyEnabled(); 

	 		$("#baseSelect").removeClass("disableApply"); 

	 		$("#shield").show();

	 	} else {

	 		bCustomCompareRange = true; 

	 		disableCheckBox();

	 		setCompareInputsEnabled();
	 		
	 		setCalendarsEnabled();

	 		disableCompareTo();

	 		$("#baseSelect").addClass("disableApply"); 
	 		//disableCompareFrom();

	 		// focus on the first base bate
			setCurrentFocus("inputCompareStartDate");

			//clearCompareDates();

			$("#shield").hide();
			 	
	 		
	 	}

	 });

	//////////////////////////////////////////////////////////////////////// BASE RANGE

	var setCalendarsByCurBaseRange = function( startDate, endDate ) {

		//console.log(arguments, " setCalendarsByCurBaseRange ");

		startDate = (typeof startDate === "undefined") ? curRange[0]._d : startDate;
		endDate = (typeof endDate === "undefined") ? curRange[1]._d : endDate;

		//console.log(startDate, " setCalendarsByCurBaseRange startDate");
		//console.log(endDate, " setCalendarsByCurBaseRange endDate");

		setBaseDate(startDate, null, "Start" );
		setBaseDate(null, endDate, "End" );

		baseStartMoment = getDateMoment("BaseStart");
		baseEndMoment = getDateMoment("BaseEnd"); 

		setBaseRangeMessage([startDate, endDate]);
		calendars.DatePickerSetDate([ startDate, endDate ], bShiftCalendar);
	 	
		

	};

	//////////////////////////////////////////////////////////////////////// COMPARE RANGE 

	var getPreviousCustomBaseRange = function(){

		var diffDays = Number( baseEndMoment.diff( baseStartMoment, "days") ) + 1;

		//console.log("getPreviousCustomBaseRange diffDays: " + diffDays);

		var previousCompareEndMoment = moment().date( baseStartMoment.date() ).month( baseStartMoment.month() ).year( baseStartMoment.year() ).subtract(1, 'days');
		var previousCompareStartMoment = moment().date( baseStartMoment.date() ).month( baseStartMoment.month() ).year( baseStartMoment.year() ).subtract(diffDays, 'days');

		var previousCustomRange = [ previousCompareStartMoment._d, previousCompareEndMoment._d ];

		//console.log(previousCustomRange, "getPreviousCustomBaseRange check compareStartMoment new");
		//console.log(baseStartMoment, "getPreviousCustomBaseRange check baseStartMoment");
		//console.log(baseEndMoment, "getPreviousCustomBaseRange check baseStartMoment");
		
		setCompareDate(previousCompareStartMoment._d, null, "Start" );
		setCompareDate(null, previousCompareEndMoment._d, "End" );

		compareStartMoment = getDateMoment("CompareStart");
		compareEndMoment = getDateMoment("CompareEnd"); 

		return previousCustomRange; 
	};

	var removeCompareState = function(){

		$("#compareSelect select").val("0");
		bCustomCompareRange = false;

		//$('#inputCompareCheckbox').prop('checked', false);

	}


	var setCalendarsByPreviousCompareRange = function() {

		//console.log("setCalendarsByPreviousCompareRange bCustomBaseRange: " + bCustomBaseRange + " vs bCustomCompareRange: " + bCustomCompareRange);

		var dates;

		if( bCustomBaseRange && !bCustomCompareRange ) {

			dates = getPreviousCustomBaseRange();
			// compare moments are already set now...

		
		} else {
			
			dates = [ previousRange[0]._d, previousRange[1]._d ];
			
			removeCompareState();

			setBaseDate(curRange[0]._d, null, "Start");
			setBaseDate(null, curRange[1]._d, "End");

			baseStartMoment = getDateMoment("BaseStart");
			baseEndMoment = getDateMoment("BaseEnd"); 
			
			var compareNumStartDateStr = dates[0].getDate() + "/" + (dates[0].getMonth() + 1) + "/" + dates[0].getFullYear();
			var compareNumEndDateStr = dates[1].getDate() + "/" + (dates[1].getMonth() + 1) + "/" + dates[1].getFullYear();
			
		    $("#inputCompareStartDate").val(compareNumStartDateStr);
		    $("#inputCompareEndDate").val(compareNumEndDateStr);

		   	//if (!bCustomBaseRange) setCalendarsByCurBaseRange();
	         
	 	    var compareStart = dates[0];
	 	    var comapareEnd = dates[1];

	 	    setCompareDate(compareStart, null, "Start");
			setCompareDate(null, comapareEnd, "End");

			compareStartMoment = getDateMoment("CompareStart"); 
			compareEndMoment = getDateMoment("CompareEnd");
		}

 	    drawDates();

	};

	
	// APPLY & CANCEL 

	$("#applyDates").on("click", function(){

		console.log("DateRangeViewController - applying dates...");

		ir.introspect.app.msgBus.trigger("date:close"); 

		var inputBaseStartMoment = getDateMoment("BaseStart");
		var inputBaseEndMoment = getDateMoment("BaseEnd");
		
		var inputCompareStartMoment = (bCompareChecked) ? getDateMoment("CompareStart") : null;
		var inputCompareEndMoment = (bCompareChecked) ? getDateMoment("CompareEnd") : null;

		// don't trust these variables - get the actually dates that the users seeing the input boxes
		//var baseStartDate = baseStartMoment._d;
		//var baseEndDate = baseEndMoment._d;
		//var compareStartDate = (null !== compareStartMoment) ? compareStartMoment._d : null;
		//var compareEndDate = (null !== compareEndMoment) ? compareEndMoment._d : null;

		var baseStartDate = inputBaseStartMoment._d;
		var baseEndDate = inputBaseEndMoment._d;
		var compareStartDate = (null !== inputCompareStartMoment) ? inputCompareStartMoment._d : null;
		var compareEndDate = (null !== inputCompareEndMoment) ? inputCompareEndMoment._d : null;

		// need to ensure all the data are the full day 23:59:59
		baseStartDate.setHours(0,0,0);
		baseEndDate.setHours(23,59,59);
		
		if (null !== compareStartDate) compareStartDate.setHours(0,0,0);
		if (null !== compareEndDate) compareEndDate.setHours(23,59,59);
		
		var data = { baseStartDate: baseStartDate, 
					 baseEndDate: baseEndDate, 
					 baseSelectId: $("#baseSelect select").val(),
					 compareStartDate: compareStartDate, 
					 compareEndDate: compareEndDate,
					 compareMode: bCompareChecked,
					 compareSelectId: $("#compareSelect select").val()};

		//ir.introspect.app.msgBus.trigger('applyDates');
		ir.introspect.app.msgBus.trigger('date:apply', data);


		if (undefined !== ga) ga('send', 'event', 'Tool Bar', 'click', 'apply dates');
			
		
	}); 

	$("#close-date").on("click", function(){
		ir.introspect.app.msgBus.trigger("date:close"); 
	});

	$("#cancelDates").on("click", function(){
		//ir.introspect.app.msgBus.trigger("date:close"); 
		reset();
	}); 

	//// //if (log)   //console.log(compareStartMoment, "compareStartMoment");


	// GLOBAL API FOR TESTING 

	window.drp.baseStartMoment = baseStartMoment;
	window.drp.baseEndMoment = baseEndMoment;

	window.drp.compareStartMoment = compareStartMoment;
	window.drp.compareEndMoment = compareEndMoment;
	
	window.drp.isDate = isDate;
	window.drp.validateStartBeforeEnd = validateStartBeforeEnd;
	window.drp.getDateMoment = getDateMoment;

	window.drp.setMode = setMode;



	init();

});