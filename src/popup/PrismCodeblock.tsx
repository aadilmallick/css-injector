import React, { useEffect, useRef } from "react";
import { Editor, PrismEditor } from "prism-react-editor";
import { BasicSetup } from "prism-react-editor/setups";

// Adding the JSX grammar
// Adds comment toggling and auto-indenting for JSX
import "prism-react-editor/prism/languages/jsx";
import "prism-react-editor/languages/jsx";

// Adding the CSS grammar
// Adds comment toggling and auto-indenting for CSS
import "prism-react-editor/prism/languages/css";
import "prism-react-editor/languages/css";

import "prism-react-editor/layout.css";
import "prism-react-editor/themes/github-dark.css";

// Required by the basic setup
import "prism-react-editor/search.css";
import { useCodeBlockContext } from "./CodeBlockContext";

const PrismCodeblock = ({
  language,
  defaultCode,
  onCodeChange,
}: {
  language: "jsx" | "css" | "html";
  defaultCode?: string;
  onCodeChange?: (code: string) => void;
}) => {
  const { setEditorRef, removeEditorRef } = useCodeBlockContext();
  const codeRef = useRef<PrismEditor>(null);

  useEffect(() => {
    if (codeRef.current) {
      setEditorRef(codeRef.current);
    }
  }, [codeRef.current]);

  useEffect(() => {
    return () => {
      removeEditorRef();
    };
  }, []);

  return (
    <Editor
      language={language}
      value={defaultCode ?? ""}
      wordWrap
      style={{
        width: "100%",
      }}
      onUpdate={(value, editor) => {
        onCodeChange?.(value);
      }}
      ref={codeRef}
    >
      {(editor) => <BasicSetup editor={editor} />}
    </Editor>
  );
};

export default PrismCodeblock;
