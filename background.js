let state = {};

async function handlePopupMsg(msg) {
  switch (msg.action) {
  case "url":
    return Promise.resolve(state);
  case "set":
    return browser.tabs.sendMessage(state.tab, "");
  }
  return Promise.reject();
}

function handleContentMsg(msg, sender) {
  if (msg.action === "register") {
    browser.browserAction.enable(sender.tab.id);
    state.url = msg.url;
    state.tab = sender.tab.id;
  }
}

browser.browserAction.disable();
browser.runtime.onMessage.addListener((msg, ...args) => {
  switch (msg.sender) {
  case "content":
    return handleContentMsg(msg, ...args);
  case "popup":
    return handlePopupMsg(msg ,...args);
  }
});
