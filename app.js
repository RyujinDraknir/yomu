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
function image(req,res) {
    request('https://lelscan-vf.cc/manga/vinland-saga/1/1', (err, resp, html)=>{

        if(!err && resp.statusCode == 200){
            console.log("Request was success ");
            
            // Define Cherio or $ Object 
            const $ = cherio.load(html);
    
            $(".img-responsive.scan-page").each((index, image)=>{
    
                var img = $(image).attr('src');
                var link = img;
                console.log(link)
                res.cookie('urlimage',link)
            });
    
        }else{
            console.log("Request Failed ");
        }
    
    });
}

//app
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/style.css',function(req,res){
    res.sendFile(path.join(__dirname+'/style.css'));
});


router.get('/lire.html', function(req,res){
    console.log(req)
    image(req,res) 
    res.sendFile(path.join(__dirname+'/lire.html'));
});
  

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);
console.log('Running at Port 3000');