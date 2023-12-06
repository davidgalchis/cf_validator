'use client'

import { Button } from "@/components/ui/button"
import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import GithubD from "../editor_themes/GitHub Dark.json"
import {
  useMutation
} from '@tanstack/react-query'
import axios from 'axios';
import { Icons } from "@/components/icons";
import { Alert } from "@/components/ui/alert";


export default function Home() {
  const editorRef = useRef(null);

  const [content, setContent] = useState("");

  // Mutations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateCloudformation = useMutation<Response, any, any>({
    mutationFn: (cloudformation) => {
      return axios.post('/validate-cloudformation', cloudformation)
    }
  })

  function handleSetContent (value: string | undefined) {
    if (value) { setContent(value) }
    else { setContent("") }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleEditorDidMount(editor: any, monaco: any) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
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
        value={content}
        onMount={handleEditorDidMount}
        onChange={handleSetContent}
      />
      <div className="flex gap-4">
        <Button 
          value="Validate CloudFormation" 
          name="Validate CloudFormation" 
          variant="default"
          onClick={() => {
            validateCloudformation.mutate(content)
          }}
          >
          Validate CloudFormation
        </Button>
        <Button 
          value="Clear CloudFormation Input" 
          name="Clear CloudFormation Input" 
          variant="outline"
          onClick={() => {
            handleSetContent("");
            validateCloudformation.reset();
          }}
          >
          Clear
        </Button>
      </div>
      <div className="flex gap-4">
        {validateCloudformation.isPending ? (
          <Icons.spinner className="h-14 w-14 animate-spin" />
        ) : (
          <>
            {validateCloudformation.isError ? (
              <Alert variant="destructive" className="font-bold">An error occurred: {validateCloudformation.error.message}</Alert>
            ) : null}

            {validateCloudformation.isSuccess ? (
              <Alert variant="success" className="font-bold">CloudFormation is valid!</Alert> 
              ) : null}
          </>
        )}
      </div>
    </section>
  )
}
