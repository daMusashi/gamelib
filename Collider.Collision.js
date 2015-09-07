var namespace = Gamelib.useNamespace("Collider");

namespace.Collission = function(collider, collisionPosition, collisionNormal){
	this.collider = collider || false;
	this.pos = collisionPosition || null;
	this.normal = collisionNormal || null;
	
	this.participator = participatorCollision || null; // medverkande i kollisionen som collider
	this.force = 1; // påverkan på nya hastighets-vektorn som faktor * vektor-length (magnitude)
}