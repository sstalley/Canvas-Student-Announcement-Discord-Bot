const { number } = require("assert-plus");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const { prefix } = require("../config.json");

const urlCourse = process.env.CANVAS_API_COURSE_URL;

const meta = {

  Authorization: "Bearer " + process.env.CANVAS_TOKEN,

};

/* https://www.sqlitetutorial.net/sqlite-nodejs/connect/ */
module.exports = {
  commands: ["addCourse", "ac"],
  expectedArgs: ["<CourseID> <ChannelID>"],
  permissionError: "You Have no permissions to run this command",
  minArgs: 1,
  maxArgs: 2,
  callback: (message, arguments, text, client) => {
    
    console.log("AddCourse command executed! ")
    console.log("arguments:", arguments);
    const content = Number(arguments[0]);
    const dbPath = path.resolve(__dirname, "db/memory.db");
    const numargs = arguments.length

    // Use Specified Channel ID, otherwise just use this channel
    console.log("numargs:", numargs);
    if (numargs > 1) {
      channelid = arguments[1];
      console.log("using custom channel");
      client.channels.fetch(channelid).then(channel => console.log("found channel:", channel.name, "in server", channel.guild.name));

    } else {
      channelid=message.channel.id
    }
    console.log("channelid:", channelid);

    if (Number.isInteger(content)) {

    //api request to get the course that is entered in as argument and enter it tp the table watchlist with the channel id

    axios.get(urlCourse.replace('[courseid]', JSON.stringify(content))).then(function (response) {
      
        const data = response.data;
        const status = response.status;

        console.log("status:", status);
            
        //check if request is oke
        if (status === 200) {
          //return confirmation that course is added to watchlist
          message.channel.send(
            data.name + "  has been added to watch list for channel : **" +  message.channel.name + "**");

          if (numargs > 1) {
            client.channels.fetch(channelid).then(channel => {
              channel.send("Updates from " + data.name + " will now be tracked on this channel.");
            });
          }

          //open db 
          let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
              if (err) {
                
                console.error(err.message);
                
              }
              
              console.log("Connected to the memory database.");
              
            }
          );

          db.serialize(() => {
            //Insert course id and channel id to watchlist
            db.run(`INSERT INTO watchlist (channel_id, course_id) VALUES (` + channelid + `,` + data.id + `)`, (err, row) => {
                if (err) {
                  
                  console.error(err.message);
                  
                }

                console.log("Your record had been pushed to the DB succesfully!");

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
        message.channel.send("The course: **" + content + "** can not be found!");
        
      });
    }if (isNaN(content)) {

      message.reply(`Incorrect syntax! Use ${prefix}addCourses <courseID>. Why the hell did u type "` + arguments[0] + `"`);
      
    }
  },
  permissions: [],
  requiredRoles: [],
};
