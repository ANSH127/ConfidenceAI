import React from 'react'
import loading from '../assets/images/loadar.gif'

export default function Loadar() {
  return (
    <div>
      <img src={loading} alt='loading' className='w-12 h-12 mx-auto' />
    </div>

  )
}
