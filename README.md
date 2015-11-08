# suggestion-box

jQuery suggestion box plugin for search suggestions. 

**IMPORTANT: This is still in development and is currently not stable.**

## Usage

Simply add

`<input type="text" id="mySearch" />`

to you HTML, then:

 `$('#mySearch').suggestionBox({url : 'path/to/json'});`
 
 to your javascript.
 
 You will need to supply your JSON suggestions to the plugin, either by providing a `url` to a json file or to a server side script that outputs JSON, or, you can pass your JSON in directly:
 
 ```
 var suggestionBox = $('#mySearch').suggestionBox();
 
  // get JSON from url
 suggestionBox.getSuggestions(`url`);
 
 // Pass in json directly
 suggestionBox.showSuggestions({JSON});
 ```
 
Currently JSON is expected to be provided in in the following format:

```
{
  "results": [
    {
      "suggestion": "Suggestion 1",
      "url": "suggestion1.html"
    },
    {
      "suggestion": "Suggestion 2",
      "url": "suggestion2.html"
    }
  ]
}
```

 



