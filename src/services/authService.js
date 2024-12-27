import User from '~/models/userModel'

export const registerUser = async (userData) => {
  const user = new User(userData)
  return await user.save()
}

export const findUserByEmail = async (email) => {
  return await User.findOne({ email })
}
