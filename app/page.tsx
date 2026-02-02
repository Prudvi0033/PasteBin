import React from 'react'
import clientPromise from './lib/db'

const Page = async () => {
  try {
    const client = await clientPromise
    
    await client.db('pastebin').command({ping: 1})
    console.log("Connected database");
    
  } catch (error) {
    console.log("Error in connecting db", error);
  }
  return (
    <div>page</div>
  )
}

export default Page