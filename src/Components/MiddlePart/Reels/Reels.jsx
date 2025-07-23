import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reels } from "../../../Redux/Post/post.action";
import PostCard from "../../Post/PostCard";
const Reels=()=>{
    const dispatch=useDispatch();
    
    const {post}=useSelector(store=>store)
    useEffect(() => {
        dispatch(reels());
    }, [dispatch]);
    return(
        <div className="items-center w-full bg-black bg">
            {post.reels?.map((item)=><PostCard item={item}/>)}
        </div>
    )
}
export default Reels