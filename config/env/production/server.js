const env = process.env.TERMITE_ENV;
const port = env === "preview" ? 9911 : 9998;
module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", port),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "5e6bdea11dd0ac7954fe4fcb800b9bde"),
    },
  },
});
