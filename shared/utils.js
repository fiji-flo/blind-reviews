"use strict";

export function parseUrl(url) {
  const re = /^(?:https:\/\/github.com)\/([\w-]+)\/([\w-]+)\/?(?:(?:pull\/(\d+))|(.+))?/;
  const match = url.match(re);

  return match && { org: match[1], repo: match[2], pr: match[3], tail: match[4] } || {} ;
}

export async function set(url, level, visible) {
  const { org, repo, pr } = parseUrl(url);
  let entry = await browser.storage.sync.get(org);
  switch (level) {
  case "org":
    compose(entry, [org], visible)
    break;
  case "repo":
    compose(entry, [org, repo], visible);
    break;
  case "pr":
    compose(entry, [org, repo, pr], visible);
    break;
  }
  return storage.sync.set(entry);
}

export async function get(url) {
  const { org, repo, pr } = parseUrl(url);
  let entry = await browser.storage.sync.get(org);
  let _org = entry[org] || {};
  let _repo = _org[repo] || {};
  let _pr = _repo[pr] || {};
  return {
    org: _org.visible || false,
    repo: _repo.visible || false,
    pr: _pr.visible || false,
  };
}

function compose(entry, path, visible) {
  const attr = path.pop();
  entry[attr] = entry[attr] || {};
  if (path) {
    compose(entry[attr])
  } else {
    entry[attr].visible = visible;
  }
  return entry
}
