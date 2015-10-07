
/*
Program: 1back
Description: javascript program which performs 1back memory test.  This test is a measure for psychological processing speed. 
Author: Vasuthan Vinayagamoorthy
Notes: box, box2 (representing present image, and future image) and clock, and score are the div elements required
Image locations can be changed in getImageObject method.

*/

$(document).ready(function() {
	
	//timers object holds array of closures (From John Resig: Secrets of Javascript Ninja)
	//closures that need to be animated are added to object's array
	//start method uses setTimeout to start function as soon as possible in the event queue
	var timers = {

		timerID:0,
		timers: [],

		add: function(fn){
			this.timers.push(fn);
		},

		start: function(){
			if(this.timerID) return;
			(function runNext(){
				if(timers.timers.length > 0){
					for(var i = 0; i < timers.timers.length; i++){
						if(timers.timers[i]() == false){
							timers.timers.splice(i,1);
							i--;
						}
					}
				}

					timers.timerID = setTimeout(runNext,0); //run as fast as possible in event queue
					
				})();
				
		},

		stop: function(){
				clearTimeout(this.timerID);
				this.timerID = 0;
		},

		clear: function(){
				this.timers.length = 0;
				this.timerID = 0;
		}
	}

	//box represent first image shown, and box2 represents the following image shown
	var box = document.getElementById("box");
	var box2 = document.getElementById("box2");
	var clock = document.getElementById("clock");
	var scoreText = document.getElementById("score");

	var score = 0;
	var totalPress = 0;
	var percentScore = 0;
	var started = 0; //variable that know if counter as started

	var b1 = {};
	var b2 = {};
			
			
	//Replace locations with required image locations
	function getImageObject(){
		var imgNumber = Math.floor((Math.random() * 4) + 1);
		var imgObject = {};

		if(imgNumber == 1){
			imgObject = {id:1 , loc:"1.png"};
		}

		if(imgNumber == 2){
			imgObject = {id:2 , loc:"2.png"};	
		}

		if(imgNumber == 3){
			imgObject = {id:3 , loc:"3.png"};
		}	

		if(imgNumber == 4){
			imgObject = {id:4 , loc:"4.png"};
		}

		return imgObject;
	}		

			$(document).on("keypress", function (e) {

				if((e.which == 97  || e.which == 100) && started == 1) { //a or d key is pressed and game has started

					$(b2.elem).css("visibility","visible");


					//a closure that animates a movement towards the left, a new object moves into view, while the old object moves on and then removed
					//scores are also appropriately calculated
					timers.add(function(){
						
						$(b1.elem).animate({left: '-=100px',opacity: '0'},{ duration: 100, queue: false });
						$(b2.elem).animate({opacity:1, left: '-=100px'},{ duration: 100, queue: false });
						
						var newImgOb = getImageObject();
						var newBox = $("<div></div>")


						$(newBox).css({'position': 'absolute','left':'400px','width':'100px','visibility': 'hidden'}); //creates new css obj
						var newB = {elem:newBox, imgOb: newImgOb};
						$(newB.elem).prepend($('<img>',{src:newB.imgOb.loc}));
						$(b2.elem).after(newB.elem);

						if(b1.imgOb.id == b2.imgOb.id){
							if(e.which == 97){
								score++;
							}
						}

						if(b1.imgOb.id !=  b2.imgOb.id){
							if(e.which == 100){
								score++;
							}
						}

						b1.elem.remove();
						b1.elem = b2.elem;
						b2.elem = newB.elem;
						return false;
					});

				}

				if(e.which == 13){
					if(started == 0){ //starting  the clock and score
						var firstObj = getImageObject();
						var secObj = getImageObject();

						b1 = {elem:document.getElementById("box"), imgOb: firstObj};
						$(b1.elem).prepend($('<img>',{src:b1.imgOb.loc}));
						$(b1.elem).css({'position':'absolute','left':'300px','width':'100px'});

						b2 = {elem:document.getElementById("box2"), imgOb: secObj};
						$(b2.elem).prepend($('<img>',{src:b2.imgOb.loc}));
						$(b2.elem).css({'position':'absolute','left':'400px','width':'100px', 'visibility':'hidden'});

						score = 0;
						var d = new Date();
						var startTime = d.getTime();
						started = 1;
					}

					if(started == 1){
						timers.add(function(){
							var nd = new Date();
							var ntime = nd.getTime();
							var displ = Math.floor((ntime - startTime)/1000);
							$(clock).text(displ);
							if(displ >= 60){
								$(scoreText).text(score);
								started = 0;	
								return false;
							}
						});
					}
				}

			});



timers.start();	

});


</script>