const {searchResults} = require('./home.json')
const fs = require('fs');

const t = searchResults.map(i => (
    {
        "type": "Feature",
        "properties": {
          "id": i.sagsnummer
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            i.lat,
            i.lng
          ]
        }
      }
))

fs.writeFile("./dump.json", JSON.stringify(t), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
