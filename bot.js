const Discord = require('discord.js');
const client = new Discord.Client();

var fs = require('fs'),
request = require('request');
var images = require("images");
var token = require('./ressources/token.js').token;

var download = function(uri, filename, callback, message){
  request.head(uri, function(err, res, body){
  	if(!res)
  	{
  		message.channel.send(message.author + " Is this a real file? :thonking:");
  		return;
  	}
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

overlay = 'ressources/IntoTheBreachOverlay.png'
saveto = 'ressources/output.jpg'
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
var num = 0;
client.on('message', msg => {

	if(!msg.author.bot)
	{
	  if (msg.channel.name === 'strategy')
	  {
	  	url = '';
	  	text = msg.content;
	  	if(text.startsWith("overlay"))
	  	{
	  		array = msg.attachments.array()
	  		if(array.length != 0)
	  		{
	  			url = array[0].url;
	  			content = msg.content.substring(8).trim();
	  		}
	  		else 
	  		{
	  			sub = text.substring(8).trim();
	  			i = sub.indexOf("http://");
	  			if(i==-1)
	  			{
	  				i = sub.indexOf("https://")
	  			}
	  			if(i==-1)
	  			{
	  				msg.channel.send(msg.author + " This isn't a valid url!");
	  				return;
	  			}
	  			url = sub.substring(i).trim();
	  			content = sub.substring(0, i).trim();
	  		}
	  		lnum = num;
	  		num++;
	  		to = 'ressources/tomerge_' + lnum;
	  		download(url, to, function()
		  	{
				try
				{
					image_to = images(to);
				}
				catch (err)
				{
						msg.channel.send(msg.author + " I'm pretty sure this isn't an image! You sneaky fox.");
					return;
				}
				image_overlay = images(overlay).resize(image_to.width())
				diff = (image_to.height() - image_overlay.height())/2
	  			if(diff>0)
	  			{
		  			images(to).draw(image_overlay, 0, diff).save(saveto)
		  		}
		  		else
		  		{
		 			image_overlay = images(image_overlay, 0, -diff, image_to.width(), image_to.height())
		 			images(to).draw(image_overlay, 0, 0).save(saveto)
	  			}
				opts = {};
				opts.file = saveto;
				msg.channel.send("["+ msg.author + "] " + content, opts).then( reply =>
				{
					fs.unlinkSync(to);
					fs.unlinkSync(saveto);
					msg.delete();
				})
			}, msg);
	  	}
	  }
	}

});

client.login(token);
