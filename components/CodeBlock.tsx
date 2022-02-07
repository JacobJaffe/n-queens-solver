import React from "react";

export const CodeBlock: React.FC<{ json: boolean }> = ({ json, children }) => (
  <pre className="bg-gray-200 p-4 border-gray-500 shadow-md border rounded-md font-mono whitespace-pre-wrap">
    <code>{json ? JSON.stringify(children, null, 2) : children}</code>
  </pre>
);
