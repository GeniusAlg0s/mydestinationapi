//reuqire expree
const express = require("express");

const cors = require("cors");

const { getUID, getPhoto } = require("./services");
///db
const { db } = require("./Db");
const { urlencoded } = require("express");
// const e = require("cors");
//call express to create sever
const sever = express();
sever.use(cors());

///req.body expect to get payload as json object put on req.body
sever.use(express.json());

///form sends data directly payload when u do put them on req.body
sever.use(urlencoded({ extended: true }));
///sever listen on port

//iff statment
const PORT = process.env.PORT || 3000;
sever.listen(PORT, () => {
  console.log(`server listen on port: ${PORT}`);
});

//routes
//crud
///creat read update delete
///POST  GET  PUT    DELETE

//GET / => db :read opperation
sever.get("/", (req, res) => {
  const { location } = req.query;

  if (!location) return res.send(db);

  const locations = db.filter(
    (dest) => dest.location.toLowerCase() === location.toLowerCase()
  );

  return res.send(locations);
});
//GET /?location => destinations of that location
sever.get("/:location", (req, res) => {});

//POST /
//expects an object {name, location,  description?}
//before we creat a destination in out db, we will get a photo of that description from unsplash
sever.post("/", async (req, res) => {
  const { name, location, description } = req.body;
  if (!name || !location)
    return res.status(400).json({
      error: "name and location are require please enter these values",
    });
  // generate random uid
  const uid = getUID();

  //get picture from unsplash
  const photo = await getPhoto(name);
  db.push({
    uid,
    name,
    photo,
    location,
    description: description || "",
  });
  res.send({ uid });
});
//PUT /?uid
// expect to get  {name, location,  description?}
sever.put("/", async (req, res) => {
  const { uid } = req.query;

  if (!uid || uid.length !== 6)
    return status(400).json({ error: "uid is require 6 digit number" });

  const { name, location, description } = req.body;

  if (!name && !location && !description) {
    return res.status(400).json({
      error: "need at least either name location description",
    });
  }
  let flag = false;
  for (let element of db) {
    if (element.uid === uid) {
      element.description = description ? description : element.description;
      element.location = location ? location : element.location;

      if (name) {
        flag = true;
        const photo = await getPhoto();
        element.name = name;
        element.photo = photo;
      }
      break;
    }
  }
  if (flag) return res.send("found and updated");
  // res.send(db);
});
//DELETE /?uid
sever.delete("/", (req, res) => {
  const { uid } = req.query;
  if (!uid) {
    return status(400).json({
      error: "uid not found",
    });
  }

  for (i = 0; i < db.length; i++) {
    if (db[i].uid == uid) {
      db.splice(i, 1);
    }
  }

  res.send(db);
});
