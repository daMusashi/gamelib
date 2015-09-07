/**
 * Enkel vektorklass
 * Martin Nilsson, 2015-09-01
 *
 * Kan avändas både som 
 * - polär vektor (längd, vinkel) - används oftast till hastigheter och krafter (motor, graviation, friktion etc)
 * - koordinat-vektor (x, y) - används oftast till position
 * - unit-vektor (1 > x > -1, 1 > y > -1) (varje värde minst -1 och max 1) - används oftast för riktning (att användas i andra vektorberäkningar)
 * 
 * En vektor används oftast som en polär vektor (längd, vinkel), 
 * men beräkningar sker oftast på dess "uppbrytna" version, en koordinat-vektor (x-längd, y-längd)
 * Datan (x, y) sparas därför i classen som KOORDINAT-VEKTOR, sedan finns funktioner som sätter/hämtar (konverterar in/ut) som de andra typerna.
 *
 * En del funktioner har en statisk variant, då ingen vektor behövs innan, eller 
 * man helt klart vill ha en kopia, t.ex när man vill normalisera en vektor (konvertera till unit-vektor) - man vill i regel ha kvar originalet.
 */

var namespace = Gamelib.useNamespace("");

namespace.Vector = function(x, y){
	var _x = x || 0;
	var _y = y || 0;
	//console.log("x: "+_x);
	//console.log("y: "+_y);
	
	Object.defineProperty(this, "x", {  
    	get: function() { 
    		return _x; 
    	},
    	set: function(value) { 
    		_x = value; 
  		}
  	});

  	Object.defineProperty(this, "y", {  
    	get: function() { 
    		return _y; 
    	},
    	set: function(value) { 
    		_y = value; 
  		}
  	});

  	Object.defineProperty(this, "length",{  
    	get: function() { 
    		return Math.sqrt(_x*_x + _y*_y); 
    	},
    	set: function(value) { 
    		var a = this.angle;
    		_x = value * Math.cos(a);
    		_y = value * Math.sin(a);
  		}
  	});

  	Object.defineProperty(this, "angle",{  
    	get: function() { 
    		/* Jag har inte hittat något sätt att ta mig runt situationerna när x eller y = 0
    		Speciellt x = 0 ger ju dividion by zero
    		Så jag "räknar manuellt" i dessa fall
    		*/
    		if(_x == 0){
    			// vertikal vinkel
    			if(_y > 0){
					// upp / 90 grader / 0.5Pi rad
    				return 0.5 * Math.PI;
    			} else {
    				// ned / 270 grader 1.5PI rad
    				return 1.5 * Math.PI;
    			}
    		} else if(_y == 0){
    			// horosontell vinkel
    			if(_x > 0){
					// höger / 0 grader / 0 rad
    				return 0;
    			} else {
    				// vänster / 180 grader 1PI rad
    				return Math.PI;
    			}
    		} else {
    			return Math.atan(_y / _x); 
    		}
    	},
    	set: function(value) { 
    		var l = this.length;
    		_x = l * Math.cos(value);
    		_y = l * Math.sin(value);
  		}
  	});
}


// Funktioner som sätter/hämtar (konverterar in/ut) egenskaper för POLÄRA VEKTORER

namespace.Vector.prototype.set = function(v){
	this.x = v.x;
	this.y = v.y;
}


// Vektor-matte

/**
 * Muliplicerar en vektor med ett värde
 * @param  {vector} v Vektorn
 * @param  {number} val Värde att mulitplicera vektorn med
 * @return {vector}   En ny vector som är v * värde
 */
// Statisk version
namespace.Vector.multiValue = function(v, value){
	return new Vector(v.x * value, v.y * value);
}
// Lokal version - inget returneras, objekt-vektorn sparar resultatet
namespace.Vector.prototype.multiValue = function(value){
	this.set(Vector.multiValue(this, v));
}

/**
 * Beräknar vinkeln mellan vektorer, i radianer.
 * Algoritm: http://www.wikihow.com/Find-the-Angle-Between-Two-Vectors
 * 
 * @param  {vector} v1 Första vektorn
 * @param  {vector} v2 Andra vektorn
 * @return {number} vinkeln i radianer
 */
// Statisk (endast)
namespace.Vector.angleBetween = function(v1, v2){
	var cosAngle = Vector.dot(v1, v2)/(v1.x * v2.x);
	return Math.acos(cosAngle);
}

/**
 * Beräknar dot-produkten av två vektorer. Det innebär i praktiken de två magnituderna multiplceras och sedan körs genom cosinus.
 * Dot produkten innebär olika saker beroende på om det är en polär eller koordinat-vektor.
 * För polära vektorer innebär det att man projekterar den ena vektorn på den andra (hur lång den blir "på" den andra).
 * Dot-produkten används främst till andra vektor-beräkningar.
 * 
 * @param  {vector} v1 Första vektorn
 * @param  {vector} v2 Andra vektorn
 * @return {number}  Dot-produkt (för polära: första vektorns projekterade längd på den andra)
 */
// Statisk (endast)
namespace.Vector.dot = function(v1, v2){
	return (v1.x * v2.x) + (v1.y * v2.y);
}

