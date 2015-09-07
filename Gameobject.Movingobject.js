var namespace = Gamelib.useNamespace("Gameobject");

namespace.Movingobject = function(_x, _y, _colliderWidth, _colliderHeight, _velocityVector){
	
	Gamelib.Gameobject.call(this, _x, _y, _colliderWidth, _colliderHeight);

	var randomSpeed = Math.random()*2+(this.stopSpeed*0.001);
	var randomDirection = Math.random()*2*Math.PI;

	var initVel = new Gamelib.Vector();
	initVel.length = randomSpeed;
	initVel.angle = randomDirection;
	var _vel = _velocityVector || initVel;

	Object.defineProperty(this, "vel", {  
    	get: function() { 
    		return _vel; 
    	},
    	set: function(value) { 
    		_vel = value;
  		}
  	});

  	
	var me = this;
  	this.addUpdate(function(){
		// för debug
		//this.collider.draw();

		// wrappar rörlser över canvas-kant (width & height är p5-globaler för dess canvas)
		if((me.isMovingRight())&&(me.topLeft.x > width)){
			me.pos.x = -me.size/2;
		}
		if((me.isMovingLeft())&&(me.bottomRight.x < 0)){
			me.pos.x = width + me.size/2;
		}
		if((me.isMovingUp())&&(me.bottomRight.y < 0)){
			me.pos.y = height + me.size/2;
		}
		if((me.isMovingDown())&&(me.topLeft.y > height)){
			me.pos.y = -me.size/2;
		}

		// sätter hastighet till 0 om lägre än this.stopSpeed, för att förhindra obetydliga och knappt synliga minirörelser plågar systemet
		if(me.vel.length < Gamelib.stopSpeed){
			this.vel.length = 0;
		}

		me.pos.x += me.vel.x;
		me.pos.y += me.vel.y;
	});
}

// extend - lägg till - Gameobject
namespace.Movingobject.prototype = new Gamelib.Gameobject(); 

namespace.Movingobject.prototype.isMovingLeft = function(){
	if(this.vel.x < -Gamelib.stopSpeed){
		return true;
	} else {
		return false;
	}
}

namespace.Movingobject.prototype.isMovingRight = function(){
	if(this.vel.x > Gamelib.stopSpeed){
		return true;
	} else {
		return false;
	}
}

namespace.Movingobject.prototype.isMovingUp = function(){
	if(this.vel.y < -Gamelib.stopSpeed){
		return true;
	} else {
		return false;
	}
}

namespace.Movingobject.prototype.isMovingDown = function(){
	if(this.vel.y > Gamelib.stopSpeed){
		return true;
	} else {
		return false;
	}
}

namespace.Movingobject.prototype.debug = function(){
	console.log("* DEBUG GameobjectMoving *");
	console.log(this);
	console.log("************");
}