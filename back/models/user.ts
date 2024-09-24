import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
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
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

const User = mongoose.model("User", userSchema);
export default User;
