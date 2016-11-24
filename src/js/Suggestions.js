class Suggestions {
	
	constructor(){
	  this.suggestions = [];
	}

	setSuggestions(suggestions){
      this.suggestions = suggestions;
	}

	getSuggestions(){
	  return this.suggestions;
	}
}

export default Suggestions;