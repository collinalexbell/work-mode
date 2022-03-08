#!/usr/bin/node
import crypto from "crypto";
import util from 'util';
import child_process from "child_process"
import path from "path"
import os from "os";
import fs from "fs"
const exec = util.promisify(child_process.exec);

async function dd(of, size) {
  await exec(`dd if=/dev/zero of=${of} bs=1M count=${size}`);
}

async function mkfs(shaname) {
  await exec(`mkfs ext3 -F ${shaname}`)
}

async function mount(dirName, shaName) {
  await exec(`sudo mount ${shaName} ${dirName}`)
}

async function chown(dirName) {
  await exec(`sudo chown ${os.userInfo().username} ${dirName}`)
}

async function umount(dirName) {
  await exec(`sudo umount ${dirName}`)
}

async function mkdir(dirName) {
  await exec(`mkdir ${dirName}`)
}

const configPaths = [`${os.homedir}/.work-mode.json`, `${os.homedir()}/.config/work-mode.json`];
const foundConfigPath = configPaths.find(path => fs.existsSync(path))
if(!foundConfigPath) {
  console.error(`config not found in ${JSON.stringify(configPaths)}`)
}
const config = JSON.parse(fs.readFileSync(foundConfigPath));

function dirToSha(dirname) {
  const shasum = crypto.createHash("sha256").update(dirname).digest("hex");
  return shasum.slice(0, 8);
}


const workModeImgDirName  = (config.workModeImgDirName || "~/.work-mode-imgs").replace("~", os.homedir);
async function workModeOn() {
  Object.entries(config.directories).forEach(async ([dirname, config]) => {
    const workModeDirExists = fs.existsSync(workModeImgDirName);
    if(!workModeDirExists) {
      mkdir(workModeImgDirName);
    }

    const shaName = dirToSha(dirname);
    const fullImgPath = path.format({dir: workModeImgDirName, name: shaName})
    const imgExists = fs.existsSync(fullImgPath);
    if(!imgExists) {
      await dd(fullImgPath, config.size);
      await mkfs(fullImgPath);
    }
    await mount(dirname, fullImgPath);
    await chown(dirname);
  })
}

async function workModeOff() {
  Object.entries(config.directories).forEach(async ([dirname]) => {
    await umount(dirname);
  })
}

const args = process.argv.slice(2)
if(args.length > 0){
  switch(args[0]) {
    case "on":
      await workModeOn();
      break;
    case "off":
      await workModeOff();
      break;
    default:
      console.error("usage: work-mode <on/off>")
  }
}
