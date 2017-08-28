	 var setBaseDate = function( startDate, endDate, posStr ){

	 	//console.log(arguments, " setBaseDate ");
	 	//// //if (log)   //console.log(baseStartMoment, " setBaseDate baseStartMoment");

	 	var baseDate = (posStr === "Start") ? startDate : endDate; 

		var baseNumDateStr = ( baseDate.getMonth() + 1 ) + "/" + baseDate.getDate() + "/" + baseDate.getFullYear();

		//console.log(baseDate, " baseDate setBaseDate");
	    
	    $("#inputBase" + posStr + "Date").val(baseNumDateStr);

	    if (null === baseStartMoment) baseStartMoment = moment(); 

	    if (null === baseEndMoment) baseEndMoment = moment(); 

	    // need up update the base moments 

	    if (posStr === "Start") {
	    	//if (null !== baseStartMoment) {
	    		baseStartMoment.date( baseDate.getDate() );
	    		baseStartMoment.month( baseDate.getMonth() );
	    		baseStartMoment.year( baseDate.getFullYear() );
	    	//} 
	    } else {
	    	//if (null !== baseEndMoment) {
	    		baseEndMoment.date( baseDate.getDate() );
	    		baseEndMoment.month( baseDate.getMonth() );
	    		baseEndMoment.year( baseDate.getFullYear() );
	    	//}
	    }

	  
	    console.log("DateRangeViewController - setBaseDate baseStartMoment._d: " + baseStartMoment._d );
	    console.log("DateRangeViewController - setBaseDate baseEndMoment._d: " + baseEndMoment._d );
	    
	 }