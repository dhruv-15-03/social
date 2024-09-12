import { Avatar, Backdrop, Box, Button, CircularProgress, IconButton, Modal } from '@mui/material'
import { useFormik } from 'formik';
import React from 'react'
import ImageIcon from "@mui/icons-material/Image"
import VideoCallIcon from "@mui/icons-material/VideoCall"
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { useDispatch, useSelector } from 'react-redux';
import {  createPostAction } from '../../Redux/Post/post.action';

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

const CreatePostModal = ({handleClose,open}) => {
    
    const {auth}=useSelector(store=>store)

    const[selectedImage,setSelectedImage]=React.useState();
    const[selectedVideo,setSelectedVideo]=React.useState();
    const[isLoading,setIsLoading]=React.useState(false);
    const dispatch=useDispatch();
    const handleSelectImage=async(event)=>{
        setIsLoading(true);
        const imageUrl=await uploadToCloudinary(event.target.files[0],"image")
        setSelectedImage(imageUrl);
        setIsLoading(false)
        formik.setFieldValue("image",imageUrl)
    }
    const handleSelectVideo=async(event)=>{
        setIsLoading(true);
        const videoUrl=await uploadToCloudinary(event.target.files[0],"video")
        setSelectedVideo(videoUrl);
        setIsLoading(false)
        formik.setFieldValue("video",videoUrl)
    }
    const formik=useFormik(
        {
            initialValues:{
                caption:"",
                image:"",
                video:"",

            },
            onSubmit:(values)=>{
                dispatch(createPostAction(values))
            }
        }
    )
    
  return (
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
                        <input type='file' accept='image/*'
                        onChange={handleSelectImage}
                        style={{display:"none"}}
                        id='image-input'
                        />
                        <label htmlFor="image-input">
                            <IconButton color='primary' component="span" >
                                <ImageIcon/>
                            </IconButton>
                        </label>
                        <span>Image</span>
                    </div>
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
                {selectedImage&& <div>
                    <img className='h-[10rem]' src={selectedImage} alt="" />
                </div>}
                {selectedVideo && (<div>
  <video controls src={selectedVideo} className='w-full h-full'></video></div>
)}
                <div className='flex justify-end w-full'>
                    <Button variant='contained' type='submit' sx={{borderRadius:"1.5rem"}} >Post</Button>
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

export default CreatePostModal