import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async(userId) =>{
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
     throw new ApiError(500, "Something went wrong while generating tokens");
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  // Validate fields
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Please fill all the fields");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  // Fetch uploaded files
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
 

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload an avatar image");
  }

  // Upload to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

 

  if (!avatar || !avatar.url) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  // Create User
  const user = await User.create({
    username: username.toLowerCase(), // corrected typo here
    email,
    fullName,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

   
    if (!(username || email)) {
        throw new ApiError(400, "Please provide username or email");
    }

    if( !(username || email) ) {
        throw new ApiError(400, "Please provide username or email");
    }

  const user = await User.findOne({
      $or: [
        { username: username?.toLowerCase() },
        { email: email?.toLowerCase() }
      ]
    })

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPassordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const options = {
     httpOnly: true,
     secure: true,
 
   };
   
   return res
   .status(200)
   .cookie("refreshToken", refreshToken, options)
   .cookie("accessToken", accessToken, options)
   .json(new ApiResponse(200,
    {
      user: loggedInUser,
      accessToken,
      refreshToken
    },
    "User logged in successfully",
   ))

});

const logoutUser = asyncHandler(async (req, res) => {
     const userId = req.user._id;
     await User.findByIdAndUpdate(
      userId,
      {
         $set : { refreshToken: undefined }
      },
      {
        new:true
      }
    );

     const options = {
       httpOnly: true,
       secure: true,
      };

      return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));

});



export { 
  registerUser,
  loginUser,
  logoutUser

 };
