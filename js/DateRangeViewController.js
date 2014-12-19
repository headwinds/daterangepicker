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

	/*
      <option value="1">Last Week</option>
	  <option value="2">Last 7 days</option>
	  <option value="3">Last 30 days</option>
	  <option value="4">Last Month</option>
	  <option value="5">Last 3 Months</option>
	  <option value="6">Last 6 Months</option>
	  <option value="7">Last 365 Days</option>
	  <option value="8">This year</option>
	  <option value="9">Custom Range</option>
	*/

	
	// var last90DaysRange = [moment().subtract(89, 'days'), moment()];
	// var last180DaysRange = [moment().subtract(179, 'days'), moment()];
	
	// BASE 

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
	var previousPeriod30DaysRange = [moment().subtract(60, 'days'), moment().subtract(30, 'days')];
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

	console.log(previousPeriodThisYearRange, "previousPeriodThisYearRange: ");

	
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

   
    var defaultRange = baseRanges[0].range;
    var curRange = defaultRange;

    var previousRange = previousRanges[0].range; 


	// BASE INPUT RANGE 

	var baseTo = new Date();
	var baseFrom = new Date(baseTo.getTime() - 1000 * 60 * 60 * 24 * 14);

	var baseRangeStr = "";

	/////////////////////////////////////////// INIT

	var init = function(){

		setCalendarsByCurBaseRange();

		baseStartMoment = getDateMoment( "BaseStart" ); //getBaseStartDate();
		baseEndMoment = getDateMoment( "BaseEnd" );

		setBaseRangeMessage([baseStartMoment._d, baseEndMoment._d]);

		$("#compareGroup").hide();
		$("#prismContainer").hide();
	

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
		
	};

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

		curRange = last7DaysRange;
	    previousRange = previousPeriod7DaysRange; 

		setCalendarsByCurBaseRange();

		baseStartMoment = getDateMoment( "BaseStart" ); //getBaseStartDate();
		baseEndMoment = getDateMoment( "BaseEnd" );

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

		if  ( $("#inputCompareEndDate").hasClass("errorInputTxt") ) $("#inputCompareEndDate").removeClass("errorInputTxt"); 
		if  ( $("#inputCompareStartDate").hasClass("errorInputTxt") ) $("#inputCompareStartDate").removeClass("errorInputTxt"); 
		if  ( $("#inputBaseEndDate").hasClass("errorInputTxt") ) $("#inputBaseEndDate").removeClass("errorInputTxt"); 
		if  ( $("#inputBaseStartDate").hasClass("errorInputTxt") ) $("#inputBaseStartDate").removeClass("errorInputTxt"); 

		setAllDisabled();

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


	 $("#baseSelect").on("change", function(e){
	 	
	 	var idNum = Number(e.target.value);

	 	console.log("base select idNum: " + idNum);

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

			return;

	 	} else {

	 		bCustomBaseRange = false; 

	 		setApplyEnabled(); 

	 		curRange = baseRanges[idNum].range;
		 	previousRange = previousRanges[idNum].range;

		 	console.log(curRange, "new curRange");
		 	console.log(previousRange, "new previousRange");

		 	setBaseInputsDisabled();
	 		setCalendarsDisabled();

	 		enableCheckBox(); 
	 		enableCompareSelect();

	 		//calendars.DatePickerClear();

	 	}


	 	if (!bCompareChecked) {
		 		
		 	setCalendarsByCurBaseRange(); 

		} else {

		 	setCalendarsByPreviousCompareRange();
		 	//drawDates();
		}
	

		if (log) console.log("baseSelect change bCompareChecked: " + bCompareChecked );
	 	

	 });

	 /////////////////////////////////////////// GETTERS & SETTERS


	 /////////////////////// BASE T0 & FROM

	 var disableBaseTo = function(){
	 	$("#inputBaseEndDate").addClass("disableApply");
	 }

	 var enableBaseTo = function(){
	 	$("#inputBaseEndDate").removeClass("disableApply");
	 	$("#inputBaseEndDate").removeClass("disableControl");
	 }

	 var disableBaseFrom = function(){
	 	$("#inputBaseStartDate").addClass("disableApply");
	 }

	 var enableBaseFrom = function(){
	 	$("#inputBaseStartDate").removeClass("disableApply");
	 	$("#inputBaseEndDate").removeClass("disableControl");
	 }

	 /////////////////////////////////////////////////// COMPARE T0 & FROM

	 var disableCompareTo = function(){
	 	$("#inputCompareEndDate").addClass("disableApply");
	 }

	 var enableCompareTo = function(){
	 	$("#inputCompareEndDate").removeClass("disableApply");
	 	$("#inputBaseEndDate").removeClass("disableControl");
	 }

	 var disableCompareFrom = function(){
	 	$("#inputCompareStartDate").addClass("disableApply");
	 }

	 var enableCompareFrom = function(){
	 	$("#inputCompareStartDate").removeClass("disableApply");
	 	$("#inputBaseEndDate").removeClass("disableControl");
	 }

	 /////////////////////////////////////////////////// CHECKBOX

	 var disableCheckBox = function(){
	 	
	 	$("#inputCompareCheckbox").addClass("disableApply");
	 	$("#compareRange").addClass("disableApply");

	 }

	 var enableCheckBox = function(){
	 	$("#inputCompareCheckbox").removeClass("disableApply");
	 	$("#compareRange").removeClass("disableApply");
	 }

	 var disableCompareSelect = function() {
	 	$("#compareSelect").addClass("disableApply");
	 }

	 var enableCompareSelect = function() {
	 	$("#compareSelect").removeClass("disableApply");
	 }

	 var setApplyDisabled = function(){
	 	$("#applyDates").addClass("disableApply");
	 }

	 var setApplyEnabled = function(){
	 	$("#applyDates").removeClass("disableApply");
	 }

	 var setCompareInputsDisabled = function() {

	 	if (log) console.log("setCompareInputsDisabled");

	 	$("#inputCompareStartDate").addClass("disableControl");
	 	$("#inputCompareEndDate").addClass("disableControl");
	 }

	 var setCompareInputsEnabled = function() {
	 	$("#inputCompareStartDate").removeClass("disableControl");
	 	$("#inputCompareEndDate").removeClass("disableControl");

	 	$("#inputCompareStartDate").removeClass("disableApply");
	 	$("#inputCompareEndDate").removeClass("disableApply");
	 }

	 var setBaseInputsDisabled = function() {
	 	$("#inputBaseStartDate").addClass("disableControl");
	 	$("#inputBaseEndDate").addClass("disableControl");
	 }

	 var setBaseInputsEnabled = function() {
	 	$("#inputBaseStartDate").removeClass("disableControl");
	 	$("#inputBaseEndDate").removeClass("disableControl");

	 	$("#inputBaseStartDate").removeClass("disableApply");
	 	$("#inputBaseEndDate").removeClass("disableApply");
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

	 	console.log("setCurrentFocus inputId: " + inputId)

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

	 	console.log(arguments, " setBaseDate ");
	 	//// if (log)  console.log(baseStartMoment, " setBaseDate baseStartMoment");

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

	 var clearBaseDates = function(){

	 	if (limLog)  console.log("clearBaseDates");
	 	
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
		calendars.DatePickerSetDate(clearCompareDates, false);

	 	compareStartMoment = null;
	 	compareEndMoment = null;

	 	setBaseRangeMessage(clearCompareDates); 

	 	setApplyDisabled();

	 	$("#validationMessage").text("Please enter 2 dates for your Compare range.");
	 }

	 var setCompareDate = function( startDate, endDate, posStr ){

		console.log(arguments, "setCompareDate posStr: " + posStr);

	 	var compareDate = (posStr === "Start") ? startDate : endDate; 

		var compareNumDateStr = compareDate.getDate() + "/" + ( Number(compareDate.getMonth()) + 1 ) + "/" + compareDate.getFullYear();
	    $("#inputCompare" + posStr + "Date").val(compareNumDateStr);

	    if ( null === compareStartMoment ) compareStartMoment = getDateMoment("CompareStart");
	    if ( null === compareEndMoment ) compareEndMoment = getDateMoment("CompareEnd");

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

	 	console.log(arguments, " setBaseRangeMessage ");

	 	var baseRangeStr;

	 	 if ( null === baseStartMoment) {
	 	
	    	baseRangeStr = "<span class='baseRangeTxt'>? - ?</span>";

		    $("#baseRange").html( baseRangeStr );

		 
		    return; 
		}

		dates[1] = ( typeof dates[1] !== "number" ) ? dates[1] : new Date( dates[1] ); 
		dates[0] = ( typeof dates[0] !== "number" ) ? dates[0] : new Date( dates[0] ); 

	 	var baseStartDateStr = dates[0].getDate()+' '+dates[0].getMonthName(true)+', '+ dates[0].getFullYear();
	    var baseEndDateStr = dates[1].getDate()+' '+dates[1].getMonthName(true)+', '+ dates[1].getFullYear();

	    baseRangeStr = "<span class='baseRangeTxt'>" + baseStartDateStr + ' - ' + baseEndDateStr + "</span>";

	    if (bCompareChecked && null === compareStartMoment) {
	 	
	    	var customAStr =  "<span class='compareRangeTxt'>? - ?</span>";
	    	var customJoinStr = "<span style='font-size:12px; color: #666'> - To -  </span>" ;
		    var customFullStr = customAStr + customJoinStr + baseRangeStr;

		    $("#baseRange").html( customFullStr ) ;
	    	

	 		return; 	
	 	}


	    if ( bCompareChecked ) {

	    	var compareStartDateStr; 
	    	var compareEndDateStr;

		    if ( dates.length > 2 ) {

		    	compareStartDateStr = dates[2].getDate()+' '+dates[2].getMonthName(true)+', '+ dates[2].getFullYear();
		    	compareEndDateStr = dates[3].getDate()+' '+dates[3].getMonthName(true)+', '+ dates[3].getFullYear();

		    } else {
		    	compareStartDateStr = compareStartMoment.date()+' '+compareStartMoment.format("MMMM")+', '+ compareStartMoment.year();
		    	compareEndDateStr = compareEndMoment.date()+' '+compareEndMoment.format("MMMM")+', '+ compareEndMoment.year();
		    }

		    if ( compareStartDateStr === "NaN undefined, NaN" ) compareStartDateStr = " ? ";
		    if ( compareEndDateStr === "NaN undefined, NaN" ) compareEndDateStr = " ? ";

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

      	if (log) console.log(dateArray, "getDateMoment dateStr: " + dateStr + " posStr: " + posStr);

      	var monthNumDown = Number(dateArray[1]) -1; 

      	var dateNum = Number(dateArray[0]);
      	var monthNum = monthNumDown;

      	var yearNum = Number(dateArray[2]);

      	var dateMoment = moment();
      	
      	dateMoment.date(dateNum);
      	dateMoment.month(monthNum);
      	dateMoment.year(yearNum)

      	if (log) console.log(dateMoment, "getDateMoment posStr: " + posStr)
		
      	return dateMoment; 

	 }



	 /////////////////////////////////////////// EVENTS


	 var setupEvents = function(){


	 	ir.introspect.app.appModel.bind('change:viewMode', function(){

	 		console.log("DateRangeViewController heard view mode change");
	 		// reset(); 

	 	});


	 	// FOCUS START BASE
	 	$("#inputBaseStartDate").on("focus", function(){
	 		//// if (log)  console.log("focus");
	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR 

	 	$("#inputBaseStartDate").on("blur", function(){
			// if (log)  console.log("blur start");
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
	 		// if (log)  console.log("focus end");
	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR

	 	$("#inputBaseEndDate").on("blur", function(){
			// if (log)  console.log("blur end");
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
	 		//// if (log)  console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});

	 	// BLUR

	 	$("#inputCompareStartDate").on("blur", function(){
			//// if (log)  console.log("blur");
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
	 		//// if (log)  console.log("focus");

	 		setCurrentFocus( $(this).attr("id") );
	 	});	

	 	// BLUR

	 	$("#inputCompareEndDate").on("blur", function(){
			//// if (log)  console.log("blur");
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

	 var drawDates = function(){
	 	
	 	if (!bCompareChecked) {
	 		setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d  ]);
			calendars.DatePickerSetDate([ baseStartMoment._d, baseEndMoment._d ], false);
	 	} else {
	 		setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, compareEndMoment._d  ]);
			calendars.DatePickerSetDate([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, compareEndMoment._d  ], false);
		}
	 }

	 // BaseStart - FROM: 

	 var baseStartCaseHandler = function(startDate) { 

	 	setBaseDate(startDate, null, "Start");

	 	var bValidBaseFrom = validateBaseFrom();

	 	console.log("baseStartCaseHandler bValidBaseFrom: " + bValidBaseFrom);

		if ( bValidBaseFrom ) {

			// disable both inputs 
			setBaseInputsDisabled();

			disableBaseFrom(); 
			
			enableBaseTo(); 

			baseStartMoment = getDateMoment("BaseStart");

			console.log("calendars change baseStartMoment._d: " + baseStartMoment._d);

			setCurrentFocus("inputBaseEndDate");
			// don't draw until both are valid
			calendars.DatePickerSetDate(baseStartMoment._d, false)

		} else {

		}
  	}

	 // BaseEnd - TO: 

	 var baseEndCaseHandler = function(endDate){
	 	
	 	setBaseDate(null, endDate, "End");

  		baseEndMoment = getDateMoment("BaseEnd");

		var bValidBaseTo = validateBaseTo();

		console.log("baseEndCaseHandler bValidBaseTo: " + bValidBaseTo); 

		if ( bValidBaseTo ) {

			disableBaseTo(); 
			setCalendarsDisabled();

			enableCheckBox();

			if (null !== baseStartMoment) {
				console.log("about to draw base dates");
				drawDates();

			}

			console.log("! CUSTOM BASE CHECK !---------");
			console.log(baseStartMoment, "baseStartMoment");
			console.log(baseEndMoment, "baseEndMoment");


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

		if (validObj.bTestCompareStartvsCompareEnd && validObj.bTestCompareStartVsBaseEnd ) {
			// disable both inputs 
			
			compareEndMoment = getDateMoment("CompareEnd");

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
		}

	 }

	 // Compare start

	 var compareStartCaseHandler = function(startDate) {

		setCompareDate(startDate, null, "Start");

		var bCompareFromValid = validateCompareFrom(); 

		if ( bCompareFromValid ) {

			compareEndMoment = null; // should still be null here!	

			disableCompareFrom(); 
			setCurrentFocus("inputCompareEndDate");
			enableCompareTo(); 

			compareEndMoment = getDateMoment("CompareEnd");

			//don't draw until the end date is established
			// or set the compareEnd to the same so it looks
			drawDates();

		} else {
			// only clear the calendar after the first click so it can forget about the second date in the range and start again 
			//$('#datepicker-calendar').DatePickerClear();
		}
	 }

	 // on enter or blur test the new date
	 var newDateAdded = function( posStr ){

	 	if (limLog) console.log("newDateAdded posStr: " + posStr);

	 	var inputBox = $("#input" + posStr + "Date");

	 	var enteredDate = inputBox.val();
			   // 
		var checkDateObj = isDate(enteredDate);

		console.debug("newDateAdded enteredDate: " + enteredDate);
		console.log("newDateAdded bValid: " + checkDateObj.isValid);


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
	   		calendars.DatePickerSetDate([ baseEndMoment._d, baseStartMoment._d, compareEndMoment._d, compareStartMoment._d ], true);

	   		displayNoErrorMessage();

	    } else {
	    	
	    	var displayPos = (posStr !== "Start") ? "from:" : "to:";
	   		displayBaseRangeError('The '+ displayPos +' date is not properly formated (DD/MM/YYYY)'); 
	    }
	 };

	 /////////////////////////////////////////// VALIDATION

	 

	 var isDate = function( newDateStr ) {

	 	//// if (log)  console.log("isDate newDateStr: " + newDateStr)

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
		
		// if (log)  console.log("isDate yyyy: " + yyyy);
		// if (log)  console.log("isDate date: " + date);

		return {isValid: isValid, date: date};

	
	 };

	 //////////////////////////////////////////////////////////////////////// VALIDATION 

	 var validateStartBeforeEnd = function( startDateMoment, endDateMoment ){

	 	console.log(arguments, " validateStartBeforeEnd ");

	 	//var diffStart = moment( [ startDateMoment.year(), startDateMoment.month(), startDateMoment.date() ] );
	 	//var diffEnd =  moment( [ endDateMoment.year(), endDateMoment.month(), endDateMoment.date() ] );

	 	if (limLog)  console.log("=========== START ============");
	 	if (limLog)  console.log("year: " + startDateMoment.year() );
	 	if (limLog)  console.log("month: " + Number ( Number( startDateMoment.month() ) + 1 ) );
	 	if (limLog)  console.log("date: " + startDateMoment.date() );

	 	if (limLog)  console.log("========== END ==========");
	 	if (limLog)  console.log("year: " + endDateMoment.year() );
	 	if (limLog)  console.log("month: " + Number ( Number( endDateMoment.month() ) + 1 ) );
	 	if (limLog)  console.log("date: " + endDateMoment.date() );
	 	
	 	
	 	var monthsDiff = endDateMoment.diff(startDateMoment, "months");
	 	console.log(monthsDiff, 'months' );
	 	

	 	var bResult = false;

	 	if ( monthsDiff >= 1 ) {

	 		//valid 
	 		bResult = true; 

	 	} else {

	 		var daysDiff = endDateMoment.diff(startDateMoment, "days");
	 		console.log(daysDiff, 'days' );

	 		if ( daysDiff >= 1 ) {

	 			//valid 
	 			bResult = true; 

	 		} else {

	 			// invalid 
	 			bResult = false; 
	 		}

	 	}
	
	 	// if (log)  console.log("validateStartBeforeEnd valid: " + bResult + " diffDays: " + diffDays); 

	 	if ( !bResult ) {

	 		setApplyDisabled();

	 		displayBaseRangeError('Invalid: the "from:" date is before the "to:" date. Please click Reset to try again. ');

	 		setCalendarsDisabled();

	 	} else {
	 		setApplyEnabled();
	 		displayNoErrorMessage();
	 	} 

	 	return bResult;
	 };

	 var validateBaseFrom = function(){

	 	var baseFromValid = false;

	 	console.log(baseStartMoment, "<--baseStartMoment validateBaseFrom");

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

		 	baseToValid = validateStartBeforeEnd(baseStartMoment, baseEndMoment); 

		 	if (!baseToValid) {

				displayBaseRangeError('Invalid: the "from:" date is before the "to:" date. Please click Reset to try again. ');
			}

		 	console.log("validateBaseTo 1 valid? " + baseToValid); 

		 	// complex 3 date validation with compare checked	
		 	if ( bCompareChecked ) {
		 		baseToValid = validateStartBeforeEnd(baseStartMoment, compareStartMoment); 

		 		if (!baseToValid) {
					displayBaseRangeError('Invalid: the "from:" date is before the "to:" date. Please click Reset to try again. ');
				}

		 	}

		 	console.log("validateBaseFrom 2 valid? " + baseToValid); 

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
		 	bTestCompareEndVsBaseEnd= validateStartBeforeEnd(baseEndMoment, compareEndMoment );
		 
		 	
		 	if (bTestCompareEndVsBaseEnd ) {
				displayNoErrorMessage();
			}

			if (!bTestCompareEndVsBaseEnd) {
				displayBaseRangeError('Invalid: the "from:" date is before the "to:" date. Please click Reset to try again. ');
			}

		} else {
			bTestCompareEndVsBaseEnd = true;
		}

	 	return bTestCompareEndVsBaseEnd;
	 };

	 var validateCompareTo = function(){

	 	var bTestCompareStartvsCompareEnd = false;
	 	var bTestCompareStartVsBaseEnd = false;

	 		
	 	if (null !== compareStartMoment && !bCustomCompareRange) {

		 	bTestCompareStartvsCompareEnd =  validateStartBeforeEnd(compareStartMoment, compareEndMoment); 
			bTestCompareStartVsBaseEnd = validateStartBeforeEnd(baseEndMoment, compareStartMoment);

			console.log("validateCompareTo b1: " + bTestCompareStartvsCompareEnd + " b2: " + bTestCompareStartVsBaseEnd);


			if (!bTestCompareStartvsCompareEnd) {

				displayBaseRangeError("Invalid Compare Range: the to date is before the from date ");
			}

			if (!bTestCompareStartVsBaseEnd) {

				displayBaseRangeError('Invalid: the "from:" date is before the "to:" date. Please click Reset to try again. ');

			}

			if (bTestCompareStartvsCompareEnd && bTestCompareStartVsBaseEnd ) {
				displayNoErrorMessage();
			}
		} else {
			return { bTestCompareStartvsCompareEnd: true, bTestCompareStartVsBaseEnd: true }
		}

		return { bTestCompareStartvsCompareEnd: bTestCompareStartvsCompareEnd, bTestCompareStartVsBaseEnd: bTestCompareStartVsBaseEnd }

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
				calendarDate = dates[1];
			}

		} else {

			calendarDate = dates[0];

		}	

		return calendarDate; 
	}

	var onCalendarsChange = function(dates, el) {

	  	if (limLog) console.log(arguments, "Date changed event currentFocusId: " + currentFocusId);

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
		  	// if (log) console.log(arguments, "Calendars range change")
		  }, 
		  onChange: onCalendarsChange,
		  	
	});

	// COMPARE INPUT RANGE 


	$("#inputCompareCheckbox").on("change", function(e) {
		//// if (log)  console.log(e.currentTarget.checked);

		if ( e.currentTarget.checked ) {
			
			bCompareChecked = true; 

			console.log(compareStartMoment, "compare checked - what is compareStartMoment?");

			if (null === compareStartMoment && !bCustomBaseRange ) {

				// 1. 
				// I can't call getPreviousCustomBaseRange() until compareStartMoment is defined!

				//var dates = ( bCustomBaseRange ) ? getPreviousCustomBaseRange() : [ previousRange[0]._d, previousRange[1]._d ];
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
		//// if (log)  console.log("compare select - e.target.value: " + e.target.value);

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

			clearCompareDates();
			 	
	 		
	 	}

	 });

	//////////////////////////////////////////////////////////////////////// BASE RANGE

	var setCalendarsByCurBaseRange = function( startDate, endDate ) {

		console.log(arguments, " setCalendarsByCurBaseRange ");

		startDate = (typeof startDate === "undefined") ? curRange[0]._d : startDate;
		endDate = (typeof endDate === "undefined") ? curRange[1]._d : endDate;

		console.log(startDate, " setCalendarsByCurBaseRange startDate");
		console.log(endDate, " setCalendarsByCurBaseRange endDate");

		setBaseDate(startDate, null, "Start" );
		setBaseDate(null, endDate, "End" );

		baseStartMoment = getDateMoment("BaseStart");
		baseEndMoment = getDateMoment("BaseEnd"); 

		setBaseRangeMessage([startDate, endDate]);
		calendars.DatePickerSetDate([ startDate, endDate ], true);
	 	
		

	};

	//////////////////////////////////////////////////////////////////////// COMPARE RANGE 

	var getPreviousCustomBaseRange = function(){

		var diffDays = Number( baseEndMoment.diff( baseStartMoment, "days") ) + 1;

		console.log("getPreviousCustomBaseRange diffDays: " + diffDays);

		var previousCompareEndMoment = moment().date( baseStartMoment.date() ).month( baseStartMoment.month() ).year( baseStartMoment.year() ).subtract(1, 'days');
		var previousCompareStartMoment = moment().date( baseStartMoment.date() ).month( baseStartMoment.month() ).year( baseStartMoment.year() ).subtract(diffDays, 'days');

		var previousCustomRange = [ previousCompareStartMoment._d, previousCompareEndMoment._d ];

		console.log(previousCustomRange, "getPreviousCustomBaseRange check compareStartMoment new");
		console.log(baseStartMoment, "getPreviousCustomBaseRange check baseStartMoment");
		console.log(baseEndMoment, "getPreviousCustomBaseRange check baseStartMoment");
		
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

		console.log("setCalendarsByPreviousCompareRange bCustomBaseRange: " + bCustomBaseRange + " vs bCustomCompareRange: " + bCustomCompareRange);

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

		var data = { baseStartDate: baseStartDate, 
					 baseEndDate: baseEndDate, 
					 compareStartDate: compareStartDate, 
					 compareEndDate: compareEndDate,
					 compareMode: bCompareChecked };

		//ir.introspect.app.msgBus.trigger('applyDates');
		ir.introspect.app.msgBus.trigger('date:apply', data);

		if (limLog) {
			console.log("Sending Dates =============>")
			console.log(data, "Dates sent to server")
		}

		if (undefined !== ga) ga('send', 'event', 'Tool Bar', 'click', 'apply dates');
			
		
	}); 

	$("#close-date").on("click", function(){
		ir.introspect.app.msgBus.trigger("date:close"); 
	});

	$("#cancelDates").on("click", function(){
		//ir.introspect.app.msgBus.trigger("date:close"); 
		reset();
	}); 

	//// if (log)  console.log(compareStartMoment, "compareStartMoment");


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