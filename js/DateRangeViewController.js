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
	var previousPeriodThisYearRange = [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')];
	

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

		$("#baseRange").text(" ");
		$("#validationMessage").text(" ");

		$('#datepicker-calendar').DatePickerClear();

		// 
		baseStartMoment = null;
		baseEndMoment = null; 
		compareStartMoment = null;
		compareEndMoment = null;

		$("#baseSelect select").val("0");
		
		bCustomBaseRange = false;
		bCustomCompareRange = false;
		bCompareChecked = false;

		curRange = last7DaysRange;

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
	 		var warningStr =  "<span class='warningRangeTxt'> Warning: this year range may take a long time to load </span>";
	 		$("#validationMessage").html(warningStr);
	 	} else {
	 		$("#validationMessage").html("");
	 	}

	 	if ( idNum === 8 ) {

	 		bCustomBaseRange = true; 
	 		
	 		setBaseInputsEnabled();
	 		setCalendarsEnabled();

	 		disableCheckBox(); 
	 		disableBaseTo();

	 		disableCompareSelect();
	 		// focus on the first base bate
			setCurrentFocus("inputBaseEndDate");

			clearBaseDates();
		
			

			$("#validationMessage").text("Please enter 2 dates for your Base range before continuing");

			return;

	 	} else {

	 		bCustomBaseRange = false; 

	 		curRange = baseRanges[idNum].range;
		 	previousRange = previousRanges[idNum].range;

		 	console.log(curRange, "new curRange");
		 	console.log(previousRange, "new previousRange");

		 	setBaseInputsDisabled();
	 		setCalendarsDisabled();

	 		enableCheckBox(); 
	 		enableCompareSelect();

	 	}


	 	if (!bCompareChecked) {
		 		
		 	setCalendarsByCurBaseRange(); 

		} else {

		 	setCalendarsByPreviousCompareRange();
		}
	

		if (log) console.log("baseSelect change bCompareChecked: " + bCompareChecked );
	 	

	 });

	 /////////////////////////////////////////// GETTERS & SETTERS

	 var getDateIndex = function(){

	 	if ( dateIndex === 1 ) dateIndex = 0;
	 	else dateIndex = 1; 

	 	return dateIndex; 
	 }

	 /////////////////////////////////////////////////// BASE T0 & FROM

	 var resetCustomRange = function(){

	 }

	 var disableBaseTo = function(){
	 	$("#inputBaseStartDate").addClass("disableApply");
	 }

	 var enableBaseTo = function(){
	 	$("#inputBaseStartDate").removeClass("disableApply");
	 }

	 var disableBaseFrom = function(){
	 	$("#inputBaseEndDate").addClass("disableApply");
	 }

	 var enableBaseFrom = function(){
	 	$("#inputBaseEndDate").removeClass("disableApply");
	 }

	 /////////////////////////////////////////////////// COMPARE T0 & FROM

	 var disableCompareTo = function(){
	 	$("#inputCompareStartDate").addClass("disableApply");
	 }

	 var enableCompareTo = function(){
	 	$("#inputCompareStartDate").removeClass("disableApply");
	 }

	 var disableCompareFrom = function(){
	 	$("#inputCompareEndDate").addClass("disableApply");
	 }

	 var enableCompareFrom = function(){
	 	$("#inputCompareEndDate").removeClass("disableApply");
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
	 	
	 	$("#inputBaseStartDate").val(" ");
	 	$("#inputBaseEndDate").val(" ");

	 	$('#datepicker-calendar').DatePickerClear();

	 	baseStartMoment = null;
	 	baseEndMoment = null;

	 	setApplyDisabled();

	 	setBaseRangeMessage();

	 	$("#validationMessage").text("Please enter 2 dates for your Base range before continuing");

	 }

	 var clearCompareDates = function(){
	 	$("#inputCompareStartDate").val(" ");
	 	$("#inputCompareEndDate").val(" ");

	 	calendars.DatePickerClear();

	 	var clearCompareDates = [ baseEndMoment._d, baseStartMoment._d ];
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

	 	//console.log(arguments, " setBaseRangeMessage ");

	 	var baseRangeStr;

	 	 if ( null === baseStartMoment) {
	 	
	    	baseRangeStr = "<span class='baseRangeTxt'>? - ?</span>";

		    $("#baseRange").html( baseRangeStr );

		 
		    return; 
		}

		dates[1] = ( typeof dates[1] !== "number" ) ? dates[1] : new Date( dates[1] ); 
		dates[0] = ( typeof dates[0] !== "number" ) ? dates[0] : new Date( dates[0] ); 

	 	var baseStartDateStr = dates[1].getDate()+' '+dates[1].getMonthName(true)+', '+ dates[1].getFullYear();
	    var baseEndDateStr = dates[0].getDate()+' '+dates[0].getMonthName(true)+', '+ dates[0].getFullYear();

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
	 		reset(); 

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

	 // BaseStart

	 var baseStartCaseHandler = function(startDate) { 

	 	setBaseDate(startDate, null, "Start");

	 	var bValidBaseTo = validateBaseTo();

		if ( bValidBaseTo ) {

			// disable both inputs 
			setBaseInputsDisabled();
			setCalendarsDisabled();

			enableCheckBox(); 

			setApplyEnabled(); 

			baseStartMoment = getDateMoment("BaseStart");

			console.log("calendars change baseStartMoment._d: " + baseStartMoment._d)

			if (!bCompareChecked) {

				setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d  ]);
				calendars.DatePickerSetDate([ baseEndMoment._d, baseStartMoment._d ], false);

			} else {
				setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, compareEndMoment._d  ]);
				calendars.DatePickerSetDate([ baseEndMoment._d, baseStartMoment._d, compareEndMoment._d, compareStartMoment._d  ], false);
				
				
			}

		} else {

		}
  	}

	 // BaseEnd

	 var baseEndCaseHandler = function(endDate){
	 	
	 	setBaseDate(null, endDate, "End");
  				
		var bValidBaseFrom = validateBaseFrom();

		if ( bValidBaseFrom ) {

			disableBaseFrom(); 
			setCurrentFocus("inputBaseStartDate");
			enableBaseTo(); 

			baseEndMoment = getDateMoment("BaseEnd");

			if (null !== baseStartMoment) {

				if (!bCompareChecked ) {

					setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d  ]);
					calendars.DatePickerSetDate([ baseEndMoment._d, baseStartMoment._d ], false);

				} else {
					setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, compareEndMoment._d  ]);
					calendars.DatePickerSetDate([ baseEndMoment._d, baseStartMoment._d, compareStartMoment._d, compareEndMoment._d ], false);
  			
  				}

			}


		} else {
			
			// only clear the calendar after the first click so it can forget about the second date in the range and start again 
			$('#datepicker-calendar').DatePickerClear();

		}

  				//testDates = [endDate, startDate]; 
	 }

	 // CompareStart

	 var compareStartCaseHandler = function(startDate){
	 	
	 	setCompareDate(startDate, null, "Start");

		// ok we now have 2 dates for the compare range
		// are they valid?

		var validObj = validateCompareTo();

		if (validObj.bTestCompareStartvsCompareEnd && validObj.bTestCompareStartVsBaseEnd ) {
			// disable both inputs 
			
			compareStartMoment = getDateMoment("CompareStart");

			// bring opacity back to 1
			enableCompareFrom();
			enableCompareTo();

			// then disable them
			setCompareInputsDisabled();
			setCalendarsDisabled();

			enableCheckBox(); 
			setApplyEnabled(); 

			//calendars.DatePickerClear();
			var newCompareDates = [ baseEndMoment._d, baseStartMoment._d, compareStartMoment._d, compareEndMoment._d ];
			console.log(newCompareDates, "newCompareDates");

			calendars.DatePickerSetDate(newCompareDates, false);

			setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, compareEndMoment._d  ]);
		}

	 }

	 // CompareEnd 

	 var compareEndCaseHandler = function(endDate) {

		setCompareDate(null, endDate, "End");

		var bCompareFromValid = validateCompareFrom(); 

		if ( bCompareFromValid ) {

			compareStartMoment = null; // should still be null here!	

			disableCompareFrom(); 
			setCurrentFocus("inputCompareStartDate");
			enableCompareTo(); 

			compareEndMoment = getDateMoment("CompareEnd");

			// don't try to draw the range until the start date is also established
			//if (null !== compareStartMoment) {

			calendars.DatePickerSetDate([ baseEndMoment._d, baseStartMoment._d, compareEndMoment._d, compareEndMoment._d ], false);
				//setBaseRangeMessage([ baseStartMoment._d, baseEndMoment._d, compareStartMoment._d, compareEndMoment._d  ]);

			//}

		} else {
			// only clear the calendar after the first click so it can forget about the second date in the range and start again 
			$('#datepicker-calendar').DatePickerClear();
		}
	 }

	 // on enter or blur test the new date
	 var newDateAdded = function( posStr ){

	 	if (limLog) console.log("newDateAdded posStr: " + posStr);

	 	var inputBox = $("#input" + posStr + "Date");

	 	var enteredDate = inputBox.val();
			   // 
		var checkDateObj = isDate(enteredDate);

		if (limLog) console.log("newDateAdded enteredDate: " + enteredDate);
		if (limLog) console.log("newDateAdded bValid: " + checkDateObj.isValid);


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

	 	if (limLog)  console.log("========== END ==========");
	 	if (limLog)  console.log("year: " + endDateMoment.year() );
	 	if (limLog)  console.log("month: " + Number ( Number( endDateMoment.month() ) + 1 ) );
	 	if (limLog)  console.log("date: " + endDateMoment.date() );
	 	
	 	if (limLog)  console.log("=========== START ============");
	 	if (limLog)  console.log("year: " + startDateMoment.year() );
	 	if (limLog)  console.log("month: " + Number ( Number( startDateMoment.month() ) + 1 ) );
	 	if (limLog)  console.log("date: " + startDateMoment.date() );

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
	
	 	// if (log)  console.log("validateStartBeforeEnd valid: " + bResult + " diffDays: " + diffDays); 

	 	if ( !bResult ) {
	 		setApplyDisabled();
	 		displayBaseRangeError();
	 	} else {
	 		setApplyEnabled();
	 		displayNoErrorMessage();
	 	} 

	 	return bResult;
	 };

	 var validateBaseFrom = function(){

	 	var baseFromValid = false;

	 	// simple 2 date validation
	 	// is the from date after the to date?

	 	if (null !== baseStartMoment) {

		 	baseFromValid = validateStartBeforeEnd(baseStartMoment, baseEndMoment); 

		 	if (!baseFromValid) {

				displayBaseRangeError("Invalid Base Range: the from date is after the to date ");
			}

		 	console.log("validateBaseFrom 1 valid? " + baseFromValid); 

		 	// complex 3 date validation with compare checked	
		 	if ( bCompareChecked ) {
		 		baseFromValid = validateStartBeforeEnd(baseEndMoment, compareStartMoment); 

		 		if (!baseFromValid) {
					displayBaseRangeError("Invalid Base Range: the base from date is before the compare to date ");
				}

		 	}

		 	console.log("validateBaseFrom 2 valid? " + baseFromValid); 

		 	if (baseFromValid ) {
				displayNoErrorMessage();
			}

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

				displayBaseRangeError("Invalid Base Range: the from date is after the to date ");
			}

		 	console.log("validateBaseTo 1 valid? " + baseToValid); 

		 	// complex 3 date validation with compare checked	
		 	if ( bCompareChecked ) {
		 		baseToValid = validateStartBeforeEnd(baseStartMoment, compareStartMoment); 

		 		if (!baseToValid) {
					displayBaseRangeError("Invalid Base Range: the base to date is before the compare to date ");
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
				displayBaseRangeError("Invalid Compare Range: the compare from date is after the base from date ");
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

				displayBaseRangeError("Invalid Compare Range: the compare to date is after the base from ");

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
				calendarDate = dates[1];
			} else {
				calendarDate = dates[0];
			}

		} else {

			calendarDate = dates[0];

		}	




		//calendarDate = ( null === dates[0] ) ? dates[1] : dates[0]
		/*
		if ( posStr === "start" ) {

			calendarDate = ( null === dates[0] ) ? dates[1] : dates[0]
			
			
			//if ( null === dates[0] ) {
			//	var startDateNum = Math.max(dates[0], dates[1]);
			//	var startDate = new Date(startDateNum); 
			//	calendarDate = startDate; 
			

		} else {
				calendarDate = ( null === dates[0] ) ? dates[1] : dates[0];
		}
		*/

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

			if (null === compareStartMoment) {

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

				if ( bCustomBaseRange ) {
					dates = getPreviousCustomBaseRange();
				} 
				
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
		 
		 	setCompareInputsDisabled();
	 		
	 		// the base range could be in custom mode
	 		if (!bCustomBaseRange) setCalendarsDisabled();

	 		// revert possible custom date back to previous
	 		//compareStartMoment = getDateMoment("CompareStart");
	 		//compareEndMoment = getDateMoment("CompareEnd");
	 		var compareStartD = previousRange[0]._d;
	 		var compareEndD = previousRange[1]._d; 

	 		setCompareDate(compareStartD, compareEndD, "Start");
	 		setCompareDate(compareStartD, compareEndD, "End");

	 		setCalendarsByPreviousCompareRange(); 

	 	
	 		displayNoErrorMessage();
	 		setApplyEnabled(); 


	 	} else {

	 		bCustomCompareRange = true; 

	 		setCompareInputsEnabled();
	 		
	 		setCalendarsEnabled();

	 		disableCompareTo();
	 		//disableCompareFrom();

	 		// focus on the first base bate
			setCurrentFocus("inputCompareEndDate");

			clearCompareDates();
			 	
	 		
	 	}

	 });

	//////////////////////////////////////////////////////////////////////// BASE RANGE

	var setCalendarsByCurBaseRange = function( startDate, endDate ) {

		if (limLog)  console.log(arguments, " setCalendarsByCurBaseRange ");

		startDate = (typeof startDate === "undefined") ? curRange[0]._d : startDate;
		endDate = (typeof endDate === "undefined") ? curRange[1]._d : endDate;

		setBaseDate(startDate, null, "Start" );
		setBaseDate(null, endDate, "End" );

		calendars.DatePickerSetDate([ startDate, endDate ], true);
	 	
		setBaseRangeMessage([startDate, endDate]);

	};

	//////////////////////////////////////////////////////////////////////// COMPARE RANGE 

	var getPreviousCustomBaseRange = function(){

		var diffDays = Number ( baseStartMoment.diff( baseEndMoment, "days") ) + 1;

		if (limLog) console.log("getPreviousCustomBaseRange diffDays: " + diffDays);

		var previousCompareStartMoment = moment().year( baseEndMoment.year() ).month( baseEndMoment.month() ).date( baseEndMoment.date() ).subtract(1, 'days');
		var previousCompareEndMoment = moment().year( baseEndMoment.year() ).month( baseEndMoment.month() ).date( baseEndMoment.date() ).subtract(diffDays, 'days');

		var previousCustomRange = [previousCompareEndMoment._d, previousCompareStartMoment._d ];

		console.log(compareStartMoment, "getPreviousCustomBaseRange check compareStartMoment");

		if ( null === compareStartMoment ) {

		}

		setCompareDate(previousCompareStartMoment._d, null, "Start" );
		setCompareDate(null, previousCompareEndMoment._d, "End" );

		if (limLog) console.log(previousCustomRange, "getPreviousCustomBaseRange");

		return previousCustomRange; 
	};


	var setCalendarsByPreviousCompareRange = function() {

		if (limLog)  console.log("setCalendarsByPreviousCompareRange bCustomBaseRange: " + bCustomBaseRange + " vs bCustomCompareRange: " + bCustomCompareRange);

		var dates;

		
		if ( bCustomBaseRange && bCustomCompareRange ) {

			dates = [compareStartMoment._d, compareEndMoment._d];
			// this is the one case where we can preserve both custom compare and base range but it's up to the user to not overlap
			// or hmmm I should be able to validate this case...

		} else if ( !bCustomBaseRange && bCustomCompareRange ) {

			//dates = [compareStartMoment._d, compareEndMoment._d];
			// we can't preserve the custom range since the options in the drop down list may overlap and thus suddenly become invalid
			dates = [ previousRange[0]._d, previousRange[1]._d ];
			$("#compareSelect select").val("0");
			bCustomCompareRange = false;


	    } else if ( bCustomBaseRange && !bCustomCompareRange ) {
	    	console.log(dates, "setCalendarsByPreviousCompareRange - custom base dates");

			dates =  getPreviousCustomBaseRange();
		
		} else {
			
			dates = [ previousRange[0]._d, previousRange[1]._d ];
			$("#compareSelect select").val("0");
			bCustomCompareRange = false;

			console.log(dates, "setCalendarsByPreviousCompareRange - final option");
			
			console.log(curRange, " curRange");
			console.log(previousRange, " previousRange");

			//baseStart = curRange[1]._d;
			//baseEnd = curRange[0]._d; 

			setBaseDate(curRange[0]._d, null, "Start");
			setBaseDate(null, curRange[1]._d, "End");
		}

		var baseStart = baseStartMoment._d;
 	    var baseEnd = baseEndMoment._d;

		
		var compareNumStartDateStr = dates[0].getDate() + "/" + (dates[0].getMonth() + 1) + "/" + dates[0].getFullYear();
		var compareNumEndDateStr = dates[1].getDate() + "/" + (dates[1].getMonth() + 1) + "/" + dates[1].getFullYear();
		
	    $("#inputCompareStartDate").val(compareNumStartDateStr);
	    $("#inputCompareEndDate").val(compareNumEndDateStr);

	   	//if (!bCustomBaseRange) setCalendarsByCurBaseRange();
         
 	   
 	    var compareStart = dates[0];
 	    var comapareEnd = dates[1];

 	    setCompareDate(compareStart, null, "Start");
		setCompareDate(null, comapareEnd, "End");

 	    calendars.DatePickerSetDate([ baseStart, baseEnd, compareStart, comapareEnd ], true);

 	    setBaseRangeMessage([ baseStart, baseEnd, compareStart, comapareEnd ]);

	};

	
	

	// APPLY & CANCEL 

	$("#applyDates").on("click", function(){

		ir.introspect.app.msgBus.trigger("date:close"); 

		var baseStartDate = baseStartMoment._d;
		var baseEndDate = baseEndMoment._d;

		var compareStartDate = (null !== compareStartMoment) ? compareStartMoment._d : null;
		var compareEndDate = (null !== compareEndMoment) ? compareEndMoment._d : null;

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