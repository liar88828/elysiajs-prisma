import type { ApiPath, HandlerType } from "../../src/interface/api.type"

export default class API {
  constructor(private to: ApiPath) {}

  GET(id: string | number = "", token: string) {
    if (id === "") {
      return new Handler().handler({
        to: this.to,
        method: "GET",
        token,
      })
    } else {
      return new Handler().handler({
        id: id,
        to: this.to,
        method: "GET",
        token,
      })
    }
  }

  POST(data: Object, token: string = "", to = "", id: number | string = "") {
    if (to === "") {
      return new Handler().handler({
        data,
        to: this.to + id,
        method: "POST",
        token,
      })
    }
    return new Handler().handler({
      data,
      to: this.to + to,
      method: "POST",
      token,
    })
  }

  PUT(id: number | string, data: Object, token: string) {
    return new Handler().handler({
      data,
      id,
      to: this.to,
      method: "PUT",
      token,
    })
  }

  DELETE(id: number | string, token: string) {
    return new Handler().handler({
      id,
      to: this.to,
      method: "DELETE",
      token,
    })
  }
}

class Handler {
  handler({ method = "GET", to, id = "", data, token }: HandlerType) {
    let option: RequestInit = {}

    if (["POST", "PUT"].includes(method)) {
      option = {
        body: JSON.stringify(data),
      }
    }

    // console.log(option)
    return new Request(`http://localhost:3000/api/${to}/${id}`, {
      ...option,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
  }
}
