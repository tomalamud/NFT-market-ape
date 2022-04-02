import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import sanityClient, { urlFor } from "../../sanity";
import { Collection } from "../../typings";

interface Props {
  collection: Collection
}

function NFTDropPage({ collection }: Props) {

  // AUTH
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  console.log(address);

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left */}
      <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-500 p-1 rounded-xl">
            <img 
              className="w-44 object-cover rounded-xl lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()} alt="" />
          </div>
          <div className="text-center p-5 space-y-2">
            <h1 className="text-4xl font-bold text-white">{collection.nftCollectionName}</h1>
            
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href={'/'}>
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">The <span className="font-extrabold underline decoration-pink-600/50">PAPAFAM</span> NFT Market Place</h1>
          </Link>
          <button onClick={() => (address ? disconnect() : connectWithMetamask())} className="rounded-full bg-rose-400 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base">
            {address ? 'Sing Out' : 'Sing In'}
          </button>
        </header>

        <hr className="my-2 border"/>
        {address && <p className="text-center text-sm text-rose-400 mt-2">You are logged in with wallet {address.substring(0,5)}...{address.substring(address.length - 5)}</p>}
        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0">
          <img className="w-80 h-80 object-cover pb-10 lg:h-full" src={urlFor(collection.mainImage).url()} alt="" />
          
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.title}
          </h1>
          
          <p className="pt-2 text-xl text-green-500">13 / 21</p>
        </div>

        {/* Mint button */}
        <button className="h-16 bg-red-600 text-white w-full rounded-full mt-10 cursor-pointer font-bold">
          MINT NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
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

  const collection = await sanityClient.fetch(query, {
    id: params?.id
  });

  if (!collection) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      collection 
    }
  }
}