
export const isLikedBy=(reqUserId,Post)=>{
console.log(Object.values(Post.likes)+"..................");
for (const country of Object.keys(Post.likes)) {
    const capital = Post.likes[country];
    console.log(Object.keys(capital)+"...");
    if(capital.id){
        if(reqUserId===capital.id){
            return true
        }
    }
  }
    
    return false;
}