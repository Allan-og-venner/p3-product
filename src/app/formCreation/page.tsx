'use client'

import Link from 'next/link'
import Token from './formCreation'
import DatabaseAccess from './DatabaseAccess';

export default function Home() {
  return (
    <main>
      <h1>Welcome to Project survey tool</h1>
      <div className='flex flex-wrap content-evenly'>
        <Link className="border-white border-2 p-2" href={"/login"}>Login</Link><br />  
        <Link className="border-white border-2 p-2" href={"/register"}>Register</Link><br />
        <button onClick={() => {console.log(Token.createTokenArray(5,10))}}>Tokens</button>;
        <button onClick={() => {console.log(DatabaseAccess.findJSONFile(["database"], "forms"))}}>Database</button>;
      </div>
    </main>
  )
}
