var language ="sp_SP";

var FRLOCALE = {
  "Hello": "bonjure ",
  "My name is %s": "mo nome oc ",
  "what": "some french thing"
};

var SPLOCALE = {
  "Hello": "Spanish for hello",
  "My name is %s": "spanish for my name is ",
  "what": "qu"
};

function translated(language, string){
    if (language.indexOf("fr") > -1) {
        return FRLOCALE[string] ? FRLOCALE[string] : string;
    } 

    if (language.indexOf("sp") > -1) {
      return SPLOCALE[string] ? SPLOCALE[string] : string;
    }

    return string; 
}

alert(translated(language,"Hello"));

alert(translated(language,"some thing not translated "));