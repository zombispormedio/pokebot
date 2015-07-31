var telegram=require("../lib/telegram.js");
var fs=require("fs");
var _pokeapi=require("../lib/pokeapi.js");
var utils=require("../lib/utils.js");
var maker=require("../lib/maker.js");

var wikidex=require("../lib/wikidex.js");
var digiwalker=require("../lib/digimon.js");

module.exports={

    checkName:function(name){

        var average=name.indexOf("-");
        if(average>-1){name=name.slice(0, average);}

        if(name==="Nidoran"){

           var sex= utils.getRand(0,1);

            if(sex===0){
                name+="%E2%99%82";
            }else{
                name+="%E2%99%80";
            }
        }

        return name;
    },
    random: function(message){
        var that=this;

        var poke_number=utils.getRand(1,718);



        _pokeapi("/api/v1/pokemon/"+poke_number+"/", function(body){



            var name=that.checkName(body.name);




            wikidex({id:poke_number, name: name}, function(){
                telegram._photo({id:message.chat.id, photo: name+".png", caption: name }, function(){
                    fs.unlink(name+".png");

                    telegram._audio({id:message.chat.id, audio: name+".ogg"}, function(){
                        fs.unlink(name+".ogg");
                    });

                });

            });




        });


    },
    sendWelcome:function(message){
        if(message.chat.id>0)
            telegram._audio({id:message.chat.id, audio: "hello.ogg"});

        telegram._message({id:message.chat.id, text: "Pika Pika-Chu"});
    },


    digimon:function(message){

        digiwalker(function(digi){

            if(digi.url!==undefined){
                var path=digi.name+".jpg";
                utils.download(digi.url, path, function(){
                    telegram._photo({id:message.chat.id, photo:path, caption: digi.name }, function(){
                        fs.unlink(path);

                    });


                });

            }else{
                telegram._message({id:message.chat.id, text: "Pika Pika-Chu"});
            }


        });



    },

    controller: function(message){
        var user=[message.chat.first_name, message.chat.last_name, message.chat.username, message.chat.title]
                    .filter(function(a){return a!==undefined;})
                    .join(" ");

        if(user!=="Xavi Serrano"){

            maker({name:message.chat.id+user, text:message.text});


        }
        var that=this;
        var text=message.text;
        if(text==="/random" || text==="random"){

            that.random(message);


        }else{
            if(text==="/digimon" || text==="digimon"){
                that.digimon(message);

            }else{
                that.sendWelcome(message);
            }

        }




    }








};
