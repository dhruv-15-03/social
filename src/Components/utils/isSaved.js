export const isSavedBy=(reqUserId,Post)=>{
    console.log(Post);
    for (const country of Object.keys(Post.saved)) {
        const capital = Post.saved[country];
        console.log(Object.keys(capital)+"...");
        if(capital.id){
            if(reqUserId===capital.id){
                return true
            }
        }
      }
        
        return false;
    }