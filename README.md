# Hangman game
The classic hangman game as a full-stack app. You can play the game at https://student.labranet.jamk.fi/~AE9377/hangman_client_side/index.html

**It is recommended to play the game in full-screen mode on a computer. On phones, the layout may vary unexpectedly.** 

# Hirsipuu-peli: esittely
Toteutettuna klassinen hirsipuu-peli full-stack sovelluksena. Tämä on ensimmäinen full-stack sovellukseni, joka on tehty harjoitustyönä JAMK:n full stack-kurssilla. 
Reposta löytyy palvelinpuolen koodi. Käyttöliittymän koodi on sijoitettuna JAMK:n palvelimelle.

## Arkkitehtuuri

Alla kuvattuna ohjelman pohjana ollut arkkitehtuuri eli miten käyttöliittymä, backend ja tietokanta on rakentunut ja kuinka ne pääpiirteissään kommunikoivat keskenään.

![Ohjelman arkkitehtuuri][arkkitehtuuri]

[arkkitehtuuri]: /pictures/arkkitehtuuri.png

## Palvelinpuolen ohjelmointi - Backend

JavaScript-dokumentti index.js sisältää backend ohjelmoinnin, johon sisältyy:
- Kirjastot: Express (web-palvelimen toteutus), Mongoose (yhteystietokantaan sekä schemat ja mallit pyynnöille) ja CORS (pyyntöjen salliminen eri toimialueilta ja porteista).
- API-rajapinnat: määrittävät, minkälaisia asiakasohjelmasta lähetettyjen HTTP-pyyntöjen rakenne tulee olla, jotta tietoja käsitellään tietokannassa. Express-kirjaston avulla luotiin web-palvelin, joka reagoi käyttöliittymästä tehtyihin pyyntöihin, palauttaen oikein tehdyllä pyynnöllä dataa tietokannasta.
- Middleware: tässä tapauksessa muuntaa käyttöliittymästä JSON tekstinä tulleet pyynnöt JSON objekteiksi ennen API:lle lähettämistä, jolloin ne on helpommin niiden käsiteltävissä.
- Yhteyden luonti MongoDB-tietokantaan: käytetty Mongoose-kirjastoa.
- Kuunneltava portti: sovellus kuuntelee HTTP-pyyntöjä määritellyssä palvelimen portissa.

## Käyttöliittymän ohjelmointi - Frontend

Sisältää käyttöliittymän HTML-, CSS- ja JavaScript-koodit:
- HTML-tiedosto: sisältää aloitussivun HTML-elementit, joilla piirretään selaimeen näkyville käyttäjälle grafiikkaa.
- CSS-tiedosto: määritelty käyttöliittymässä tarvittavat tyylit.
- JavaScript-tiedosto: sisältää funktioita, joiden avulla luodaan sivustolle toiminnallisuutta, kuten uudet HTML-elementit tarvittaessa, päivitetään pelin tilaa sekä suoritetaan pyyntöjä tietokantaan tietojen hakemiseksi, tallentamiseksi, päivittämiseksi tai poistamiseksi.

## Ulkoasu

Ohjelman aloitusvalikko, jossa voi luoda ja päivittää pelaajan tietoja.

![Aloitus valikko][alkuvalikko]

[alkuvalikko]: /pictures/aloitus.png

Itse pelinäkymä. Sanat valikoidaan sattumanvaraisesti vaikeusasteen mukaan ja myös pisteitä kertyy sen mukaisesti. 

![Pelinäkymä][peli]

[peli]: /pictures/peli.png

Pelin päätyttyä näkyy TOP-10 listaus. Samalla voi poistaa pelaajan käytössä olevan nimimerkin tai lisätä tulevissa peleissä käytettäviä sanoja tietokantaan.

![Loppunäkymä][loppu]

[loppu]: /pictures/loppu.png


## Miten ohjelmaa käytetään?

Sovellusta voi pelata selaimessa osoitteessa: https://student.labranet.jamk.fi/~AE9377/hangman_client_side/index.html

**Peliä kannattaa pelata tietokoneella koko näytöllä, sillä asettelut heittävät erityisesti puhelimen näytöllä.**


## Miksi projekti on tehty ja mitä olen oppinut?

Ohjelman pääasiallinen tarkoitus oli opetella eri full-stack sovelluksen kehitykseen liittyviä teknologioita ja miten ne toimivat keskenään. Itselleni tämä oli opettavainen ja mielekäs projekti, jossa pääsi perehtymään eritoten JavaScriptiin tarkemmin. Sisällöltään hirsipuu-pelin toteuttaminen ei ollut kaikista omaperäisin idea ja se toimisi vallan hyvin myös frontend-sovelluksenakin, mutta aiheena sopi kuitenkin hyvin pienen full-stack sovelluksen toteuttamiseen. Käyttöliittymän ohjelmointi tulee tulevaisuudessa luultavasti olemaan helpompaa, kun pääsee joskus tutustumaan esimerkiksi Reactiin tarkemmin. Nyt esimerkiksi yksittäisten elementtien luonti JavaScriptillä oli suhteellisen työlästä. Erityisen kiva oli päästä raapaisemaan pintaa palvelinpuolen ohjelmoinnista luomalla API-rajapintoja ja MongoDB-tietokannan sisältöä. Ohjelman asettelut eivät kaikilla näyttökooilla ole optimaaliset, lisäominaisuuksia voisi aina olla lisää ja muutenkin testausta olisi voinut olla enemmän, mutta kokonaisuutena ohjelma ajaa asiansa. Mukavia pelihetkiä :)

## Ohjelman tekijä

@HeikkiGithub
