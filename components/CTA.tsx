import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CTA = () => {
  return (
    <section className='cta-section'>
      <div className="cta-badge">Start Learning your way</div>
      <h2 className='text-3xl font-bold'>Build and personalize Learning Companion</h2>
      <p>Pick a name, subject, voice & personality - and start learning through voice conversations that feel natural and fun.</p>
      <Image src="/images/cta.svg" alt='cta' height={232} width={362}/>
      <button className='btn-primary'>
         <Image src="/icons/plus.svg" alt='plus' height={12} width={12}/>
         <Link href={`/companions/new`}>
           <p>Build a new companion</p>
         </Link>
      </button>
    </section>
  )
}

export default CTA