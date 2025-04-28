


// //using try catch block to handle errors in async functions
// const asyncHandler = (fn)  => async (req, res, next) => {
//      try {
//          await fn(req, res, next);
//      } catch (error) {
//         res.staatus(error.status || 500).json({
//             success: false,
//             message: error.message,
//         })
//      }
// };

// This is a utility function to handle async errors in Express.js using Promises
const asyncHandler = (requestHabdler) =>{
    return (req, res, next)=>{
        Promise.resolve(requestHabdler(req, res, next)).
        catch((error) =>{ next(error) });
    }
}



export { asyncHandler };