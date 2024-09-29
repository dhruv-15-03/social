import { Avatar, Card, CardHeader } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { searchUser } from '../../Redux/Auth/auth.actiion';
import { createChat } from '../../Redux/Messages/Message.action';

const SearchUser2 = () => {
    const [userName,setUserName]=React.useState("");
    const dispatch=useDispatch();
    const {auth}=useSelector(store=>store)
    const handleSearchUser=(e)=>{
        setUserName(e.target.value)
        dispatch(searchUser(userName))
    }
    const handleClick=(id)=>{
        dispatch(createChat(id))
    }
  return (
    <div>
        <div className='relative py-5'>
            <input className='bg-transparent border border-[#3b4054] outline-none w-full px-5 py-3 rounded-full' placeholder='Search User...' onChange={handleSearchUser} type='text'/>
            {
        userName&&(
            auth.searchUser.map((item)=><Card key={item.id} className='absolute w-full z-10 top-[4.5rem] cursor-pointer'>
            <CardHeader onClick={()=>{
                handleClick(item.id)
                setUserName("")
            }}
            avatar={<Avatar src={item.profile}/>}
            title={item.name}
            subheader={item.userName}
            />
        </Card>)
        )
        }
        </div>
        
    </div>
    
  )
}

export default SearchUser2