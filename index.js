/*
BACKEND ohjelmointi

Tässä dokumentissa on koodattuna web-palvelin Express-moduulin avulla, jotta käyttöliittymästä tulevat HTTP-pyynnöt voidaan käsitellä.
JSON tekstimuodossa asiakasohjelmalta tulevat pyynnöt muunnetaan JSON objekteiksi ennen API:lle lähettämistä.
API:t eli reitit (määritelty minkälaisia pyyntöjä MondoDB-tietokantaan voidaan tehdä) on toteutettu Mongoose-moduulilla (lisäksi yhteys tietokantaan varmistetaan tällä). 
Pyyntöjä hyväksytään kaikilta toimialueilta CORS-moodulin avulla. 
*/

// Tuodaan moduulit käyttöön ja asetetaan kuunneltava portti
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000

// CORS sallii yhteydet eri toimialueilta ja porteista
app.use(cors());

/* Middleware, jolla muutetaan HTTP-pyynnön mukana tuleva JSON string-data JSON objektiksi (ennen lähettämistä palvelimen reiteille ja käsittelijöille)
Varmistetaan, että palvelin pystyy käsittelemään clientin lähettämää JSON dataa, helpottaa datan muokkausta ja lähettämistä tietokantaan
*/
app.use(express.json());

// Yhteys MongoDB tietokantaan mongoose-kirjastoa käyttäen
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://mongoUser:mongo@democluster.mnjnvsa.mongodb.net/hangmanDB?retryWrites=true&w=majority'   
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});                                              

// Testataan toimiiko yhteys ja tulostetaan vastaus konsoliin
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))        // kirjataan virhe konsolille
db.once('open', function() {                                            // yhteys onnistunut
  console.log("Database test: connected")
});

/*
Jokaiselle hangmanDB:n kokoelmalle tulee luoda schema ja malli.
Scheman avulla määritetään millainen dokumenttien rakenne, datatyyppi ym. tulee olla kussakin kokoelmassa.
Malli (model) on yksittäinen instanssi, joka rakennetaan scheman pohjalta. 

hangmanDB-tietokantaa käsitellään mallien avulla.
Käytetään Mongoose-kirjastoa (ODM eli Object Data Modeling kirjasto MongoDB:lle Node.js:ssä) 
*/


// Schema ja model users-kokoelman käsittelyyn: vaaditaan teksti- tai numeromuotoista dataa
const usersSchema = new mongoose.Schema({
    name: { type: String, required: true },         
    points: { type: Number, required: true }, 
    game_level: { type: String, required: true }
});

/* Ensimmäinen parametri, 'User', edustaa mallin yksittäistä nimeä (käytetään viitaamaan tähän malliin koodissa). 
Toisena parametrina määritetään, mitä schemaa käytetään, tässä: usersSchemaa. Kolmas määrittelee kokoelman nimen tietokannassa */
const User = mongoose.model('User', usersSchema, 'users'); 
  
// Schema ja model wordlists-kokoelman käsittelyyn: vaaditaan words-listana
const wordlistSchema = new mongoose.Schema({
    game_level: String,  // pitäisikö olla { type: String, required: true }
    words: [String]     // { type: Array,  required: true }
});
  
const Wordlist = mongoose.model('Wordlist', wordlistSchema, 'wordlists');


/*
Palvelimella seuraavat API-rajapinnat:
- Käyttäjät: luonti, poisto, päivitys ja hakeminen tietokannasta (aloitus- ja loppunäyttöä varten)
- Sanalistojen haku tietokannasta vaikeustason mukaan pelin aloituksessa  ja mahdollisuus päivittää uusia sanoja listoille
*/

// USERS API:t

// POST-pyynnön käsittelijä (handler): Käyttäjän luonti tietokantaan (annettava nimi ja vaikeusaste).
app.post('/users', async (request, response) => {       
    const { name, game_level } = request.body                    

    // Jos nimi tai vaikeusaste uupuu, lähetetään 400-virhestatus
    if (!name || !game_level) {
        return response.status(400).json({ error: "Name and game level required." });
    }

    const user = new User({                             
      name: name,
      points: 0,                                       
      game_level : game_level 
    })

    // Mikäli virheitä esiintyy käyttäjän luonnin aikana, käsitellään ne
    try {
        const savedUser = await user.save();            
        response.json(savedUser);                       
    } catch (error) {
        response.status(500).json({ error: "Failed to create user." });    
    }
});                          


// GET-pyynnön käsittelijä: Haetaan kaikki käyttäjät tietokannasta (pelin lopussa tulostaulua varten).
app.get('/users', async (request, response) => {
    try {
        const users = await User.find({});
        response.json(users);
    } catch (error) {
        response.status(500).json({ error: "Failed to find users." });
    }
});

// GET-pyynnön käsittelijä: haetaan käyttäjä nimen perusteella.
app.get('/users/:name', async (request, response) => {
    try {
        const userName = request.params.name;
        const user = await User.findOne({ name: userName });
        if (user) {
            response.json(user);       // Kyseisen niminen käyttäjä on tietokannassa
        } else {
            response.status(404).end();
        }
    } catch (error) {
        response.status(500).json({ error: "Failed to find the user by that name." });
    }
});

