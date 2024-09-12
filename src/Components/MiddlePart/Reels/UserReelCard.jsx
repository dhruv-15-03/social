import React from 'react'
import vid from '../../../Videos/vid.mp4'
const UserReelCard = () => {
  return (
    <div className='w-[15rem] px-2'>
        <video controls src={vid} className='w-full h-full'></video>
    </div>
  )
}

export default UserReelCard