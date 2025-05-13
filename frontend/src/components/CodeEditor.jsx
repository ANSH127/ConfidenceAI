import React, {useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({editorRef}) {
  
  const [language, setLanguage] = useState("cpp");

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
  }

  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select Language:{" "}
          <select value={language} onChange={handleLanguageChange}>
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="typescript">TypeScript</option>
          </select>
        </label>
      </div>
      <Editor
        height="80vh"
        defaultLanguage="cpp"
        language={language}
        defaultValue="// some comment"
        theme="vs-dark"
        onMount={handleEditorDidMount}
      />
    </>
  );
}