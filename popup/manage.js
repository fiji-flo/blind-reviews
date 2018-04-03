"use strict";
import { get, set } from "../shared/utils.js/";

const ORG = document.querySelector("#org");
const REPO = document.querySelector("#repo");
const PR = document.querySelector("#pr");

async function init() {
  let res = await browser.runtime.sendMessage({ sender: "popup", action: "url" });
  let {org, repo, pr} = await get(res.url);
  ORG.checked = !org;
  REPO.checked = !repo;
  PR.checked = !pr;

  addHandler(ORG, "org");
  addHandler(REPO, "repo");
  addHandler(PR, "pr");
}

function addHandler(target, level) {
  target.addEventListener("change", ev => {
    browser.runtime.sendMessage({ sender: "popup", action: "set", level, visible: !target.checked })
  });
}

init();
