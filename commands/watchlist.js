const Discord = require("discord.js");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const urlCourses = process.env.CANVAS_API_COURSES_URL;

const meta = {
  
  Authorization: "Bearer " + process.env.CANVAS_TOKEN,
  
};

/* https://www.sqlitetutorial.net/sqlite-nodejs/connect/ */
module.exports = {

  commands: ["watchlist", "wl"],
  expectedArgs: [""],
  permissionError: "You Have no permissions to run this command",
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments, text) => {
    console.log("Watchlist command executed! ")
    const dbPath = path.resolve(__dirname, "db/memory.db");
    
    //api request get all courses because sqlite cant realy keep up 
    axios.get(urlCourses).then(function (response) {
      
      const data = response.data;
      const status = response.status;
      //console.log(data)

        if (status === 200) {
          let db = new sqlite3.Database(
            dbPath,
            sqlite3.OPEN_READWRITE,
            (err) => {
              if (err) {

                console.error(err.message);

              }

              console.log("Connected to the memory database.");
              
            }
          );

          db.serialize(() => {
            //select course id and channel id from watchlist and compare them to the api request so we know what is being watched in the current channel  
            db.all(`SELECT channel_id, course_id FROM watchlist;`, (err, row) => {
                if (err) {
                  
                  console.error(err.message);
                  
                }

                const exampleEmbed = new Discord.MessageEmbed()
                  .setColor("#32a852")
                  .setTitle("Watchlist " + message.channel.name)
                  .setDescription("These are the courses that are being watched on this channel")
                  .setTimestamp();

                row.forEach((element) => {
                  if (element.channel_id === message.channel.id) {
                    data.forEach((item) => {
                      if (item.id === element.course_id) {
                        exampleEmbed.addFields({

                          name: item.name,
                          value: element.course_id,

                        });
                      }
                    });
                  }
                });

                message.channel.send(exampleEmbed);

              }
            );
          });

          // close the database connection
          db.close((err) => {
            if (err) {

              return console.error(err.message);

            }

            console.log("Close the database connection.");

          });
        }
      })
      .catch(function (error) {

        console.log(error);

      });
  },
  permissions: [],
  requiredRoles: [],
};
