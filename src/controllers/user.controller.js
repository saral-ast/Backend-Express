import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    if(
        [fullName, username, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "Please fill all the fields");
    }

   const existedUser = await User.findOne({
        $or: [{ username },{ email }],
    })
    if(existedUser){
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Please upload an avatar image");
    }

    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = coverImageLocalPath ? await uploadToCloudinary(coverImageLocalPath) : null;

    if(!avatar){
        throw new ApiError(500, "Failed to upload avatar image");
    }

     const user =  await User.create({
        username : username.toLoowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",

    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating user");
    }
    return res.status(201).json(
        new ApiResponse(201, "User created successfully", createdUser)
    )

     
})

export { registerUser };