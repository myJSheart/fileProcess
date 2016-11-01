const jsonfile = require('jsonfile');
const fs = require('fs'), readline = require('readline'), stream = require('stream'), sharp = require('sharp');

const prefex = 'resources/7/';
const mappingJsonFile = 'resources/SelectMappingTable7.json';
const profilesFile = 'resources/profiles.json';
const resultFile = 'resources/results.json';
const imagePath = 'resources/SelectImg7/'

const avatarJson = jsonfile.readFileSync(mappingJsonFile);

let profileJson = [];

const instream = fs.createReadStream(profilesFile);
const outstream = new stream;
outstream.readable = true;
outstream.writeable = true;
const rl = readline.createInterface({
  input: instream,
  output: outstream,
  terminal: false
});

console.log("Start Reading Profile");
rl.on('line', (line) => {
  let test = JSON.parse(line);
  profileJson.push(test);
});

rl.on('close', () => {
  // Start Mapping
  console.log("Start Mapping");
  profileJson.forEach((profile) => {
    avatarJson.forEach((avatar) => {
      if (profile.url === avatar.WebUrl) {
        profile.avatar = `${prefex}${avatar.SaveName}.jpg`;
      }
    });
  });
  console.log("Start Write Result File");
  // write a new file
  let writeStream = fs.createWriteStream(resultFile);
  profileJson.forEach((profile) => {
    writeStream.write(JSON.stringify(profile) + '\n');
  });
  console.log("Complete Write Files");
  console.log('Start converting images');
  fs.readdir(imagePath, (err, files) => {
    files.forEach((file) => {
      sharp(`${imagePath}${file}`)
        .resize(180,180)
        .toFile(`${prefex}${file}`);
    });
    console.log("All Done!!!");
  });
});
