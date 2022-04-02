const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const cherio = require('cheerio');
const request = require('request');



//L'objectif est de scraper une image d'un lien donné dans index.html
//Et l'afficher dans lire.html

//L'architecture envisagée c'est :
//L'utilsiateur entre le lien dans index.html et clique sur rechercher -> stockage de du lien dans des cookies pour l'envoyer au serveur node js
//Le serveur node scrape l'image en fonction du lien et retourne une page avec comme nouvceau cookie l'url de l'image et donc peut l'afficher facilement



// const scrap = require('./scraping.js');
//scrap le site lelscan pour récupérer le lien de l'image
function image(req ,res) {
    //Utilisation d'une "Promesse" en Js les promesse permettent d'attendre le résultat d'un requete HTTP
    // C'est la source de ton erreur ton context : "res" il mourait sans attendre la fin de la fonction de ton routeur l.57
    return new Promise( function (resolve, reject){
        request('https://lelscan-vf.cc/manga/vinland-saga/1/1', (err, resp, html) => {
            if (!err && resp.statusCode == 200) {
                console.log("Request was success ");

                // Define Cherio or $ Object 
                const $ = cherio.load(html);

                $(".img-responsive.scan-page").each((index, image) => {
                    var img = $(image).attr('src');
                    var link = img;
                    // resolve renvoie le résultat de la promesse si il n'y a pas eu d'erreurs
                    resolve(link);
                });

            } else {
                console.log("Request Failed ");
                // reject permet d'informer à celui qui attend la fin de la promesse que quelque chose c'est pas bien passé
                reject("Request Failed");
            }

        });
    });
}

//app
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/style.css',function(req,res){
    res.sendFile(path.join(__dirname+'/style.css'));
});


router.get('/lire.html', async function(req,res){
    // Ton routeur maintenant attends la promesse retourné par la fonction image grace au mot clefs await
    // mais si tu utilise await dans une fonction tu l'a rend asynchrone donc il faut précisé avec le mot clef async qui précéde la declaration de ta fonction l.57
    let url = await image(req,res);
    if(url)
        res.cookie("urlimage", url);
    //pense à rajouter un comportement d'erreur si tu arrive au bout d'un chap ta requete enverra une erreur 404
    res.sendFile(path.join(__dirname+'/lire.html'));
});
  

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);
console.log('Running at Port 3000');