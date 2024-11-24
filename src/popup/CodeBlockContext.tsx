import { PrismEditor } from "prism-react-editor";
import React, { createContext, useRef, useContext, ReactNode } from "react";

interface CodeBlockContextProps {
  codeBlockRef: React.RefObject<PrismEditor>;
  setEditorRef: (editor: PrismEditor) => void;
  getEditorRef: () => PrismEditor | null;
  removeEditorRef: () => void;
}

const CodeBlockContext = createContext<CodeBlockContextProps | undefined>(
  undefined
);

export const CodeBlockProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const codeBlockRef = useRef<PrismEditor>(null);

  function setEditorRef(editor: PrismEditor) {
    codeBlockRef.current = editor;
  }

  function getEditorRef(): PrismEditor | null {
    return codeBlockRef.current ?? null;
  }

  function removeEditorRef() {
    codeBlockRef.current = null;
  }

  return (
    <CodeBlockContext.Provider
      value={{ codeBlockRef, setEditorRef, getEditorRef, removeEditorRef }}
    >
      {children}
    </CodeBlockContext.Provider>
  );
};

export const useCodeBlockContext = (): CodeBlockContextProps => {
  const context = useContext(CodeBlockContext);
  if (!context) {
    throw new Error(
      "useCodeBlockContext must be used within a CodeBlockProvider"
    );
  }
  return context;
};
