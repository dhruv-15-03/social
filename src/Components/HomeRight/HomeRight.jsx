import React, { useEffect } from "react";
import PopularUser from "./PopularUser";
import { Card } from "@mui/material";
import SearchUser2 from "../SearchUser2/SearchUser2";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../Redux/Profile/profileaction";
const popular=[1,1,1,1,1]
const HomeRight=()=>{
    const dispatch=useDispatch();
    const [showAll, setShowAll] = React.useState(false);
    const {profile}=useSelector(store=>store)
    useEffect(()=>{
        dispatch(getUsers())
    },[profile.users?.length]);
    const handleViewAll=()=>{
        setShowAll(!showAll)
    }
    const usersToShow = showAll ? profile.users : profile.users?.slice(0, 5);
    return(
        <div className="pr-5">
            <SearchUser2/>
            <Card className='p-5'>
            <div className="flex items-center justify-between py-5">
                <p className="font-semibold opacity-70">Suggestions For You</p>
                <p className="text-xs font-semibold cursor-pointer opacity-95" onClick={handleViewAll}> {showAll ? 'Showing All' : 'View All'}</p>

            </div>
            <div className="">
                {usersToShow?.map((item)=><PopularUser key={item.id} item={item}/>)}
                
            </div>
            </Card>
            
            
        </div>
    )
}
export default HomeRight