import React, { useEffect, useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Post, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Editor } from '@bytemd/react'
import editor from '@/utils/editor'
import axios from 'axios'
import { Input, Button, message } from 'antd'
import { getFiles, deleteFiles, uploadFile } from '@/utils/files'
import 'bytemd/dist/index.min.css'
import 'highlight.js/styles/github.css'

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany()
  return {
    paths: posts.map(post => ({
      params: { id: post.id }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const { params } = context

  const post = await prisma.post.findUnique({
    where: { id: String(params.id) }
  })

  if (post) {
    return {
      props: {
        post: JSON.parse(JSON.stringify(post))
      }
    }
  }

  return {
    redirect: {
      destination: '/post',
      permanent: false
    }
  }
}

const PostEdit: React.FC<{ post: Post }> = props => {
  const { post } = props
  const [title, setTitle] = useState<string>(post.title)
  const [content, setContent] = useState<string>(post.content)
  const [files, setFiles] = useState<string[]>([])

  const router = useRouter()

  useEffect(() => {
    setFiles(getFiles())
  }, [])

  const handleEdit = async () => {
    if (!title) {
      return message.warn('请输入文章标题')
    }
    if (!content) {
      return message.warn('请输入文章内容')
    }

    await deleteFiles(files.filter(file => !getFiles().includes(file)))

    const post = await axios.put<Post, Post, Prisma.PostUpdateInput>(
      `/api/post?id=${props.post.id}`,
      {
        title,
        content
      }
    )

    if (post) {
      message.success('修改文章成功')
    }
  }

  const handleDelete = async () => {
    await deleteFiles(Array.from(new Set([...getFiles(), ...files])))

    await axios.delete<Post, Post, any>(`/api/post?id=${props.post.id}`)

    await message.success('删除文章成功')

    await router.replace('/post/list')
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="editor flex gap-2">
        <Input
          className="flex-1 border-none"
          placeholder="输入文章标题..."
          defaultValue={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Button
          type="primary"
          className="bg-primary tracking-widest"
          onClick={handleEdit}
        >
          发布
        </Button>
        <Button className="bg-pink-400 tracking-widest" onClick={handleDelete}>
          删除
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

export default PostEdit
