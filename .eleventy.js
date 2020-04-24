const smartquotes = require( 'smartquotes' );
const CleanCSS = require( "clean-css" );

module.exports = function( config )
{
	config.addCollection( 'locations', collection =>
	{
		return collection
			.getFilteredByGlob( 'src/locations/*.md' )
			.filter( location => !location.data.hidden );
	});

	config.addFilter( 'classify', string =>
	{
		let neighborhoods = string.split( ',' );
		let classes = neighborhoods.map( neighborhood =>
		{
			return `nbh-${neighborhood.toLowerCase()}`;
		});

		return classes.join( ' ' );
	});

	config.addFilter( "cssmin", string =>
	{
		return new CleanCSS({}).minify(string).styles;
	});

	config.addFilter( 'list', array =>
	{
		return array
			.join( ", " );
	});

	config.addFilter( "slice", (array, count) =>
	{
		return array.slice( 0, count );
	});

	config.addFilter( 'smartquotes', string =>
	{
		return smartquotes( string );
	});

	config.addFilter( "stringify", (collection) =>
	{
		let data = collection.map( item =>
		{
			return {
				title: item.data.title,
				url: item.data.url,
				neighborhoods: item.data.neighborhoods,
				emoji: item.data.emoji,
				content: item._templateContent.trim(),
			}
		})
		.sort( (a,b) =>
		{
			return a.title < b.title;
		});

		return JSON.stringify( data );
	});

	return {
		dir: {
			input: 'src',
			output: 'dist',
		},

		templateFormats: ['njk', 'md', 'css', 'js', 'html', 'yml'],
	};
};
