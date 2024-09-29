import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { updateProfileAction, updateProfPic } from '../../Redux/Auth/auth.actiion';
import { Avatar, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { uploadToCloudinary } from '../../Components/utils/uploadToCloudinary';
import { useEffect } from 'react';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  outline:"none",
  overFlow:"scroll-y",
  borderRadius:3,
};

export default function ProfileModal({open,handleClose}) {
   const[selectedImage,setSelectedImage]=React.useState();
   const[isLoading,setIsLoading]=React.useState(false);
   const handleSelectImage=async(event)=>{
    setIsLoading(true);
    const imageUrl=await uploadToCloudinary(event.target.files[0],"image")
    setSelectedImage(imageUrl);
    setIsLoading(false)
    formik.setFieldValue("profile",imageUrl)
}
    const dispatch=useDispatch();
    const {auth}=useSelector(store=>store)
    const handleSubmit=(values)=>{
        console.log("values",values)
        
    }
    useEffect(()=>{
      const user={
        profile:selectedImage
      }
      dispatch(updateProfPic(user))
    },[selectedImage])
    const formik=useFormik({
        initialValues:{
            profile:null,
            name:null,
            userName:null,
            bio:null
        },
        onSubmit:(values,)=>{
            dispatch(updateProfileAction(values))
            handleClose()
        }
    })

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <div className='flex justify-between items-centre'>
                <div className='flex items-center space-x-3'>
                    <IconButton onClick={handleClose}>
                        <CloseIcon/>
                    </IconButton>
                    <p>Edit Profile</p>
                </div>
                <Button  onSubmit={handleSubmit} type='submit'>Save</Button>
            </div>
            <div>
            <div className='relative h-[15rem]'>
                <img className='w-full h-full rounded-t-md' src={auth.user?.profile} alt='No-profile' />
                <div className='absolute inset-0 flex items-center justify-center '
                >
                        <input type='file' accept='image/*'
                        onChange={handleSelectImage}
                        style={{display:"none"}}
                        id='image-input'
                        />
                        <label htmlFor="image-input">
                          <span className='p-2 text-white underline bg-black cursor-pointer bg '>Edit</span>
                        </label>
                        
                </div>
            </div>

                <div className='pl-5'>
                    <Avatar
                    className='transform -translate-y-24'
                    sx={{width:"10rem",height:"10rem",backgroundColor:'#2e79ba',fontSize:'55px'}}
                    >
                      {auth.user?.name[0]}
                      </Avatar>

                </div>
            </div>
            <div className='space-y-3'>
                <TextField
                fullWidth
                id="name"
                name='name'
                label="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                />
                <TextField
                fullWidth
                id="userName"
                name='userName'
                label="userName"
                value={formik.values.userName}
                onChange={formik.handleChange}
                />
                <TextField
                fullWidth
                id="bio"
                name='bio'
                label="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}