/**
 * Reflekterar (speglar) en vektor mot en normal. 
 * En normal är t.ex den vinkelräta vektorn ur en vägg, väggens "pekrikting". Normalen anges som en unit-vektor.
 * Använd t.ex för att "studsa" en hastighets-vektor (polär vektor)
 * Algoritm baserad på http://www.3dkingdoms.com/weekly/weekly.php?a=2
 *
 * @param  {vector} v Vektorn som ska speglas/reflekteras
 * @param  {vector} normal En unit-vektor som anger "spegel-axel"
 * @return {vector} En ny Speglad/reflekterad vektor
 */
// Statisk version
namespace.Vector.reflect = function(v, normal){
	console.log("REFLECT");
	console.log(v);
	console.log(normal);

	console.log("Dot: "+Vector.dot(v, normal));

	var steg1Value = 2.0 * Vector.dot(v, normal);
	console.log("Steg1");
	console.log(steg1Value);
	var steg2vec = Vector.multiValue(normal, steg1Value);
	console.log("Steg2");
	console.log(steg2vec);
	var steg3vec = Vector.minus(steg2vec, v);
	console.log("Steg3");
	console.log(steg3vec);
	console.log("reverse");
	console.log(Vector.reverse(steg3vec));

	return Vector.reverse(steg3vec);
}
// Lokal version - inget returneras, objekt-vektorn sparar resultatet
namespace.Vector.prototype.reflect = function(vNormal){
	this.set(Vector.reflect(this, vNormal));
}

/**
 * "Flippar" (vänder 180 grader/PI radianer) en polär vektor
 * @param  {vector} v Vektor som ska flippas 
 * @return {vector}  En ny flippad polär vektor 
 */
// statisk version
namespace.Vector.reverse = function(v){
	var vr = new Vector();
	vr.x = 0 - v.x;
	vr.y = 0 - v.y;
	return vr;
}
// Lokal version - inget returneras, objekt-vektorn sparar resultatet
namespace.Vector.prototype.reverse = function(){
	this.set(Vector.reverse(this));
}


/**
 * Addera två vektorer
 * @param  {vector} v1 Första vektorn
 * @param  {vector} v2 Andra vektorn
 * @return {vector}   En ny vector som är v1 + v2
 */
// Statisk version
namespace.Vector.plus = function(v1, v2){
	return new Vector(v1.x + v2.x, v1.y + v2.y);
}
// Lokal version - inget returneras, objekt-vektorn sparar resultatet
namespace.Vector.prototype.plus = function(v){
	this.set(Vector.plus(this, v));
}

/**
 * Subtraherar två vektorer
 * @param  {vector} v1 Första vektorn
 * @param  {vector} v2 Andra vektorn
 * @return {vector}   En ny vector som är v1 - v2
 */
// Statisk version
namespace.Vector.minus = function(v1, v2){
	return new Vector(v1.x - v2.x, v1.y - v2.y);
}
// Lokal version - inget returneras, objekt-vektorn sparar resultatet
namespace.Vector.prototype.minus = function(v){
	this.set(Vector.minus(this, v));
}

/**
 * Subtraherar ett värde från vektor
 * @param  {vector} v Vektorn
 * @param  {number} value Värde att subtrahera från vektorn
 * @return {vector}   En ny vector som är v - värde
 */
// Statisk version
namespace.Vector.minusValue = function(v, value){
	return new Vector(v.x - value, v.y - value);
}
// Lokal version - inget returneras, objekt-vektorn sparar resultatet
namespace.Vector.prototype.minusValue = function(value){
	this.set(Vector.minusValue(this, value));
}

/**
 * Muliplicerar två vektorer
 * @param  {vector} v1 Första vektorn
 * @param  {vector} v2 Andra vektorn
 * @return {vector}   En ny vector som är v1 * v2
 */
// Statisk version
namespace.Vector.multi = function(v1, v2){
	return new Vector(v1.x * v2.x, v1.y * v2.y);
}
// Lokal version - inget returneras, objekt-vektorn sparar resultatet
namespace.Vector.prototype.multi = function(v){
	this.set(Vector.multi(this, v));
}

/**
 * Ger avståndet mellan två koordinat-vektorer (den lokala funktionen mäter mot detta objekt)
 * 
 * @param  {vector} v1 Första vektorn
 * @param  {vector} v2 Andra vektorn
 * @return {number}  Dot-produkt (för polära: första vektorns projekterade längd på den andra)
 */
// Statisk version
namespace.Vector.distance = function(v1, v2){
	var xPow2 = Math.pow((v2.x-v1.x), 2);
	var yPow2 = Math.pow((v2.y-v1.y), 2);
	return Math.sqrt(xPow2 + yPow2);
}
// Lokal version
namespace.Vector.prototype.distance = function(v){
	return Vector.distance(this, v);
}

/**
 * Konverterar en vektor till en unit-vektor (1= max, -1 = min).
 * En unit-vektor beskriver fårhållande och inte absoluta värden.
 * Används t.ex för att beskriva riktning (1,0) = höger, (0,-1) = ned etc.
 * 
 * @return {Vector} En normaliserad vektor (unit-vektor) - lokal funktion konverterar befintlig vektor och returnerar inget
 */
// Statisk version
namespace.Vector.normalize = function(v){
	return new Vector(v.x/v.length, v.y/v.length);
}
// Lokal version - inget returneras, objekt-vektorn sparar resultatet
namespace.Vector.prototype.normalize = function(){
	this.set(Vector.normalize(this));
}


