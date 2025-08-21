
import bcrypt from 'bcryptjs'
import pkg from 'jsonwebtoken';
const { JsonWebTokenError } = pkg;
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';


export const register=async(req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.json({success:false,message:'Missing Details'});
    }

    try{
        // Check if user already exists
        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.json({success:false,message:'User already exists'});
        }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = new userModel({
                name,
                email,
                password: hashedPassword
            });
            await user.save();

            const token = pkg.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            const mailOptions={
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Welcome to Pegasus Vault',
                text: `Hello ${name},\n\nThank you for registering with Pegasus Vault. Your account has been created with ${email}\n\nBest regards,\nPegasus Vault Team`
            }
            await transporter.sendMail(mailOptions);

            return res.json({success:true,message:'User registered successfully'});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
};

export const login=async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.json({success:false,message:'Missing Details'});
    }

    try{
        // Check if user exists
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:'User not found'});
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.json({success:false,message:'Invalid password'});
        }

        // Generate JWT token
        const token = pkg.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
        });

        res.json({ success: true, message: 'Login successful' });
    }catch(error){
        res.json({success:false,message:error.message});
    }
};


export const logout=async(req,res)=>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        res.json({success:true,message:'Logout successful'});
    }catch(error){
        res.json({success:false,message:error.message});
    }
};


export const sendverifyOtp=async(req,res)=>{
    const userId=req.userId;

    const user = await userModel.findById(userId);

    if(user.isAcoountVerified){
        return res.json({success:false,message:'Account already verified'});

}

    try{
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expireAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = expireAt;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify your account',
            text: `Your verification OTP is ${otp}. It is valid for 5 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.json({success:true,message:'OTP sent successfully'});
    }catch(error){
        res.json({success:false,message:error.message});
    }
};

export const verifyOtp=async(req,res)=>{
    const userId = req.userId;
    const {otp} = req.body;

    const user = await userModel.findById(userId);

    if(!user){
        return res.json({success:false,message:'User not found'});
    }

    if(user.isAcoountVerified){
        return res.json({success:false,message:'Account already verified'});
    }

    if(user.verifyOtp !== otp || Date.now() > user.verifyOtpExpireAt){
        return res.json({success:false,message:'Invalid or expired OTP'});
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    res.json({success:true,message:'Account verified successfully'});
}

export const isAuthenticated=async(req,res)=>{
    const userId = req.userId;

    if(!userId){
        return res.json({success:false,message:'Unauthorized'});
    }

    const user = await userModel.findById(userId);

    if(!user){
        return res.json({success:false,message:'User not found'});
    }

    res.json({success:true,user:{name:user.name,email:user.email,isAccountVerified:user.isAccountVerified}});
}

//password reset

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expireAt = Date.now() + 5 * 60 * 1000; // 5 minutes 
        user.resetOtp = otp;
        user.resetOtpExpireAt = expireAt;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Reset your password',
            text: `Your password reset OTP is ${otp}. It is valid for 5 minutes.`
        };  
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }    
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Missing details' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp !== otp || Date.now() > user.resetOtpExpireAt) {
            return res.json({ success: false, message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};