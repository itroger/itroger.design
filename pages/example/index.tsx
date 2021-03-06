import React from 'react'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { Example } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      examples: JSON.parse(JSON.stringify(await prisma.example.findMany()))
    }
  }
}

const Example: React.FC<{ examples: Example[] }> = props => {
  const { examples } = props

  const { data: session } = useSession()

  return (
    <div className="flex flex-col gap-4 p-4">
      {session && (
        <div className="flex gap-4">
          <Link href="/example/create">
            <a className="flex-1 py-2 font-semibold text-center text-white dark:text-black hover:text-black hover:dark:text-white bg-black dark:bg-white border border-black dark:border-white hover:bg-white hover:dark:bg-black rounded">
              新增示例
            </a>
          </Link>
          <Link href="/example/list">
            <a className="flex-1 py-2 font-semibold text-center text-black dark:text-white hover:text-white hover:dark:text-black bg-white dark:bg-black border border-black dark:border-white hover:bg-black hover:dark:bg-white rounded">
              示例管理
            </a>
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {examples.map(example => (
          <Link
            key={example.text}
            href={`/example/${example.category}/${example.href}`}
          >
            <a className="flex flex-col gap-2 p-4 rounded border border-zinc-800 dark:border-zinc-400 hover:shadow-xl">
              {example.text}
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Example
