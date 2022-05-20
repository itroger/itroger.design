import React, { useState } from 'react'
import { Prisma, Post } from '@prisma/client'
import { Button, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { Editor } from '@bytemd/react'
import editor from '@utils/editor'
import axios from 'axios'
import { uploadFile, getFiles, deleteFiles } from '@utils/files'
import 'bytemd/dist/index.min.css'
import 'highlight.js/styles/github.css'

const PostCreate = () => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [files, setFiles] = useState<string[]>([])

  const handlePublish = async () => {
    if (!title) {
      return showNotification({ message: '请输入文章标题' })
    }
    if (!content) {
      return showNotification({ message: '请编写文章' })
    }

    await deleteFiles(files.filter(file => !getFiles().includes(file)))

    const post = await axios.post<Post, Post, Prisma.PostCreateInput>(
      '/api/post',
      {
        title,
        content
      }
    )
    if (post) {
      return showNotification({ message: '创建文章成功' })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="editor flex gap-4 p-2">
        <TextInput
          className="flex-1 border-none"
          placeholder="输入文章标题..."
          onChange={e => setTitle(e.target.value)}
        />
        <Button className="bg-primary" onClick={handlePublish}>
          发布
        </Button>
      </div>
      <Editor
        locale={editor.locale}
        plugins={editor.plugins}
        value={content}
        onChange={v => setContent(v)}
        uploadImages={async files => {
          const imgArr = await Promise.all(files.map(file => uploadFile(file)))
          setFiles(prevState => [
            ...prevState,
            ...imgArr.map(img => img.url.split('/').reverse()[0])
          ])
          return imgArr
        }}
      />
    </div>
  )
}

export default PostCreate
