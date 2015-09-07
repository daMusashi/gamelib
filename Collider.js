var namespace = Gamelib.useNamespace("");

namespace.Collider = function(type, _x, _y, width, height){
	var _type = type || "circle"; // kan också vara "circle"
	var _pos = new Gamelib.Vector(_x, _y); // x, y mittpunkt/rotaxel. by reference, behöver inte uppdateras om gameobjects posVector skickas 
	var _width = width || 1;
	var _height = height || width;
	
	var _alertSize = 1; // storleksfactor av size som ska bilde en "danger-radie" (alertDistance)

	Object.defineProperty(this, "colliderType", {  
    	get: function() { 
    		return type; 
    	}
  	});

  	// radien för en "danger"-cirkelzon - en "alert zone" - inom vilken djupare kollare görs för krockar (eller annat). isNear = true inom denna t.ex
  	Object.defineProperty(this, "alertDistance", {  
    	get: function() { 
    		return (_width + _height)/2.0; 
    	}
  	});
  	Object.defineProperty(this, "alertSize", {  
    	get: function() { 
    		return _alertSize; 
    	},
    	set: function(value) { 
    		_alertSize = value; 
  		}
  	});
  	Object.defineProperty(this, "pos", {  
    	get: function() { 
    		return _pos; 
    	},
    	set: function(value) { 
    		_pos = value; 
  		}
  	});
  	Object.defineProperty(this, "x", {  
    	get: function() { 
    		return _pos.x; 
    	},
    	set: function(value) { 
    		_pos.x = value; 
  		}
  	});
  	Object.defineProperty(this, "y", {  
    	get: function() { 
    		return _pos.y; 
    	},
    	set: function(value) { 
    		_pos.y = value; 
  		}
  	});

	// en medelstorlek att använda vid uppskattningsberäkningar, som om något är "nära"
  	Object.defineProperty(this, "size", {  
    	get: function() { 
    		return (_width + _height)/2.0; 
    	}
  	});

  	Object.defineProperty(this, "width", {  
    	get: function() { 
    		return _width; 
    	},
    	set: function(value) { 
    		_width = value; 
  		}
  	});
  	Object.defineProperty(this, "height", {  
    	get: function() { 
    		return _height; 
    	},
    	set: function(value) { 
    		_height = value; 
  		}
  	});

  	Object.defineProperty(this, "topLeft", {  
    	get: function() { 
    		var x = this.x - this.width/2;
			var y = this.y - this.height/2;

			return new Vector(x, y);
    	}
  	});
  	Object.defineProperty(this, "bottomRight", {  
    	get: function() { 
    		var x = this.x + this.width/2;
			var y = this.y + this.height/2;

			return new Vector(x, y);
    	}
  	});
}


// alertZones överlappar = true
namespace.Collider.prototype.isNear = function(gameobject){
	if(Vector.distance(this.position, gameobject.position) < (this.alertDistance + gameobject.alertDistance)){
		return true;
	} else {
		return false;
	}
}

namespace.Collider.prototype.isColliding = function(gameobject){
	// http://math.stackexchange.com/questions/256100/how-can-i-find-the-points-at-which-two-circles-intersect
	// http://justbasic.wikispaces.com/Check+for+collision+of+two+circles,+get+intersection+points
	if((this.type == "circle")&&(gameobject.colliderType == "circle")){
		return this.collisionCircle2Circle(collider);
	}
	return false;
}

namespace.Collider.prototype.collisionCircle2Circle = function(circleCollider){
	
	var r1 = this.width/2.0;
	var r2 = circleCollider.width/2.0;
	var centerDistanceVec = Vector.minus(this.pos, circleCollider.pos);

	if(centerDistanceVec.length < (r1 + r2)){
		
		// räknar ut en representativ kollionspunkt

		// algoritm: http://justbasic.wikispaces.com/Check+for+collision+of+two+circles,+get+intersection+points
		// Punkter som nämns ovan finns i bild under rubriken 'intersection of two circles': http://paulbourke.net/geometry/circlesphere/
		// pInt = de två punkterna där cirklarna bryter varandra
		// CP (collisionPoint) = en punkt mellan pInt som får representera kollisionspunkten

		var distanceCenter1ToCP = ((r1*r1) - (r2 * r2) + (centerDistanceVec.length * centerDistanceVec.length)) / (2.0 * centerDistanceVec.length);
		var xCP = this.pos.x + (centerDistanceVec.x * (distanceCenter1ToCP/centerDistanceVec.length));
		var yCP = this.pos.y + (centerDistanceVec.y * (distanceCenter1ToCP/centerDistanceVec.length));
		var CP = new Vector(xCP, yCP);

		// skapar normal för kollisionen (en för varje deltagare) att användas för att beräkna nya hastighets-vektorer
		var myNormal = Vector.normalize(centerDistanceVec);
		var participatorNormal = Vector.reverse(myNormal);

		// Skapar en kollision för varje deltagare (my = this-objektet)
		var myCollsion = new Collission(this, CP, myNormal);
		var participatorCollsion = new Collission(this, CP, participatorNormal);
		// lägger in respektive deltagare i respektive kollision för diverse kods åtkomst 
		participatorCollsion.participator = myCollsion;
		myCollsion.participator = participatorCollsion;


		return myCollsion;
	} else {
		return false;
	}
}