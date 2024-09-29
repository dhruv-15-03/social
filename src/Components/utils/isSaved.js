export const isSavedBy=(reqUserId,Post)=>{
    for (const country of Object.keys(Post.saved)) {
        const capital = Post.saved[country];
        if(capital.id){
            if(reqUserId===capital.id){
                return true
            }
        }
      }
        
        return false;
    }