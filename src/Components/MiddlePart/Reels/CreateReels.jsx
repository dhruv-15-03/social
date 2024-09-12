import { Avatar, Backdrop, Box, Button, CircularProgress, IconButton, Modal } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoCallIcon from "@mui/icons-material/VideoCall"
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { useFormik } from "formik";
import { createPostAction } from "../../../Redux/Post/post.action";
import { useNavigate } from "react-router-dom";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius:"0.6rem",
    outline:"none"
  };

const CreateReels=({open})=>{
    const {auth}=useSelector(store=>store)
    const[selectedVideo,setSelectedVideo]=React.useState();
    const[isLoading,setIsLoading]=React.useState(false);
    const dispatch=useDispatch();
    const handleSelectVideo=async(event)=>{
        setIsLoading(true);
        const videoUrl=await uploadToCloudinary(event.target.files[0],"video")
        setSelectedVideo(videoUrl);
        setIsLoading(false)
        formik.setFieldValue("video",videoUrl)
    }
    const navigate=useNavigate();
    const formik=useFormik(
        {
            initialValues:{
                caption:"",
                video:"",

            },
            onSubmit:(values)=>{
                dispatch(createPostAction(values))
            }
        }
    )
    const handleClose=()=>{
        navigate(-1)
    }
    return(
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <div>
                <div className='flex items-center space-x-4'>
                    <Avatar>
                    {auth.user?.name[0]}
                        </Avatar>
                    <div>
                        <p className='text-lg font-bold'>{auth.user?.name}</p>
                        <p className='text-sm'>{'@'+auth.user?.userName}</p>
                    </div>

                </div>
                <textarea className='outline-none w-full mt-5 p-2 bg-transparent border border-[#3b4054] rounded-sm' name="caption" placeholder='write caption' rows="4" value={formik.values.caption} onChange={formik.handleChange}>

                </textarea>
                <div className='flex items-center mt-5 space-x-5'>
                    <div>
                        <input type='file' accept='video/*'
                        onChange={handleSelectVideo}
                        style={{display:"none"}}
                        id='video-input'
                        />
                        <label htmlFor="video-input">
                            <IconButton color='primary' component="span">
                                <VideoCallIcon/>
                            </IconButton>
                        </label>
                        <span>Video</span>
                    </div>

                </div>
                {selectedVideo && (<div>
  <video controls src={selectedVideo} className='w-full h-full'></video></div>
)}
                <div className='flex justify-end w-full'>
                    <Button variant='contained' type='submit' onClick={handleClose} sx={{borderRadius:"1.5rem"}} >Post</Button>
                </div>
            </div>

          </form>
          <Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={isLoading}
  onClick={handleClose}
>
  <CircularProgress color="inherit" />
</Backdrop>
        </Box>
      </Modal>
    )
}
export default CreateReels