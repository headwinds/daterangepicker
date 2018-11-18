# RANGER: Date Ranger Picker

![headwinds datepicker](daterangepicker.png)

## Upgrade to ClojureScript

I have a request to use a date range picker again and since the current native input control that relies on [datetime-local doesn't support date format](https://stackoverflow.com/questions/7372038/is-there-any-way-to-change-input-type-date-format) (or at least at the time of writing this) and I want to use Material UI with ClojureScript, I'll attempt to update this project and experiment with Javascript interop to produce a much more flexible date control that can accept different date formats.

No demo yet...

I'm also experimenting with a date & time picker in this project which does have a [demo](https://reagent-reframe-material.now.sh/#/demos/pickers). It's in a docker and may take some time to boot up.

## Original Demo

[demo](https://daterangepicker-jvonlbfvls.now.sh/original-plain-js/datepicker)

The original-plain-js folder was created in 2015 contains mainly plain javascript involving jquery & moment. Simply navigate to this original-plain-js folder and open the datepicker.html file in a browser like Chrome.

This was written well before components and es6 classes so there is no one element. The controller talks many elements on the provided html page. It has all the raw pieces to be ported into a modern component though.

### Initialization

There is a init function (line 163) in DateRangeViewController which is called as soon as the script loads. You will see init() fire near the end of this file. Init initializes everything.

### Why did I build it?

I was tasked to create a date range picker that mirrored the behavoir found in the Google Analytics date range picker.

I started with the code base from [Justin Stern](http://foxrunsoftware.github.com/DatePicker/) since it was mostly jquery and I knew that I could fairly easily port it to Angular or Backbone once it has stabilized.

I decided to leverage momentjs to deal with dates and build custom ranges which [Dan Grossman](http://www.dangrossman.info/2012/08/20/a-date-range-picker-for-twitter-bootstrap/) did in this example.

This date range picker can support:

- user selected 1 day
- user selected & pre-selected 2 dates for a base range
- user selected & pre-selected 4 dates for a base vs range.

### CSS

The CSS is generated from SCSS and Compass. I recommend using [Codekit](https://incident57.com/codekit/) for managing SCSS and Compass projects.

### Log

Nov 18/2018

- begun port to ClojureScript

Aug 29/2017  
 _ tossed out what I know and decided to learn something new  
 _ tried prettier and did light design concepting around the day and activity components  
 \* exploring [Typescript, JSPM and observables](https://github.com/piotrwitek/react-redux-typescript-starter-kit)

Aug 28/2017  
 \* Started with what I know [create-react-app-redux](https://github.com/notrab/create-react-app-redux)
