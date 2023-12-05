'use client'

import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"

import React, { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import GithubD from "../editor_themes/GitHub Dark.json"


export default function Home() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    console.log("hhh", editor, monaco);
    monaco.editor.defineTheme("githubdark", GithubD)
    monaco.editor.setTheme("githubdark")
    editorRef.current = editor;
  }
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight md:text-xl">
          To format and validate your CloudFormation, just copy + paste it below:
        </h1>
      </div>
      <Editor
        height="50vh"
        defaultLanguage="yaml"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
      />
      <div className="flex gap-4">
        <Button value="Validate CloudFormation" name="Validate CloudFormation" variant="default">
          Validate CloudFormation
        </Button>
        <Button value="Clear CloudFormation Input" name="Clear CloudFormation Input" variant="outline">
          Clear
        </Button>
      </div>
    </section>
  )
}
