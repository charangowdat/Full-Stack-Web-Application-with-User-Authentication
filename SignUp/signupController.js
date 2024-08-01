const jwt = require('jsonwebtoken');

const catchAsync = require('./catchAsync');
const AppError = require('./appError');
const signup = require('./signupModels');

const signTokens = id=>{
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

//To get all users only for Reference 
exports.getAllUsers= catchAsync(async (req,res,next)=>{
  const users= await signup.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
})

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email+" "+password);
  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists & password is correct
  const user = await signup.findOne({ email }).select('+password'); // +password because in schema select: false

  if(!user || !( await user.correctPassword(password,user.password))){
    return next(new AppError('Incorrect email or Password ',400));
  }

  // Delete the user
  await signup.deleteOne({ email });

  // Send the response
  res.status(204).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});



exports.createUser = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('Is there everything okay!!');

    const newUser = await signup.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signTokens(newUser._id)

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err.message,
    });
  }

};

exports.login = catchAsync(async (req,res,next)=>{
  const {email,password} = req.body;
  
if(!email || !password){
  return next(new AppError('Please provide email and password',400));
}

//Check if user exist& password is correct
const user = await signup.findOne({email}).select('+password');//+password because in schema select:false


if(!user || !( await user.correctPassword(password,user.password))){
  return next(new AppError('Incorrect email or Password ',400));
}

const token = signTokens(user._id)

res.status(201).json({
      status: 'success',
      token,
      
    });
})