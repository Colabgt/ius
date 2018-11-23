var express = require('express');
var appa = express();
appa.set('port', (process.env.PORT || 5000));
appa.get('/', function(request, response) {
  
});
appa.listen(appa.get('port'), function() {
  console.log('Node app is running on port', appa.get('port'));
});

const TelegramBot = require('node-telegram-bot-api');
const token = '797278660:AAH9P6t9lkDN3INtF8n5AQNqRNk30xpfzCk';
const bot = new TelegramBot(token, {polling: true});
const request = require('request');
const weather = require('weather-js');
//henry 
const  Telegram = require('telegraf');
const app = new Telegram('797278660:AAH9P6t9lkDN3INtF8n5AQNqRNk30xpfzCk');

bot.onText(/\/init/, (msg) => { 
 var id = msg.chat.id;
 console.log(id);
 const schedule = require('node-schedule');
 var j = schedule.scheduleJob({hour: 6, minute: 1},function(){
    console.log('task');
    app.telegram.sendMessage(id, "Recuerda cumplir tus retos"); 
  });
 });

bot.onText(/\/link/, (msg) => {
   bot.exportChatInviteLink(msg.chat.id).then(invite_link => {
     bot.sendMessage(msg.chat.id, invite_link);
      });
 });

bot.on('message', function(msg){
   
  	var chatId = msg.chat.id;
	var chatitle = msg.chat.title;
  
    if (msg.new_chat_members != undefined){
    
        var nameNewMember = msg.new_chat_member.first_name;
    
        bot.sendMessage(chatId, "Hola " + nameNewMember + " bienvenido al grupo" + chatitle+ "escribe /empezar para conocer los comandos de este Agente");
    }
    else if (msg.left_chat_members != undefined){
    
        var nameLeftMember = msg.left_chat_member.first_name;
        
        bot.sendMessage(chatId, " te extrañare" + nameLeftMember);
    }
});

// expulsar cuando escriba idiota
 bot.on('message', (msg) => {
 var what = "idiota";
 if (msg.text.includes(what)) {
 bot.kickChatMember(msg.chat.id,msg.from.id);
 bot.unbanChatMember(msg.chat.id,msg.from.id);
 }
 });

  bot.on('message', (msg) => {
 var what = "fuck";
 if (msg.text.includes(what)) {
 bot.kickChatMember(msg.chat.id,msg.from.id);
 bot.unbanChatMember(msg.chat.id,msg.from.id);
 }
 });

   bot.on('message', (msg) => {
 var what = "maldito";
 if (msg.text.includes(what)) {
 bot.kickChatMember(msg.chat.id,msg.from.id);
 bot.unbanChatMember(msg.chat.id,msg.from.id);
 }
 });
// bienvenida al grupo
 bot.onText(/\/ayuda/, (msg) => {
bot.sendMessage(msg.chat.id, "/ban: para eliminar a un usuario. manteniendo presionado un mensaje del usuario especifico + numero que sera la cantidad de dias a eliminar"  
    + "\n /boton: despliega el menu del agente IUS con un boton de acceso a la aplicacion" 
    + "\n /promover: convertir usuario a administrador. manteniendo presionado un mensaje del usuario especifico" 
    +  "\n /clima + pais: da el clima. " 
    + "\n /link: obtiene el link de invitacion de grupo" 
    +  "\n  "   
    + " \n /Ubucacion  al contactar al bot directamenta  te da tu ubicacion y tu numero de telefono"
    );    
 });
// genera el ID
 bot.onText(/chatid/, (msg) => {
const chatId = msg.chat.id;
bot.sendMessage(chatId, "El id de este chat es: " + chatId);
});
// genera el ID personal
bot.onText(/\/myid/, (msg) => {
 const chatId = msg.chat.id;
 const myId = msg.from.id;
 bot.sendMessage(chatId, "Tu id es: " + myId);  
 });

// enfia foto de una url
 bot.onText(/\/foto/, (msg) => {
 bot.sendPhoto(msg.chat.id,"https://www.google.com.gt/search?q=frases+motivacionales&source=lnms&tbm=isch&sa=X&ved=0ahUKEwj26J28zvfdAhVQhOAKHTRVDpYQ_AUIDigB&biw=1366&bih=657#imgrc=rFLE9dR8LxuSwM:" ); 
 });
// envia audio en formato ogg
 
// da la direccion de sierto punto geografico estatico


