// Server
const HOST = 'server.com/';


// Event listener on the input element
// Whenever it changes, whether that’s a new character, a backspace or a copy-paste, 
// this event listener should read the new value and get new results for us.
const searchInput = document.getElementsByClassName('search__bar__input')[0];


function wrapBoldedCharacters({inputValue, suggestion}) {
    // check if the suggestion starts with the input value
    if (suggestion.startsWith(inputValue)) {
        // if yes it returns a string containing bold characters after the input value
        // we extract the suggestion part which follows the input value
        // and we concatenate it with the input value string in bold
      return `${suggestion.substring(0, inputValue.length)}<b>${suggestion.substring(inputValue.length, suggestion.length)}</b>`;
    }
    // if not it returns the suggestion fully bolded
    return `<b>${suggestion}</b>`;
  }

  
  function createSuggestionElement({suggestion, auxiliaryData}) {
    const auxiliaryString = auxiliaryData ? ` - ${auxiliaryData}` : "";
    const boldProcessedSuggestion = wrapBoldedCharacters({
      inputValue: searchInput.value,
      suggestion
    });
    return `<li class="search__suggestions__list__result">${boldProcessedSuggestion}${auxiliaryString}</li>`
  }

// Whenever auxiliary data shows up (non-empty after the -), there are multiple results of the same suggestion.
// There’s a small set of results that are unrelated to our input, which simulates autocorrect.
// Some results are exactly the input.
// We have regular suggestions that have the input prefixed
function onSuggestionsResponse(data) {
    // we get elements which are 
  const suggestionsElement = document.getElementsByClassName('search__suggestions__list')[0];
  let suggestionsHTML ="";
  for (const suggestion of data) {
    suggestionsHTML += createSuggestionElement({
      suggestion: suggestion.suggestion,
      auxiliaryData: suggestion.auxiliary
    });
  }
  suggestionsElement.innerHTML = suggestionsHTML;

}

function onNewInput(event) {
  api.get(HOST + 'autocomplete', searchInput.value, onSuggestionsResponse);
}

searchInput.oninput = onNewInput;

function getAutocompleteHandler(data) {
    const NUM_AUTOCOMPLETE_RESULTS = 10;
    const results = [];
    for (let i = 0; i < NUM_AUTOCOMPLETE_RESULTS; i++) {
      results.push({
        suggestion: data + "asdf",
        auxillery: "asdf"
      });
    }
    return results;
  }

  function getRandomString({length}) { 
    const characterChoices = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 "; 
    const characters = [];
    while (characters.length < length) {
      const randomIndex = Math.floor(Math.random() * characterChoices.length);
      characters.push(characterChoices[randomIndex]);
    }
    return characters.join('');
  }
  
  function getRandomInteger({min, max}) {
    return Math.floor(Math.random() * (max - min) + min);
  }

function generateSuggestion(prefix) {
  const RATIO_EXACT_MATCH = 0.3;
  const RATIO_AUTOCORRECT = 0.1;
  
  if (Math.random() < RATIO_AUTOCORRECT) {
    return getRandomString({ length: getRandomInteger({min: 1, max: prefix.length}) });
  }
  
  if (Math.random() < RATIO_EXACT_MATCH) {
    return prefix;
  }
  return prefix + getRandomString({ length: getRandomInteger({min: 1, max: 10}) });
}

function getAutocompleteHandler(data) {
  const MAX_CHARS = 10;
  const NUM_AUTOCOMPLETE_RESULTS = 10;
  const RATIO_AUXILIARY_DATA = 0.1;
  
  if (data.length > MAX_CHARS) {
    return [];
  }
  
  const results = [];
  while (results.length < NUM_AUTOCOMPLETE_RESULTS) {
    const suggestion = generateSuggestion(data)

    if (results.find(result => result.suggestion === suggestion)) {
        continue;
      }
    
    if (Math.random() < RATIO_AUXILIARY_DATA) {
      results.push({
        suggestion, 
        auxillery: getRandomString({ length: getRandomInteger({min: 5, max: 15}) }) 
      });
    } else {
      results.push({ suggestion, auxillery: "" });
    }
  }
  return results;
}

// Endpoints 
const endpoints = {
    "/": {
      "get": () => "hello world"
    },
    "/autocomplete": {
        "get": getAutocompleteHandler
      }
  }
  
  // API library
  
  function getFunction(url, data, callback) {
    const domain = url.substring(0, url.indexOf("/"));
    const endpoint = url.substring(url.indexOf("/"), url.length);
  
    callback(endpoints[endpoint]["get"](data));
  }
  
  const api = {
    get: getFunction
  };



  // ----------------------------------------//
  // Show and Hide the suggestionsList according
  // if you HOVER outside or not 
  // ----------------------------------------//

function showSuggestionsList () {
    const suggestionsList = document.querySelector('.search__suggestions__list');
    suggestionsList.style.display = 'block';

}

function hideSuggestionsList () {
    const suggestionsList = document.querySelector('.search__suggestions__list');
    suggestionsList.style.display = 'none';

}