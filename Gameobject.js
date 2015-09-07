/**
 * Grundläggande klass för spelobjekt, allt som ska röras och/eller krockas bör ärva den här.
 * Statiska objekt som bara ska vara krockbara kan ärva den här direkt,
 * Objekt som ska ha rörelse bör ärva GameobjektMoving, som i sin tur ärver den här.
 *
 * Klassen har två viktiga egenskaper (med ev getters och setters)
 * - pos - positionsvektor
 * 		getter & setter för x, y
 * - collider - objekt som sköter kolliopnsdetektion - innehåller gameobjekt storlek (den viktiga, den som krockar)
 * 		getter för width & height (sätta värde får klassen som ärver göra när grafik ritas)
 * @param {number} _x              initialt x-värde
 * @param {number} _y              initialt y-värde
 * @param {[type]} _colliderWidth  initialt width (bör underhållas av draw-funktioner)
 * @param {[type]} _colliderHeight initialt height (bör underhållas av draw-funktioner)
 */

var namespace = Gamelib.useNamespace("");

namespace.Gameobject = function(_x, _y, _colliderWidth, _colliderHeight, _colliderShape){
	
	Gamelib.Collider.call(this, _colliderShape, _x, _y, _colliderWidth, _colliderHeight); // ärver collider

	var _updateFunctions = []; // en lista med funktioner som classer i arv-kedjan kan lägga till sin update-funktion (eller andra) som ska köras vid update (innan draw)
	var _drawFunctions = [];  // en lista med funktioner som classer i arv-kedjan kan lägga till sin draw-funktion (eller andra) som ska köras vid draw

  	
  	Object.defineProperty(this, "updateFunctions", {  
    	get: function() { 
    		return _updateFunctions; 
    	}
  	});
  	Object.defineProperty(this, "drawFunctions", {  
    	get: function() { 
    		return _drawFunctions; 
    	}
  	});
	
	this.addDraw(this.drawColliderDebug);

	//this.debug();
}

namespace.Gameobject.prototype = new Gamelib.Collider();

namespace.Gameobject.prototype.addUpdate = function(func){
	this.updateFunctions.push(func);
}

namespace.Gameobject.prototype.update = function(){
	console.log("update: kör "+this.updateFunctions.length+" funktioner");
	for(var i = 0; i < this.updateFunctions.length; i++){
		this.updateFunctions[i]();
	}
}

namespace.Gameobject.prototype.addDraw = function(func){
	this.drawFunctions.push(func);
}

namespace.Gameobject.prototype.draw = function(){
	console.log("draw: kör "+this.drawFunctions.length+" funktioner");
	for(var i = 0; i < this.drawFunctions.length; i++){
		this.drawFunctions[i]();
	}
}

namespace.Gameobject.prototype.isColliding = function(gameobject){
	return collider.isColliding(gameobject);
}
namespace.Gameobject.prototype.isNear = function(gameobject){
	return collider.isNear(gameobject);
}

/**
 * ANTAR P5!
 * Ritar ut en representation av kollideraren
 * Bara tänkt att användas i debug-syfte
 */
namespace.Gameobject.prototype.drawColliderDebug = function(){
	fill(0,0,0,0);
	
	
	// alert zone
	stroke(255, 205, 0); // gul
	ellipse(this.x, this.y, this.alertDistance*2, this.alertDistance*2);
	// "hit-box"
	stroke(255, 10, 0); // röd
	if(this.colliderType == "box"){
		ellipse(this.x, this.y, this.width, this.height);
	} else {
		// circle
		ellipseMode(CENTER);
		ellipse(this.x, this.y, this.width, this.width);
	}
}

namespace.Gameobject.prototype.debug = function(){
	console.log("* DEBUG Gameobject *");
	console.log(this);
	console.log("************");
}