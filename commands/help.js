const Discord = require("discord.js");
const { prefix } = require("../config.json");

module.exports = {

  commands: ["help", "h"],
  permissionError: "You Have no permissions to run this command",
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments, text) => {
    console.log("Help command executed! ")
    //simple help msg to show the available commands
    const embed = new Discord.MessageEmbed() // Ver 12.2.0 of Discord.js
      .setTitle("Canvas help")
      .setDescription("List of commands that can be used for now.")
      .addField(
        "Commands: ",
        `**${prefix}watchlist:** courses that are being watched \r\n**${prefix}courses:** All available courses\r\n**${prefix}addcourse <CourseID>:** Add a course to the watchlist\r\n**${prefix}remove <CourseID>:** remove a course from the watchlist\r\n**${prefix}poll:** make a poll\r\n**${prefix}ping:** PONG`,
        false
      )
      .setColor("#FF0000");

    message.channel.send(embed);
    
  },
  permissions: [], //check command-base.js
  requiredRoles: [],
};
