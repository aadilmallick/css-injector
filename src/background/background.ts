import { Runtime } from "../chrome-api/runtime";
import Scripting from "../chrome-api/scripting";
import Tabs from "../chrome-api/tabs";
import { appSettingsStorage, appStorage } from "./controllers/storage";

async function cssInjector(tabId: number, code: string) {
  await Scripting.executeFunction(
    tabId,
    async ({ code }: { code: string }) => {
      const element = document.getElementById("2022amallick-css-inject");

      if (element) {
        element.remove();
      }

      const elementStyle = document.createElement("style");

      elementStyle.setAttribute("id", "2022amallick-css-inject");
      elementStyle.innerHTML = code;

      document.head.appendChild(elementStyle);
    },
    {
      code,
    }
  );
  await Scripting.executeScripts(tabId, "toastScript.js");
}

Runtime.onInstall({
  onAll: async () => {
    await appStorage.setup();
    await appSettingsStorage.setup();
    const data = await appStorage.getAll();
    console.log("storage", data);
  },
});

Tabs.Events.onTabHighlighted(async (highlightInfo) => {
  const tab = await Tabs.getTabById(highlightInfo.tabIds[0]);
  console.log("Tab highlighted", tab);
  if (tab.url) {
    const css = await appStorage.get(new URL(tab.url).hostname);
    console.log("CSS", css);
    await cssInjector(tab.id, css);
  }
});

Tabs.Events.onTabNavigateComplete(async (tabId, tab) => {
  console.log("Tab updated", tabId, tab);
  if (tab.url) {
    const css = await appStorage.get(new URL(tab.url).hostname);
    console.log("CSS", css);
    await cssInjector(tab.id, css);
  }
});
