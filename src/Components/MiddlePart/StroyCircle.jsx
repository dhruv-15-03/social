import React from 'react'
import { Avatar } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import img from "../../img/pngtree-background-frame-geometric-with-neon-glow-and-bright-colors-can-be-image_339492.jpg"

const StroyCircle = () => {
  return (
    <div>
        <div className="flex flex-col mr-4 cursor-pointer items-centre">
                    <Avatar sx={{width:"5rem",height:"5rem"}}
                    src={img}
                    >
                        <AddIcon sx={{fontsize:"3rem"}}/>
                    </Avatar>
                    <p className="pl-2">New......</p>

                </div>
    </div>
  )
}

export default StroyCircle