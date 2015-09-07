function Gamelib(){
    this.stopSpeed = 0.02; // En mimihastighet objekt måste ha för att inte betraktas som stilla. Hastigheter under denna sätts = 0;
};

Gamelib.load = function(libPath, loadedCallback, debug){
	
	Gamelib.libPath = libPath;
	Gamelib.debugLoad = debug || false;
	Gamelib.loadedCallback = loadedCallback || null;

	console.log("Gamelib: Klasser laddas..."); 

	this.classes = [];
	
	// ordning viktig - de baserar sig på varandra
	this.classes.push("Vector");

	this.classes.push("Collider");
	this.classes.push("Collider.Collision");
	this.classes.push("Gameobject");
	this.classes.push("Gameobject.Movingobject");

	Gamelib.classesLoaded = 0;

	// laddar första, Gamelib.loadClass laddar nästa (och nästa nästa) när klar
	Gamelib.loadClass(this.classes[0]);

}

/* LOADER */
Gamelib.loadClass = function(file){

   file = Gamelib.libPath + file + ".js";

   var script = document.createElement("script");

   script.onload = function(){
        
        Gamelib.classesLoaded++;

   		if(Gamelib.debugLoad){
        	console.log("Gamelib: Laddat av klassfil '"+file+"' färdig ["+Gamelib.classesLoaded+" av "+Gamelib.classes.length+"]");
    	}

        if(Gamelib.classesLoaded < Gamelib.classes.length){
        	// Laddar nästa
        	
        	Gamelib.loadClass(Gamelib.classes[Gamelib.classesLoaded])
        } else {
			// allt laddat
			if(Gamelib.debugLoad){
        		console.log("Gamelib: Alla klasser laddade.");
        		//console.log("Gamelib-object:");
        		//console.log(Gamelib);
    		}
        	if(Gamelib.loadedCallback){
        		if(Gamelib.debugLoad){
        			console.log("Gamelib: Kör loaded-callback.");
    			}
        		Gamelib.loadedCallback();
        	} else {
        		if(Gamelib.debugLoad){
        			console.log("Gamelib: Ingen loaded-callback angiven. Idlar.");
    			}
        	}        	
        }
        
    };
    script.onabort = function(){
        console.log("Gamelib: !VARNING! laddning av klassfil '"+file+"' MISSLYCKADES");
    };

    script.src = file;
    document.getElementsByTagName("head")[0].appendChild(script);
}

// efter http://www.kenneth-truyers.net/2013/04/27/javascript-namespaces-and-modules/
Gamelib.useNamespace = function(namespace){
	var nsparts = namespace.split(".");
    var parent = Gamelib;
 
    if (nsparts[0] === "Gamelib") {
        nsparts = nsparts.slice(1);
    }
 
    if(namespace != ""){
	    for (var i = 0; i < nsparts.length; i++) {
	        var partname = nsparts[i];

	        if (typeof parent[partname] === "undefined") {
	            parent[partname] = {};
	        }

	        parent = parent[partname];
	    }
	}

    return parent
}