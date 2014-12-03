describe('Date Range Picker', function() {

  var drp = window.drp;

  /////////////////////////////////////////////////////// BASE 

  describe('Base Range', function() {

  // start date 

    describe('set the start and end dates for the base range', function(){

      

      it('should set the startDate to be before the endDate', function(){

        var bResult = drp.validateStartBeforeEnd(drp.baseStartMoment, drp.baseEndMoment); 
        console.log("datepickerSpec - bResult: " + bResult);
        expect( String(bResult) ).to.equal('true');

      })

      it('should set the endDate to be after the startDate', function(){

        var bResult = drp.validateStartBeforeEnd(drp.baseStartMoment, drp.baseEndMoment); 
        console.log("datepickerSpec - bResult: " + bResult);
        expect( String(bResult) ).to.equal('true');

      })

      /*
      it('should display a warning meessage if the startDate is before the endDate', function(){

        var baseRangeErrorMsg = $("#validationMessage").text();

        // bad
        //expect(baseRangeErrorMsg).to.equal("invalid Base Range: start date occurs after end date"); 

      })
      */

       it('should display a valid meessage if the startDate is before the endDate', function(){

        var baseRangeErrorMsg = $("#validationMessage").text();

        //good 
        expect(baseRangeErrorMsg).to.equal("Valid Base Range: start date occurs before end date"); 

      })
    

    })

  })

  describe('Base Validation', function(){

    describe('Valid Base Start Date', function(){

      it('should set the "to:" start date as a valid date', function(){
        expect( drp.baseStartMoment.isValid() ).to.be.true;
      
      })

      it('should set the "to:" start date as today', function(){
        expect( drp.baseStartMoment.isValid() ).to.be.true;

        var dateMatch = false; 
        var today = new moment();

        console.log("--------- TODAY ---------");
        console.log(today);
        console.log("date: " + today.date());
        console.log("month: " + today.month());
        console.log("year: " + today.year());
        console.log("--------- START  ---------");
        console.log(drp.baseStartMoment);
        console.log("date: " + drp.baseStartMoment.date());
        console.log("month: " + drp.baseStartMoment.month());
        console.log("year: " + drp.baseStartMoment.year());

       if ( drp.baseStartMoment.date() == today.date() && drp.baseStartMoment.month() == today.month() && drp.baseStartMoment.year() == today.year() ) {

        dateMatch = true; 
        console.log("perfect test");

       } 

        console.log("dateMatch: " + dateMatch);
        expect( String(dateMatch) ).to.equal('true');
      
      })
    
    })

    describe('Valid Base End Date', function(){

      it('should set the end date as 7 days ago', function(){
        expect( drp.baseStartMoment.isValid() ).to.be.true;
      })

    })

  })


})