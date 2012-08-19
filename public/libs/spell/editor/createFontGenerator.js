define(
	'spell/editor/createFontGenerator',
	[
		'underscore'
	],
	function(
		_
	) {
		'use strict'


		/**
		 * Normalizes a color string. Proper color strings start with a sharp.
		 *
		 * @param {String} color
		 * @return {String}
		 */
		var normalizeColor = function( color ) {
			var firstChar = color[ 0 ]

			return ( firstChar && firstChar !== '#' ? '#' : '' ) + color
		}

		var drawRect = function( context, dx, dy, width, height ) {
			context.save()
			{
				// horizontal
				context.fillRect( dx, dy, width, 1 )
				context.fillRect( dx, dy + height - 1, width, 1 )

				// vertical
				context.fillRect( dx, dy + 1, 1, height - 2 )
				context.fillRect( dx + width - 1, dy + 1, 1, height - 2 )
			}
			context.restore()
		}

		var drawBoundingRect = function( context, dx, dy, width, height ) {
			drawRect( context, dx - 1, dy - 1, width + 2, height + 2 )
		}

		var drawDebugGrid = function( context, spacing, charInfos ) {
			// draw spacing
			var doubledSpacing = spacing * 2
			context.fillStyle = '#090'

			_.each(
				charInfos,
				function( charInfo ) {
					drawBoundingRect( context, charInfo.x - spacing, charInfo.y, charInfo.width + doubledSpacing, charInfo.height )
				}
			)

			// draw bounding
			context.fillStyle = '#909'

			_.each(
				charInfos,
				function( charInfo ) {
					drawBoundingRect( context, charInfo.x, charInfo.y, charInfo.width, charInfo.height )
				}
			)
		}

		var createCharMap = function( charSet, map ) {
			return _.reduce(
				_.zip( charSet, map ),
				function( memo, iter ) {
					memo[ iter[ 0 ] ] = iter[ 1 ]

					return memo
				},
				{}
			)
		}

		var createResult = function( canvas, charSet, baseline ) {
			return {
				baseline     : baseline,
				charset      : charSet,
				imageDataUrl : canvas.toDataURL( 'image/png' )
			}
		}

		var createCharSet = function( firstCharCode, lastCharCode ) {
			return _.map(
				_.range( firstCharCode, lastCharCode ),
				function( charCode ) {
					return String.fromCharCode( charCode )
				}
			)
		}

		var setFont =  function( context, font, style, size ) {
			context.font = style + ' ' + size + 'px "' + font + '"'
			context.textBaseline = 'top'
		}

		var createCharInfos = function( context, charSet, outline, size, spacing ) {
			var doubledOutline = outline * 2,
				doubledSpacing = spacing * 2

			return _.reduce(
				charSet,
				function( memo, char ) {
					var widthInfo = context.measureText( char ),
						width     = Math.max( 1, Math.ceil( widthInfo.width ) ) + doubledOutline,
						height    = size

					memo.charInfos.push( {
						char   : char,
						width  : width,
						height : height,
						x      : memo.offsetX,
						y      : 0
					} )

					memo.offsetX += width + doubledSpacing

					return memo
				},
				{
					charInfos : [],
					offsetX : spacing
				}
			).charInfos
		}

		var createTiledCharInfos = function( charInfos, textureWidth, actualHeight, filteringGap, spacing ) {
			var doubledSpacing = spacing * 2

			return _.reduce(
				charInfos,
				function( memo, charInfo ) {
					var charWidthWithSpacing = charInfo.width + doubledSpacing

					if( memo.offsetX + charWidthWithSpacing > textureWidth ) {
						memo.offsetX = spacing
						memo.rowIndex += 1
					}

					memo.charInfos.push( {
						char   : charInfo.char,
						width  : charInfo.width,
						height : actualHeight,
						x      : memo.offsetX,
						y      : memo.rowIndex * ( actualHeight + filteringGap )
					} )

					memo.offsetX += charWidthWithSpacing

					return memo
				},
				{
					charInfos : [],
					offsetX   : spacing,
					rowIndex  : 0
				}
			).charInfos
		}

		var createTotalWidth = function( charInfos, spacing ) {
			var last = _.last( charInfos )

			return last.x + last.width + spacing
		}

		var renderCharSet = function( context, charInfos, color, outlineColor, outline, spacing, offsetY ) {
			context.fillStyle   = normalizeColor( color )
			context.strokeStyle = normalizeColor( outlineColor )
			context.lineWidth   = outline

			_.each(
				charInfos,
				function( charInfo ) {
					// x := charInfo.x + outline, because the additional width due to drawing with an outline is not included in the character width measurement
					if( outline > 0 ) {
						context.strokeText( charInfo.char, charInfo.x + outline, charInfo.y + offsetY )
					}

					context.fillText( charInfo.char, charInfo.x + outline, charInfo.y + offsetY )
				}
			)
		}

		var createMargins = function( imageData ) {
			var data   = imageData.data,
				width  = imageData.width,
				height = imageData.height,
				top    = 0,
				bottom = 0

				// top margin
				var x, y, found = false

				for( y = 0; y < height; y++ ) {
					for( x = 0; x < width; x++ ) {
						if( data[ y * width * 4 + x * 4 + 3 ] ) {
							found = true
							break
						}
					}

					if( found ) {
						top = y
						break
					}
				}

				// bottom margin
				found = false

				for( y = height - 1; y >= 0; y-- ) {
					for( x = 0; x < width; x++ ) {
						if( data[ y * width * 4 + x * 4 + 3 ] ) {
							found = true
							break
						}
					}

					if( found ) {
						bottom = height - ( y + 1 )
						break
					}
				}

				return {
					top    : top,
					bottom : bottom
				}
		}

		var createBaseline = function( charInfos, imageData, spacing ) {
			var data      = imageData.data,
				width     = imageData.width,
				height    = imageData.height

			var baselines = _.reduce(
				charInfos,
				function( memo, charInfo ) {
					var baseline = height,
						fromX    = charInfo.x - spacing,
						untilX   = charInfo.x + charInfo.width + spacing

					for( var x = fromX; x < untilX; x++ ) {
						for( var y = 0; y < height / 2; y++ ) {
							if( data[ y * width * 4 + x * 4 + 3 ] &&
								baseline > y ) {

								baseline = y
								break
							}
						}
					}

					return memo.concat( baseline )
				},
				[]
			)

			var rating = _.reduce(
				baselines,
				function( memo, baseline ) {
					var votes = memo[ baseline ]

					memo[ baseline ] = !votes ? 1 : votes + 1

					return memo
				},
				{}
			)

			var likelyBaseline = _.reduce(
				rating,
				function( memo, votes, baseline ) {
					baseline = parseInt( baseline, 10 )

					if( votes > memo.bestVotes ) {
						memo.baseline  = baseline
						memo.bestVotes = votes

					} else if( votes === memo.bestVotes &&
						baseline < memo.baseline ) {

						memo.baseline  = baseline
					}

					return memo
				},
				{
					baseline  : 0,
					bestVotes : 0
				}
			).baseline

			return likelyBaseline
		}

		var clear = function( context, width, height ) {
			context.clearRect( 0, 0, width, height )
		}

		var ln = function( n ) {
			return Math.log( n ) / Math.log( 2 )
		}

		var computeDimensions = function( charInfos, textureWidth, textureHeight, actualHeight, filteringGap, spacing ) {
			var doubledSpacing = spacing * 2

			var fitsInDimensions = _.reduce(
				charInfos,
				function( memo, charInfo ) {
					var charWidthWithSpacing = charInfo.width + doubledSpacing,
						maxY = memo.rowIndex * ( actualHeight + filteringGap ) + actualHeight

					if( maxY >= textureHeight ) {
						memo.fits = false
					}

					if( memo.offsetX + charWidthWithSpacing > textureWidth ) {
						memo.offsetX = spacing
						memo.rowIndex += 1
					}

					memo.offsetX += charWidthWithSpacing

					return memo
				},
				{
					fits     : true,
					offsetX  : spacing,
					rowIndex : 0
				}
			).fits

			if( fitsInDimensions ) {
				return {
					width  : textureWidth,
					height : textureHeight
				}

			} else {
				var area              = textureWidth * textureHeight,
					nextMagnitude     = Math.ceil( ln( area ) + 1 ),
					nextTextureWidth  = Math.pow( 2, Math.floor( nextMagnitude / 2 ) ),
					nextTextureHeight = Math.pow( 2, Math.ceil( nextMagnitude / 2 ) )

				return computeDimensions(
					charInfos,
					nextTextureWidth,
					nextTextureHeight,
					actualHeight,
					spacing,
					filteringGap
				)
			}
		}

		/**
		 * Creates an object that has the texture width and height as properties.
		 *
		 * @param charInfos
		 * @param totalWidth
		 * @param actualHeight
		 * @param filteringGap Describes how thick the additional row of transparent pixels is which gets inserted between character rows.
		 * @param spacing
		 * @return {*}
		 */
		var createTextureDimensions = function( charInfos, totalWidth, actualHeight, filteringGap, spacing ) {
			filteringGap = filteringGap || 0

			var area      = totalWidth * ( actualHeight + filteringGap ),
				magnitude = Math.ceil( ln( area ) ),
				width     = Math.pow( 2, Math.floor( magnitude / 2 ) ),
				height    = Math.pow( 2, Math.ceil( magnitude / 2 ) )

			return computeDimensions(
				charInfos,
				width,
				height,
				actualHeight,
				filteringGap,
				spacing
			)
		}

		var createCanvas = function( width, height ) {
			var canvas = document.createElement( 'canvas' )

			canvas.width  = width
			canvas.height = height

			return canvas
		}


		var FontGenerator = function() {}

		FontGenerator.prototype = {
			defaults: {
				font         : 'Arial',
				size         : 32,
				style        : 'normal',
				spacing      : 1,
				outline      : 1,
				color        : 'fff',
				outlineColor : '000',
				firstChar    : 32,
				lastChar     : 127
			},

			create : function( settings, debug ) {
				settings = _.defaults( settings, this.defaults )

				var tmpCanvas  = createCanvas( settings.size * 3, settings.size * 3 ),
					tmpContext = tmpCanvas.getContext( '2d' ),
					charSet = createCharSet( settings.firstChar, settings.lastChar )

				setFont( tmpContext, settings.font, settings.style, settings.size )

				var doubledSize = settings.size * 2,
				    charInfos   = createCharInfos( tmpContext, charSet, settings.outline, doubledSize, settings.spacing ),
					totalWidth  = createTotalWidth( charInfos, settings.spacing )


				// perform preliminary pass to determine actual required height
				tmpCanvas.width  = totalWidth
				tmpCanvas.height = doubledSize

				setFont( tmpContext, settings.font, settings.style, settings.size )

				var offsetY = Math.ceil( settings.size / 2 )

				renderCharSet(
					tmpContext,
					charInfos,
					settings.color,
					settings.outlineColor,
					settings.outline,
					settings.spacing,
					offsetY
				)

				var margins = createMargins(
					tmpContext.getImageData( 0, 0, tmpCanvas.width, tmpCanvas.height )
				)

				// "actualHeight" is the height of a character frame in the font map
				var actualHeight = doubledSize - margins.top - margins.bottom


				// render character set again with the actual character height
				if( actualHeight < doubledSize ) {
					tmpCanvas.width  = totalWidth
					tmpCanvas.height = actualHeight

					clear( tmpContext, tmpCanvas.width, tmpCanvas.height )

					setFont( tmpContext, settings.font, settings.style, settings.size )

					renderCharSet(
						tmpContext,
						charInfos,
						settings.color,
						settings.outlineColor,
						settings.outline,
						settings.spacing,
						offsetY - margins.top
					)
				}


				// detect the most likely baseline
				var baseline = createBaseline(
					charInfos,
					tmpContext.getImageData( 0, 0, tmpCanvas.width, tmpCanvas.height ),
					settings.spacing
				)


				// determine texture dimensions
				var filteringGap = 1
				var outputTextureDimensions = createTextureDimensions(
					charInfos,
					totalWidth,
					actualHeight,
					filteringGap,
					settings.spacing
				)


				// transform the character information to a tiled representation
				var tiledCharInfos = createTiledCharInfos(
					charInfos,
					outputTextureDimensions.width,
					actualHeight,
					filteringGap,
					settings.spacing
				)


				// render character set again to produce final texture
				var outputCanvas  = createCanvas( outputTextureDimensions.width, outputTextureDimensions.height ),
					outputContext = outputCanvas.getContext( '2d' )

				setFont( outputContext, settings.font, settings.style, settings.size )

				renderCharSet(
					outputContext,
					tiledCharInfos,
					settings.color,
					settings.outlineColor,
					settings.outline,
					settings.spacing,
					offsetY - margins.top
				)


				// draw the debug overlay
				if( debug ) {
					drawDebugGrid( outputContext, settings.spacing, tiledCharInfos )
				}


				return createResult(
					outputCanvas,
					createCharMap( charSet.join( '' ), tiledCharInfos ),
					baseline
				)
			}
		}


		return function() {
			return new FontGenerator()
		}
	}
)