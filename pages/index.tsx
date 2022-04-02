import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import sanityClient from '../sanity'

interface Props {
  collections: Collection[];
}

const Home = ({ collections }: Props) => {
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className='text-red-500 text-4xl font-bold'>Welcome to NFT</h1>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[type == "collection"]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }`

  const collections = await sanityClient.fetch(query);
  console.log(collections);

  return {
    props: {
      collections,
    }
  }
}

export default Home
