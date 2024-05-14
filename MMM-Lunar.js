Module.register("MMM-Lunar",{
	// Default module config.
	defaults: {
		
	},

	getStyles: function() {
		return [
			this.file('MMM-Lunar.css')
		]
	},
	
	start: function() {
		this.lunar = null;		
		this.updateLunarDate();
		//this.fetchIt();
	},

	fetchIt: function(){
		var url1 = "https://data.weather.gov.hk/weatherAPI/opendata/lunardate.php?date=[" + new moment().format("YYYY-MM-DD") + "]";
		var self = this

		fetch(url1)
			.then((resp) => resp.json())
			.then(function(data) {				
				// Here you get the data to modify as you please
				var p1 = data.LunarYear.substring(0, 2);
				var p2 = data.LunarYear.substring(4, 5);				
				self.lunar = p1 + " " + p2 + "年 農曆" + data.LunarDate;						
				self.updateDom();
			})

			.catch(function(error) {
				// If there is any error you will catch them here
			});
	},

	updateLunarDate: function() {
		var self = this
		//    you can set this as hour   and minute in the future to test
		let MS_in_day = 24*60*60*1000  //24*60*60*1000;
		let now = moment();
		let MS_til_midnight = MS_in_day - (now.diff(now.clone().startOf('day'), 'milliseconds'));
			
		// start a one time timer to end of day
		setTimeout(()=> {
			
			//in one time timer(at  00:00:00), start interval for next start of day
			setInterval(()=>{
				// fetch data, once per day at 00:00:00
				self.fetchIt() // use 'this' pointer passed to the interval routine
			},MS_in_day)

			// fetch on the 1st start of day, one time
			self.fetchIt()

		}, MS_til_midnight);

		// fetch data now, 1st time
		self.fetchIt();
	},

    getDom: function() {
    var wrapper = document.createElement("div");
	var top = document.createElement('div');
		top.innerHTML = this.lunar;
		wrapper.appendChild(top);
   return wrapper;
}
});