// da la localizacion ()
bot.onText(/Ubucacion/, (msg) => {
  const opts = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{text: 'localizacion', request_location: true}],
        [{text: 'contacto #Phone', request_contact: true}],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),

  };
  bot.sendMessage(msg.chat.id, 'Selecciona una de las opciones', opts);
});

bot.on('localizacion', (msg) => {
  console.log(msg.location.latitude);
  console.log(msg.location.longitude);
});

// da el clima de sierto lugar
bot.onText(/^\/clima (.+)/, function(msg, match){
    var chatId = msg.chat.id;
    var ciudad = match[1];

    var opciones = {
        search: ciudad, // lugar es la ciudad que el usuario introduce
        degreeType: 'C', // Celsius
        lang: 'es-ES' // Lenguaje en el que devolverá los datos
    }

    weather.find(opciones, function(err, result){

        if (err){ // Si ocurre algun error...
            console.log(err); // ... nos lo muestra en pantalla

        } else {
            console.log(result[0]); // Visualizamos el primer resultado del array
            
            bot.sendMessage(chatId, "Lugar: " + result[0].location.name +
            "\n\nTemperatura: " + result[0].current.temperature + "ºC\n" +
            "Visibilidad: " + result[0].current.skytext + "\n" +
            "Humedad: " + result[0].current.humidity + "%\n" +
            "Dirección del viento: " + result[0].current.winddisplay + "\n"
            ,{parse_mode: 'Markdown'});

        }
    })
});

// banea a sierto usuario
bot.onText(/^\/ban (.+)/, function(msg, match){

    var chatId = msg.chat.id;
    var userId = msg.from.id;
    var replyId = msg.reply_to_message.from.id;
    var replyName = msg.reply_to_message.from.first_name;
    var fromName = msg.from.first_name;
    var messageId = msg.message_id;
    var text = match[1];
    const ms = require("ms");

    if (msg.reply_to_message == undefined){
        return;
    }
    
    bot.getChatMember(chatId, userId).then(function(data){
        if((data.status == 'creator') || (data.status == 'administrator')){
        bot.kickChatMember(chatId, replyId, {until_date: Math.round((Date.now() + ms(text + " days"))/1000)}).then(function(result){
                bot.deleteMessage(chatId, messageId);
                bot.sendMessage(chatId, "El usuario " + replyName + " ha sido baneado durante " + text + " días.")
            })
        }
        else {
        bot.sendMessage(chatId, "Lo siento " + fromName + ", no eres administrador")
        }
    })
});

// quita la funcion banear
bot.onText(/^\/unban/, function(msg){
    
    var chatId = msg.chat.id;
    var replyId = msg.reply_to_message.from.id;
    var userId = msg.from.id;
    var replyName = msg.reply_to_message.from.first_name;
    var fromName = msg.from.first_name;
    var messageId = msg.message_id;
    
   if(msg.reply_to_message == undefined){
   return;
   }
   
  bot.getChatMember(chatId, userId).then(function(data){
       if((data.status == 'creator') || (data.status == 'administrator')){
            bot.unbanChatMember(chatId, replyId).then(function(result){
                bot.deleteMessage(chatId, messageId);
                bot.sendMessage(chatId, "El usuario " + replyName + " ha sido desbaneado");
            })
        }
        else {
            bot.sendMessage(chatId, "Lo siento " + fromName + ", no eres administrador");
        }
    })
});

// promueve a admin 
bot.onText(/^\/promover/, function(msg){

// Fijamos las variables
    var chatId = msg.chat.id;
    var userId = msg.from.id;
    var replyId = msg.reply_to_message.from.id;
    var replyName = msg.reply_to_message.from.first_name;
    var userName = msg.from.first_name;
    var messageId = msg.message_id;
//

// Fijamos las propiedades con su respectivo valor
    const prop = {};
    
    prop.can_delete_message = true;
    prop.can_change_info = false;
    prop.can_invite_users = true;
    prop.can_pin_messages = true;
    prop.can_restrict_members = true;
    prop.can_promote_members = false;
// 

    if (msg.reply_to_message == undefined){
        return;
        }

    bot.getChatMember(chatId, userId).then(function(data){
        if ((data.status == 'creator') || (data.status == 'administrator')){
            bot.promoteChatMember(chatId, replyId, prop).then(function(result){
                bot.deleteMessage(chatId, messageId);
                bot.sendMessage(chatId, "Ahora " + replyName + ", es administrador.")
        })
    }
else {
    bot.sendMessage(chatId, "Lo siento " + userName + ", no eres administrador" )
        }
    })
});

