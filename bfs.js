var fs = require('fs'), 
	p = require('path'),
	
	rootdir = 'temp'; 
	

exports.setroot = function(dir){
	rootdir = dir;
}

exports.find = function(presentationid, callback) { 
	
	// breadthFirst expects array - hence the square brackets 
	breadthFirst([rootdir]); 
	
	function breadthFirst(paths) { 
		
		// An array to keep track of how many directories branch off current level 
		var childpaths = []; 
		
		// A boolean to prevent recursion on match 
		var match = false; 
		
		// Loop through each path at current level 
		paths.forEach(function (path) { 
			// Read path contents (the next level down) 
			var files = fs.readdirSync(path); 
			
			// Loop through files/directories 
			for(i in files) { 

				// Check for a match 
				if(files[i] == presentationid) { 

					// Return will exit the callback from the forEach - use match outside the loop to end recursion 
					match = true; 
					
					// Create absolute path from the path and matched file 
					var absolutePath = p.resolve(p.join(path, files[i])); 
					
					// Fire callback with path 
					return callback(null, absolutePath); 
				} 
				
				// Find out which files are directories 
				var stat = fs.statSync(path + '/' + files[i]); 
				
				// Keep a record of the directories 
				if(stat.isDirectory()) childpaths.push(path + '/' + files[i]); 
			} 
			
		}); 
		
		// Return here to end recursion 
		if (match) return; 
		
		// If there are more directories at the next level, go through the whole process again 
		else if (childpaths.length > 0) breadthFirst(childpaths); 
		
		// Otherwise, we've reached the bottom directory, return 
		else return callback("No such file exists"); 
	}
} 
