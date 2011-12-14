var bfs = require('./bfs');

bfs.setroot('temp');

bfs.find('2', function(err, file) {
	if (err) console.log(err);
	
	else console.log(file);
});;
