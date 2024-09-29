
export const isLikedBy=(reqUserId,Post)=>{
for (const country of Object.keys(Post.likes)) {
    const capital = Post.likes[country];
    if(capital.id){
        if(reqUserId===capital.id){
            return true
        }
    }
  }
    
    return false;
}