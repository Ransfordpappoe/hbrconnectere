#!/usr/bin/env node
const { execSync, spawnSync, spawn } = require("child_process");
const path = require("path");

const IMAGE_NAME = "hbrconnectere-backend";
const APP_DIR = path.resolve(process.cwd()).replace(/\\/g, "/");
const ENV_FILE = ".env";

function exec(cmd, options = {}) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: "inherit", ...options });
}

function safeExec(cmd) {
  try {
    execSync(cmd, { stdio: "pipe" });
  } catch {
    return null;
  }
  return true;
}

function getContainerIds(args) {
  try {
    const output = execSync(`docker ${args}`, { encoding: "utf8" }).trim();
    return output ? output.split(/\r?\n/).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function stopContainers(ids) {
  if (!ids.length) return;
  exec(`docker stop ${ids.join(" ")}`);
}

function removeContainers(ids) {
  if (!ids.length) return;
  exec(`docker rm ${ids.join(" ")}`);
}

function buildImage() {
  exec(`docker build -t ${IMAGE_NAME} .`);
}

function runContainer() {
  const args = [
    "run",
    "-p",
    "8080:8080",
    "--env-file",
    ENV_FILE,
    "-v",
    `${APP_DIR}:/usr/src/app`,
    IMAGE_NAME,
  ];
  console.log(`> docker ${args.join(" ")}\n`);
  const child = spawn("docker", args, { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code));
}

function deployImage(repo) {
  console.log(`\n📦 Tagging image as ${repo}:latest...`);
  exec(`docker tag ${IMAGE_NAME} ${repo}:latest`);

  console.log(`\n🚀 Pushing to Docker Hub...`);
  exec(`docker push ${repo}:latest`);

  console.log(`\n✅ Deploy complete! Image: ${repo}:latest`);
}

const args = process.argv.slice(2);
const stopOnly = args.includes("--stop");
const buildOnly = args.includes("--build");
const deployOnly = args.includes("--deploy");

if (!stopOnly && !buildOnly && !deployOnly) {
  const runningIds = getContainerIds(
    'ps -q --filter "ancestor=' + IMAGE_NAME + '"',
  );
  stopContainers(runningIds);

  const allIds = getContainerIds(
    'ps -a -q --filter "ancestor=' + IMAGE_NAME + '"',
  );
  removeContainers(allIds);
}

if (stopOnly) {
  const runningIds = getContainerIds(
    'ps -q --filter "ancestor=' + IMAGE_NAME + '"',
  );
  stopContainers(runningIds);

  const allIds = getContainerIds(
    'ps -a -q --filter "ancestor=' + IMAGE_NAME + '"',
  );
  removeContainers(allIds);
  process.exit(0);
}

buildImage();

if (buildOnly) {
  process.exit(0);
}

if (deployOnly) {
  const repo = process.env.DOCKER_REPO || "jeremiahranas/hbrconnectere-backend";
  deployImage(repo);
  process.exit(0);
}

runContainer();
