const cookieOptions = {
  httpOnly: true,
  secure: false, //  process.env.NODE_ENV === "production",
  sameSite: "l     ax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

export default cookieOptions;
