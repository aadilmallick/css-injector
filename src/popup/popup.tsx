import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import "./popup.css";
import PrismCodeblock from "./PrismCodeblock";
import { CodeBlockProvider, useCodeBlockContext } from "./CodeBlockContext";
import Tabs from "../chrome-api/tabs";
import PermissionsModel from "../chrome-api/permissions";
import { appStorage } from "../background/controllers/storage";
import Scripting from "../chrome-api/scripting";
import { url } from "valibot";
// import Prism from "prismjs";

// // Import the language(s) you need
// import "prismjs/components/prism-css";

// // Import the CSS theme (e.g., Tomorrow)
// import "prismjs/themes/prism-tomorrow.css";

let websiteTab: chrome.tabs.Tab;

async function applyCSS(code: string) {
  console.log("Applying CSS", code);
  const currentTab = (await Tabs.getCurrentTab()) || websiteTab;
  console.log("Current tab", currentTab);
  if (!currentTab.url) {
    throw new Error("No URL found");
  }
  const permissionsModel = new PermissionsModel({
    origins: [currentTab.url],
  });
  const isGranted = await permissionsModel.request();
  if (!isGranted) {
    return;
  }
  await appStorage.set(new URL(currentTab.url).hostname, code);
  await Scripting.executeFunction(
    currentTab.id,
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
  await Scripting.executeScripts(currentTab.id, "toastScript.js");
}

async function getCSS(): Promise<{ css: string; url: string } | null> {
  const currentTab = await Tabs.getCurrentTab();
  websiteTab = currentTab;
  console.log("Current tab", currentTab);
  if (!currentTab.url) {
    throw new Error("No URL found");
  }
  if (currentTab.url.startsWith("chrome://")) {
    return null;
  }
  const css = await appStorage.get(new URL(currentTab.url).hostname);
  console.log("CSS", css);
  if (!css) {
    return { css: "", url: currentTab.url };
  }
  return {
    css: css,
    url: currentTab.url,
  } as { css: string; url: string };
}

const App: React.FC<{}> = () => {
  const [code, setCode] = useState("");
  const { codeBlockRef } = useCodeBlockContext();
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    getCSS().then((data) => {
      if (data) {
        // if (data.url.startsWith("chrome://")) {
        //   setShouldShow(false);
        //   return;
        // }
        setCode(data.css || "");
      } else {
        setShouldShow(false);
      }
    });
  }, []);

  if (shouldShow === false) {
    return (
      <main className="p-4">
        <h1 className="text-2xl min-w-48">Can't apply styles on this site</h1>
      </main>
    );
  }

  return (
    <main className="w-96">
      <button
        className="text-center block bg-gray-300 text-black font-semibold text-base px-6 py-3 w-[90%] rounded mx-auto my-2 hover:bg-gray-400 transition-colors cursor-pointer"
        onClick={() => applyCSS(codeBlockRef.current.value)}
      >
        Apply CSS
      </button>
      <PrismCodeblock language="css" defaultCode={code} />
      {/* <pre>
        <code className="language-css">
          <textarea name="code" id="" defaultValue={code}></textarea>
        </code>
      </pre> */}
      {/* this is how you refer to assets: they live in the static folder, and you refer to them
      absolutely. */}
    </main>
  );
};

// Highlight all code blocks on the page
// document.addEventListener("DOMContentLoaded", () => {
//   Prism.highlightAll();
// });

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(
  <CodeBlockProvider>
    <App />
  </CodeBlockProvider>
);