// GET-pyynnön käsittelijä (ID:n kanssa): Haetaan tietty käyttäjä tietokannasta.
app.get('/users/:id', async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        if (user) {
            response.json(user);
        } else {
            response.status(404).end();
        }
    } catch (error) {
        response.status(500).json({ error: "Failed to find the user." });
    }
});

// DELETE-pyynnön käsittelijä: Poistetaan ID:n mukainen käyttäjä tietokannasta. 
app.delete('/users/:name', async (request, response) => {
    const userName = request.params.name;
    try {
        const deletedUser = await User.deleteOne({ name: userName });     
       
        if (deletedUser.deletedCount > 0) {
            response.json({ message: "User deleted successfully." });
        } else {
            response.status(404).json({ error: "User was not found." });
        }
    } catch (error) {
        response.status(500).json({ error: "Failed to delete the user." });
    }
});


// PUT-pyynnön käsittelijä: Käyttäjän nimen ja vaikeusasteen päivitykseen. 
app.put('/users/:name', async (request, response) => {
    const userName = request.params.name;
    const { newName, new_game_level } = request.body;             

    try {
        const user = await User.findOne({ name: userName });              

        if (!user) {
            return response.status(404).json({ error: "User was not found." });
        } 
        
        user.name = newName;               
    
        if (new_game_level !== undefined) {    
            user.game_level = new_game_level; 
        }

        const updatedUser = await user.save(); 

        response.json(updatedUser); 
    } catch (error) {
        response.status(500).json({ error: "Failed to update user's information." });
    }
});


// PUT-pyynnön käsittelijä: Pisteiden päivitys (pelin loputtua).
app.put('/users/:name/:points', async (request, response) => {
    const { name, points } = request.params;                          

    try {
        const user = await User.findOne({ name: name });        
        const pointToUser = points;

        if (!user) {
            return response.status(404).json({ error: "User was not found." }); 
        }
        user.points = pointToUser;
        const updatedUser = await user.save(); 

        response.json(updatedUser); 
    } catch (error) {
        response.status(500).json({ error: "Failed to update points to the user." });
    }
});


// WORSLISTS API:t

// Haetaan kaikki sanalistat tietokannasta. 
app.get('/wordlists', async (request, response) => {
    try {
        const wordlists = await Wordlist.find({});
        response.json(wordlists);
    } catch (error) {
        response.status(500).json({ error: "Failed to find any wordlist." });
    }
});


// Haetaan tietyn vaikeusasteen sanalista (easy, medium tai hard) tietokannasta. 
app.get('/wordlists/:game_level', async (request, response) => {
    try {
        const gameLevel = request.params.game_level;
        const wordlist = await Wordlist.find({ game_level: gameLevel});
        if (wordlist && wordlist.length > 0) {
            response.json(wordlist);
        } else {
            response.status(404).end();
        }
    } catch (error) {
        response.status(500).json({ error: "Failed to find the wordlist." });
    }
});

// Haetaan yksittäinen sana sanalistan vaikeustason mukaan.
app.get('/wordlists/:game_level/:word', async (request, response) => {
    try {
        const gameLevel = request.params.game_level;
        const seekedWord = request.params.word;
        const wordlist = await Wordlist.findOne({ game_level: gameLevel });

        if (wordlist) {
            // Tarkistetaan mikäli 'words'-lista on olemassa ja sillä on elementtejä
            if (wordlist.words && wordlist.words.length > 0) {
                // Etsitään haluttua sanaa 'words'-listalta
                const selectedWord = wordlist.words.find(word => word === seekedWord);
                if (selectedWord) {
                    response.json({ word: selectedWord });
                } else {
                    response.status(404).json({ error: "Requested word not found in the wordlist." });
                }
            } else {
                response.status(404).json({ error: "No words found for this difficulty level." });
            }
        } else {
            response.status(404).json({ error: "Wordlist not found for this difficulty level." });
        }
    } catch (error) {
        response.status(500).json({ error: "Failed to find the wordlist." });
    }
});

// Lisää sana tietyn vaikeustason sanalistaan. (lopussa käyttäjä voi lisätä halutessaan uusia sanoja eri listoille)
app.put('/wordlists/:game_level/:addWord', async (request, response) => {
    try {
        const difficultyLevel = request.params.game_level;
        const wordToAdd = request.params.addWord;
        const wordlist = await Wordlist.findOne({ game_level: difficultyLevel });    

        if (!wordlist) {
            return response.status(404).json({ error: "Wordlist for the given game level was not found." });
        }

        wordlist.words.push(wordToAdd);
        await wordlist.save();

        response.json(wordlist.words);
    } catch (error) {
        response.status(500).json({ error: "Failed to add the word to the wordlist." });
    }
});


// Palvelin kuuntelee porttia 3000 pyyntöjen varalta
app.listen(port, () => {
  console.log('App is listening on port 3000')
})

