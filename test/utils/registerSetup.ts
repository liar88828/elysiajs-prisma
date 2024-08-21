import { app } from "../../src"

export function registerSetup() {
  return app
    .handle(
      new Request("http://localhost:3000/api/auth/register/", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email: "emailku@gmail.com",
          name: "User 2",
          age: 200,
          address: "indonesia",
          password: "12345678",
          confPass: "12345678",
        }),
      })
    )
    .then((res) => res.json())
}
