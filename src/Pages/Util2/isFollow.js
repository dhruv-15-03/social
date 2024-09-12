export const isFollowBy=(users,userId)=>{
    console.log(users)
    for (let index = 0; index < users.length; index++) {
        if(users[index].id==userId){
            return true;
        }    
    }
    return false;
}