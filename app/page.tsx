import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
      <main className="">
        <h1 className='text-2xl underline'>Popular Companions</h1>
        <section className='home-section'>
        <CompanionCard id={"123"} name ={"Maths is fun"} topic = {"Learn"} subject={"Maths"} duration={40} color= {"lightblue"}/>
        <CompanionCard id={"123"} name ={"Maths is fun"} topic = {"Learn"} subject={"Maths"} duration={40} color= {"pink"}/>
        <CompanionCard id={"123"} name ={"Maths is fun"} topic = {"Learn"} subject={"Maths"} duration={40} color= {"yellow"}/>
     
        </section>

        <section className='home-section'>
          <CompanionsList 
            title="Recently Completed Sessions"
            companions={recentSessions}
            classNames="w-2/3 max-lg:w-full"
            />
          <CTA/>
        </section>
      </main>
  )
}

export default Page