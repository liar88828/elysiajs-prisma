export default class API {
	constructor(private to: string) {
	}
	
	GET(id: string | number = '') {
		return handler({
			id: id,
			to: this.to,
			method: 'GET',
		})
	}
	
	POST(data: Object) {
		return handler({ data, to: this.to, method: 'POST' })
	}
	
	PUT(id: number, data: Object) {
		return handler({ data, id, to: this.to, method: 'PUT' })
	}
	
	DELETE(id: number) {
		return handler({ id, to: this.to, method: 'DELETE' })
	}
}

type MethodHandler = "GET" | "POST" | "PUT" | "DELETE"

type HandlerType = {
	method?: MethodHandler
	id?: Number | String
	to: String
	data?: Object
}

const handler = ({
									 method = "GET",
									 to,
									 id = "",
									 data
								 }: HandlerType) => {
	
	let option: RequestInit = {}
	
	if (['POST', 'PUT',].includes(method)) {
		option = {
			body: JSON.stringify(data),
		}
	}
	
	// console.log(option)
	return new Request(`http://localhost:3000/api/${ to }/${ id }`,
		{
			...option,
			method: method,
			headers: { 'Content-Type': 'application/json', }
			
		}
	)
}

