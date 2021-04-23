const { default: axios } = require("axios");
const axiso = require("axios");

if (!process.env.PORT) {
  require("../secrets");
}

function getUID() {
  //generate six digit random numbers

  let uid = "";

  for (let i = 0; i < 6; i++) {
    const rand = Math.floor(Math.random() * 10);
    uid += rand;
  }

  return uid;
}
async function getPhotoFromUnsplash(name) {
  const apiKey = `8ePXgV8oHyJvuvqn50YCkv1M5KfpaufKXzgXRXul6nI`;
  const URL = `https://api.unsplash.com/search/photos?client_id=${process.env.unsplashAPIKey}&query=${name}`;

  const res = await axios.get(URL);

  const defaultPhoto = `https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmlrZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60`;

  const photos = res.data.results;
  if (photos.length === 0) return defaultPhoto;

  const photosLength = photos.length;
  const randIdx = Math.floor(Math.random() * photosLength);

  return photos[randIdx].urls.small;
}

module.exports = {
  getUID,
  getPhoto: getPhotoFromUnsplash,
};
