define(
	'spellReferenceProject/system/collisionDetector',
	[
		'glmatrix/vec2',

		'spell/shared/util/platform/underscore'
	],
	function(
		vec2,

		_
	) {
		'use strict'


		/**
		 * private
		 */

		var distance           = vec2.create(),
			distanceSquared    = 0,
			minDistanceSquared = 0,
			tmp                = vec2.create()


		var init = function( globals ) { }

		var cleanUp = function( globals ) {}

		var resolveCollision = function( positionA, collisionSphereA, inertialObjectA, positionB, collisionSphereB, inertialObjectB ) {
			var dn = vec2.create()
			vec2.subtract( positionA, positionB, dn )

			// distance between objects
			var delta = vec2.length( dn )

			if( delta === 0 ) {
				positionB[ 0 ] += 0.01
			}

			// normal of the collision plane
			vec2.normalize( dn )

			// tangential of the collision plane
			var dt = vec2.create( [ dn[ 1 ], -dn[ 0 ] ] )

			// masses
			var m1 = inertialObjectA.mass,
				m2 = inertialObjectB.mass,
				M  = m1 + m2

			// minimum translation distance required to separate objects
			var mt = vec2.create()
			vec2.multiplyScalar(
				dn,
				collisionSphereA.radius + collisionSphereB.radius - delta,
				mt
			)

			// pushing the objects apart relative to their mass
			vec2.multiplyScalar( mt, m2 / M, tmp )
			vec2.add( positionA, tmp )

			vec2.multiplyScalar( mt, m1 / M, tmp )
			vec2.subtract( positionB, tmp )

			// current velocities
			var v1 = inertialObjectA.velocity,
				v2 = inertialObjectB.velocity

			// splitting the velocity of the object into normal and tangential component relative to the collision plane
			var v1n = vec2.create(),
				v1t = vec2.create()

			vec2.multiplyScalar( dn, vec2.dot( v1, dn ), v1n )
			vec2.multiplyScalar( dt, vec2.dot( v1, dt ), v1t )

			var v2n = vec2.create(),
				v2t = vec2.create()

			vec2.multiplyScalar( dn, vec2.dot( v2, dn ), v2n )
			vec2.multiplyScalar( dt, vec2.dot( v2, dt ), v2t )

			// calculate new velocity, the tangential component stays the same, the normal component changes analog to the 1-dimensional case
			var v1nlen = vec2.length( v1n ),
				v2nlen = vec2.length( v2n )

			vec2.multiplyScalar(
				dn,
				( m1 - m2 ) / M * v1nlen + 2 * m2 / M * v2nlen,
				tmp
			)
			vec2.add( v1t, tmp, v1 )

			vec2.multiplyScalar(
				dn,
				( m2 - m1 ) / M * v2nlen + 2 * m1 / M * v1nlen,
				tmp
			)
			vec2.subtract( v2t, tmp, v2 )
		}

		var isColliding = function( positionA, collisionSphereA, positionB, collisionSphereB ) {
			vec2.subtract( positionA, positionB, distance )
			distanceSquared = vec2.dot( distance, distance )

			minDistanceSquared = collisionSphereA.radius + collisionSphereB.radius
			minDistanceSquared *= minDistanceSquared

			return distanceSquared <= minDistanceSquared
		}

		var resolveCollisions = function( positions, collisionSpheres, inertialObjects ) {
			var entityIds    = _.keys( positions ),
				numEntityIds = entityIds.length,
				result       = []

			for( var i = 0; i < numEntityIds; i++ ) {
				var collisionSphereA = collisionSpheres[ i ],
					positionA        = positions[ i ]

				for( var j = i + 1; j < numEntityIds; j++ ) {
					var collisionSphereB = collisionSpheres[ j ],
						positionB        = positions[ j ]

					if( isColliding( positionA, collisionSphereA, positionB, collisionSphereB ) ) {
						resolveCollision( positionA, collisionSphereA, inertialObjects[ i ], positionB, collisionSphereB, inertialObjects[ j ] )
					}
				}
			}

			return result
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			resolveCollisions( this.positions, this.collisionSpheres, this.inertialObjects )
		}


		/**
		 * public
		 */

		var CollisionDetector = function( globals, positions, inertialObjects, collisionSpheres ) {
			this.positions        = positions
			this.inertialObjects  = inertialObjects
			this.collisionSpheres = collisionSpheres
		}

		CollisionDetector.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : process
		}

		return CollisionDetector
	}
)
