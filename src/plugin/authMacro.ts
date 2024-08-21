import Elysia from "elysia";


export const authMacro = new Elysia({ name: "plugin.admin" }).macro(
  ({ onBeforeHandle }) => ({
    isRole(role: "ADMIN" | "USER") {
      onBeforeHandle(({ error, cookie }) => {
        if (role === "ADMIN") {
          console.log("is admin");
        } else if (role === "USER") {
          console.log("is not admin");
        }
        // throw error("Unauthorized", " is Admin Only");
      });
    },
  })
);
