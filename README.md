# DatePicker

![headwinds datepicker](http://www.headwinds.net/lab/daterangepicker/images/daterangepicker.png)

I was tasked to create a date range picker that mirrored the behavoir found in the Google Analytics date range picker. 
 
I started with the code base from [Justin Stern](http://foxrunsoftware.github.com/DatePicker/) since it was mostly jquery and I knew that I could fairly easily port it to Angular or Backbone once it has stabilized. 

I decided to leverage momentjs to deal with dates and build custom ranges which [Dan Grossman](http://www.dangrossman.info/2012/08/20/a-date-range-picker-for-twitter-bootstrap/) did in this example.

This date range picker can support:

* user selected 1 day
* user selected & pre-selected 2 dates for a base range
* user selected & pre-selected 4 dates for a base vs range. 

## DEMO

[demo](http://headwinds.net/lab/daterangepicker/datepicker.html)

## CSS

The CSS is generated from SCSS and Compass. I recommend using [Codekit](https://incident57.com/codekit/) for managing SCSS and Compass projects.






