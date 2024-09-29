export const isFollowBy=(users,userId)=>{
    for (let index = 0; index < users.length; index++) {
        if(users[index].id==userId){
            return true;
        }    
    }
    return false;
}