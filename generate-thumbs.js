const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const { promisify } = require("util");
const sharp = require("sharp");
const glob = require("glob");
const potrace = require("potrace");

const imgsDir = path.join("./src/assets/", "**/*.+(jpg|png)");
const writeFile = promisify(fs.writeFile);
const exec = promisify(child_process.exec);
const globP = promisify(glob);
const trace = promisify(potrace.trace);

const addThumbToName = filePath => {
    filePath = [ filePath.split('/')[0] , filePath.split('/')[1], 
    'blur', filePath.split('/')[2] ].join('/')
  const parts = filePath.split(".");
  console.log(parts);
  return [parts[0], '.thumb.', parts[1]].join('');
};

const replaceExt = (filePath, ext) => filePath.replace(/\.(png|jpg)/g, ext);

globP(imgsDir)
  .then(files =>
    Promise.all(files
      .filter(file => !/\.(thumb|primitive|trace)\./.test(file))
      .map(proccessFile)
    )
  )
  .then(() => console.info("Finished"))
  .catch(err => console.error(err));

function proccessFile(file) {
  console.log(`Processing file ${file}`);
  const process = (...callers) => Promise.all(callers.map(caller => caller(file)));
  return process(generateThumb, generateTrace, generatePrimitive);
}

function generateThumb(file) {
  const thumb = addThumbToName(file);
  return sharp(file)
    .resize(64, 64, {fit: 'inside'})
    .toFile(thumb)
    .then(() => console.info(`Outputed file ${thumb}`))
}

function generateTrace(file) {
  const tmpFile = replaceExt(path.basename(file), '.trace.tmp');
  const tempPath = `/tmp/${tmpFile}`;
  const out = replaceExt(file, '.trace.svg');

  return sharp(file).resize(128, 128, {fit: 'inside'}).toFile(tempPath)
    .then(() => trace(tempPath, {
      background: "#F6F8FA",
      color: "#787878"
    }))
    .then(svg => writeFile(out, svg))
    .then(() => console.info(`Outputed file ${out}`));
}

function generatePrimitive(file) {
  const tmpFile = replaceExt(path.basename(file), '.primitive.tmp');
  const tempPath = `/tmp/${tmpFile}`;
  const out = replaceExt(file, '.primitive.svg');

  return sharp(file).resize(512, 512, {fit: 'inside'}).toFile(tempPath)
    .then(() => exec(`/Users/saurabhnanda/projects/go_workspace/bin/primitive -i ${tempPath} -o ${out} -n 500`))
    .then(() => console.log(`Outputed file ${out}`));
}