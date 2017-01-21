const discord = require("discord.js");
const request = require("request");
const cheerio = require("cheerio");
const tokenjs = require("./token.js");
const bf4URLs = require("./bf4.js").bf4URLs;

var bot = new discord.Client();

bot.login(tokenjs.token);

bot.on("ready", () => {
    console.log("doyn-bot is ready for action");
});

bot.on("error", (error) => {
    console.log("doyn-bot can't start. Here's the error:\r\n " + error.message);
    bot.destroy();
});

bot.on("message", (message) => {

    // if the message is a command (starts with !)
    if (message.content.substring(0, 1) === "!") {

        // format message
        message.content = message.content.substring(1).trim().toLowerCase();

        if (message.content === "help") {
            message.channel.sendMessage(
                "**doyn-bot commands**\r\n" +
                " **!bf4-list** - list all specific server commands\r\n" +
                " **!bf4-all** - get the player count for all *good* servers"
            );

        } else if (message.content === "bf4-list") {
            var msg = "**BF4 server commands** - these get the player count of their respective servers\r\n";

            for (var key in bf4URLs) {
                msg += " **!" + key + "** - " + bf4URLs[key][1] + "\r\n";
            }

            message.channel.sendMessage(msg.trim());

        } else if (message.content === "bf4-all") {
            sendAllBF4Servers(message);

        } else { // we'll try it as if it's a BF4 server command
            sendBF4Server(bf4URLs[message.content][0], message);
        }
    }
});

function sendAllBF4Servers(message) {
    for (var key in bf4URLs) {
        sendBF4Server(bf4URLs[key][0], message);
    }
}

function sendBF4Server(href, message) {
    request(href, (error, response, html) => {
        var $ = cheerio.load(html);

        // **server name:**
        var messageText = "**" + $("h1.wrappable").text().trim() + ":** ";

        // players / maxPlayers
        messageText += $("h5").first().text().trim();

        // send the message
        message.channel.sendMessage(messageText);
    });
}