import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Example } from '@prisma/client'
import prisma from '@lib/prisma'

export const getStaticPaths: GetStaticPaths = async () => {
  const examples = await prisma.example.findMany({
    select: { category: true, href: true }
  })

  return {
    paths: examples.map(example => ({
      params: { category: example.category, id: example.href }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const { params } = context

  const example = await prisma.example.findUnique({
    where: { href: String(params.id) }
  })

  if (example) {
    return {
      props: {
        example: JSON.parse(JSON.stringify(example))
      }
    }
  }

  return {
    redirect: {
      destination: '/example',
      permanent: false
    }
  }
}

const ExampleDetail: React.FC<{ example: Example }> = props => {
  const { example } = props
  return (
    <div>
      {example && (
        <iframe
          className="w-full border-r border-black rounded overflow-hidden"
          src={example.src}
          style={{ height: 'calc(100vh - 82px)' }}
          title={example.text}
        />
      )}
    </div>
  )
}

export default ExampleDetail
