import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
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
          <CompanionsList/>
          <CTA/>
        </section>
      </main>
  )
}

export default Page