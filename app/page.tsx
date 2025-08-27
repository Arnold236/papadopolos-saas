import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import { recentSessions } from '@/constants'
import { getAllCompanions, getRecentSessions } from '@/lib/actions/companion.actions'
import { getSubjectColor } from '@/lib/utils'
import React from 'react'

const Page = async () => {
  const companions = await getAllCompanions({limit: 3});
  const recentSessionsCompanions = await getRecentSessions(10);
  return (
      <main className="">
        <h1 className='text-2xl underline'>Popular Companions</h1>
        {companions.map((companion) => (
          <CompanionCard key={companion.id} {...companion} color={getSubjectColor(companion.subject)} />
        ))}
        {/* <section className='home-section'>
        <CompanionCard id={"123"} name ={"Maths is fun"} topic = {"Learn"} subject={"Maths"} duration={40} color= {"lightblue"}/>
        <CompanionCard id={"123"} name ={"Maths is fun"} topic = {"Learn"} subject={"Maths"} duration={40} color= {"pink"}/>
        <CompanionCard id={"123"} name ={"Maths is fun"} topic = {"Learn"} subject={"Maths"} duration={40} color= {"yellow"}/>
     
        </section> */}

        {/* <section className='home-section'>
          <CompanionsList 
            title="Recently Completed Sessions"
            companions={recentSessions}
            classNames="w-2/3 max-lg:w-full"
            />
          <CTA/>
          
        </section> */}
        <section className='home-section'>
          <CompanionsList 
            title="Recently Completed Sessions"
            companions={recentSessionsCompanions}
            classNames="w-2/3 max-lg:w-full"
            />
          <CTA/>
        </section>
      </main>
  )
}

export default Page