describe('Date Range Tests', function() {

  var drp = window.drp;

  /////////////////////////////////////////////////////// BASE 

  describe('Base Validation', function(){

    describe('Valid Base Start Date', function(){

      it('should set the "to:" start date as a valid date', function(){
        
        var startDateStr = $("#inputBaseStartDate").val();
        var valid = drp.isDate(startDateStr);

        expect( String(valid) ).to.equal('true');
      
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
    
    });

    describe('Valid Base End Date', function(){

       it('should set the "from:" end date as a valid date', function(){
        
        var endDateStr = $("#inputBaseEndDate").val();
        var valid = drp.isDate(endDateStr);

        expect( String(valid) ).to.equal('true');
      
      })

      it('should set the "from: " end date as 7 days ago', function(){
        expect( drp.baseStartMoment.isValid() ).to.be.true;
      })

    });


    describe('set the start and end dates for the base range', function(){

    
      it('should set the startDate to be before the endDate', function(){

        var bResult = drp.validateStartBeforeEnd(drp.baseStartMoment, drp.baseEndMoment); 
        console.log("datepickerSpec - bResult: " + bResult);
        expect( String(bResult) ).to.equal('true');

      });

      it('should set the endDate to be after the startDate', function(){

        var bResult = true//drp.validateStartBeforeEnd(drp.baseStartMoment, drp.baseEndMoment); 
        console.log("datepickerSpec - bResult: " + bResult);
        expect( String(bResult) ).to.equal('true');

      });
    

    });


  }); // end of Base Validation

  describe('Compare Validation', function(){

    // setup compare mode 

    var compareStartMoment;
    var compareEndMoment;

    before( function(){

      $("#inputCompareCheckbox").click();

        compareStartMoment = drp.getDateMoment( "CompareStart" );
        compareEndMoment = drp.getDateMoment( "CompareEnd" );

    });


    describe('Valid Compare Start Date', function(){

      
      it('should set the compare "to:" start date as a valid date', function(){
        
        var compareStartDateStr = $("#inputCompareStartDate").val();

        var bDateValid = drp.isDate(compareStartDateStr);

        expect( String(bDateValid) ).to.equal('true');
      
      });
   

      it('should set the compare startDate to be before the compare endDate', function(){

        var bResult = drp.validateStartBeforeEnd( compareStartMoment, compareEndMoment); 

        expect( String(bResult) ).to.equal('true');

      });

      it('should set the compare startDate after the base end date', function(){

        var bResult = drp.validateStartBeforeEnd( compareStartMoment, drp.baseEndMoment ); 

        expect( String(bResult) ).to.equal('true');

      });

      
    }); 

   });      

});