//  regresa a usuario normal
bot.onText(/^\/user/, function(msg) {

    var chatId = msg.chat.id;
    var replyName = msg.reply_to_message.from.first_name;
    var replyId = msg.reply_to_message.from.id;
    var userId = msg.from.id;
    var fromName = msg.from.first_name;
    var messageId = msg.message_id;
    const prop = {};
    
    prop.can_change_info = false;
    prop.can_delete_message = false;
    prop.can_invite_users = false;
    prop.can_pin_messages = false;
    prop.can_restrict_members = false;
    prop.can_promote_members = false;
// 

    if (msg.reply_to_message == undefined) {
        return;
    }

    bot.getChatMember(chatId, userId).then(function(data) {
        if ((data.status == 'creator') || (data.status == 'administrator')) {
            bot.promoteChatMember(chatId, replyId, prop).then(function(result) {
                bot.deleteMessage(chatId, messageId)
                bot.sendMessage(chatId, "Ahora " + replyName + ", ya no es administrador.")
            })
        } 
        else {
            bot.sendMessage(chatId, "Lo siento " + fromName + " no eres administrador.")
        }
    })
});

// da informe del tipo de chat
bot.onText(/^\/chat/, function(msg){
    var chatId = msg.chat.id;
    var chatType = msg.chat.type;

    if (chatType == 'private'){
        
        bot.sendMessage(chatId, "este chat esta en privado")
    }

    else if (chatType == 'supergroup'){
        
        bot.sendMessage(chatId, "este chat es un supergrupo");
    }

    else if (chatType == 'group'){
       
        bot.sendMessage(chatId, "este chat es un grupo normal")
    }

    else if (chatType == 'channel'){
        // No hago nada
        return;
    }
});

bot.onText(/menu/, (msg) => {
     bot.sendMessage(msg.chat.id, 'Hola' + " " + msg.from.first_name + " Bienvenido al menu IUS 💪", {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'entrar a IUS',
                    url: 'https://my-first-ius.herokuapp.com/'
                },
                {
                    text: 'INSTRUCCIONES',
                    callback_data: 'hastang'
                },
                    {text: "TIPS" , callback_data: '31'}
                ]
            ]
        }
    })
     bot.on('callback_query', function onCallbackQuery(accionboton){
        const data = accionboton.data
        const msg = accionboton.message
        if(data == 'hastang'){
                bot.sendPhoto(msg.chat.id,"https://res.cloudinary.com/dczpwulei/image/upload/v1542937598/FOTOS/InShot_20181122_194423826_1.jpg",{caption : "envia una foto con una descripción untilizando nuestros hashtag" + "\nUSO:" + "\nUSA LOS  HASHTAG DISPLONIBLES PARA CUMPLIR LOS RETOS Y LLEVAR TU PROGRESO." + "\nHASHTAG: #cardio #water #healthylife #healthyfood." } );
            data = [];      
        };
        if(data == '31'){
                bot.sendMessage(msg.chat.id, 'retos', {
                reply_markup: {
                inline_keyboard: [
                    [
                            {text: "tomar un 🍷" , callback_data: 'agua'},
                            {text: "cardio 🏃🏿" , callback_data: 'cardio'},
                            {text: "frutas 🍌" , callback_data: 'frutas'}
                        ]
                    ]
                }
            });
            data = [];      
        };
        if(data == 'agua'){
                bot.sendPhoto(msg.chat.id,"https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=49553a4f891f5d3c552bfa2edeb9a05f&auto=format&fit=crop&w=1193&q=80",{caption : "tomar un vaso de agua" + "\ntips" + "\nEstudios demuestran que una buena hidratación aumenta tus niveles de cortisol, y por consiguiente disminuye tus niveles de estrés." } );
                data = [];
            };
        if(data == 'cardio'){
                bot.sendPhoto(msg.chat.id,"https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6a437732f90bc9951d6316ee9c1a2565&auto=format&fit=crop&w=1100&q=80",{caption : "5 minutos de cardio" + "\ntips" + "\nTonifica los músculos" } );
                data = [];
            };
        if(data == 'frutas'){
                bot.sendPhoto(msg.chat.id,"https://images.unsplash.com/photo-1485293992701-967314a7c495?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a9b3ca88d031750d17d0f51a3c02c367&auto=format&fit=crop&w=634&q=80",{caption : "Las frutas se caracterizan por ser potentes agentes antioxidantes ." } );
                data = [];
         };    
     }); 
});
