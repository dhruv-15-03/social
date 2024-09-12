import React from 'react'
import { useSelector } from 'react-redux';

const ChatMessage = ({messages}) => {
  const{message,auth}=useSelector(store=>store);
  const isReqUserMessage=auth.user?.id===messages.user?.id
  return (
    <div className={`flex ${!isReqUserMessage?"justify-start":"justify-end"} text-white`}>
        <div className={`p-1 ${messages.image?"rounded-md":"px-5 rounded-full"} bg-[#191c29]`}>
            {messages.image&&<img className='w-[12rem] h-[17rem] object-cover rounded-md' src={messages.image} alt='Container'/>}
            <p className={`${true?"py-2":"py-1"}`}>
                {messages.message}
            </p>
        </div>
    </div>
  )
}

export default ChatMessage