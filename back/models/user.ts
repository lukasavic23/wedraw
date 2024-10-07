import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  isPasswordCorrect: (
    candidatePass: string,
    userPass: string
  ) => Promise<boolean>;
  refreshToken: string | undefined;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: [true, "Name field is required!"] },
  lastName: String,
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide correct email format!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password!"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match!",
    },
  },
  refreshToken: {
    type: String,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.isPasswordCorrect = async function (
  candidatePass: string,
  userPass: string
) {
  return await bcrypt.compare(candidatePass, userPass);
};

const User = mongoose.model("User", userSchema);
export default User;
