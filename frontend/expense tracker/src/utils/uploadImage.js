import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage=async(imageFile)=>{
    //Create FormData object because we are uploading files during image upload
    const formData=new FormData();

    //Append image file to formdata
    formData.append("image",imageFile)
    try {
        const response=await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
}

export default uploadImage;