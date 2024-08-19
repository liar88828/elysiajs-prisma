import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { app } from "../src";
import { prisma } from "../src/config/db";
import API from "./utils/myApi";
import { TYCheckout } from "../src/interface/transaction.type";
import { Status } from "../src/interface/Status";

describe('can test transaction controller', async () => {
	it("can connect api transaction", async () => {
		const response = await app
			.handle(new Request('http://localhost:3000/hello'))
			.then((res) => res.text())
		// console.log(response)
		expect(response).toBeString()
		expect(response).not.toBeObject()
		expect(response).toBe('Hello Elysia')
		expect(response).not.toBe('hi Elysia')
	})
	
	beforeAll(async () => {
		await prisma.$transaction(async (tx) => {
			const user = await tx.userDB.create({
				data: {
					id: 31,
					name: "User 1",
					address: "Indonesia",
					age: 20,
				}
			})
			
			const product = await tx.productDB.create({
				data: {
					id: 32,
					name: "Mouse",
					price: 30_000,
					qty: 100,
					userId: user.id,
				}
			})
			
			const status = await tx.statusDB.createMany({
				data: [
					{ id: Status.CONFIRM },
					{ id: Status.FAILED },
					{ id: Status.PENDING },
					{ id: Status.SUCCESS },
				]
			})
			const transaction = await tx.transactionDB.create({
				data: {
					id: 99,
					qty: 10,
					statusId: Status.PENDING,
					userId: user.id,
					total: 200,
					productId: product.id
				}
			})
			console.log('before finish')
		})
	})
	
	afterAll(async () => {
		await prisma.productDB.deleteMany()
		await prisma.userDB.deleteMany()
		await prisma.transactionDB.deleteMany()
		await prisma.statusDB.deleteMany()
		
	})
	
	describe('can Create POST Transaction', async () => {
		it("POST can create Transaction ", async () => {
			
			const data = {
				qty: "error",
				id: "Error",
				userId: "error",
				productId: "error",
				total: "error",
				status: "error",
			}
			
			const response = await app
				.handle(new API('transaction/checkout').POST(data))
				.then((res) => res.json())
			console.log(response)
			expect(response).toBeObject()
			expect(response).not.toContainKey("productId")
			expect(response).not.toContainKey("userId")
			expect(response).not.toContainKey("qty")
			expect(response).not.toContainKey("id")
			expect(response).not.toEqual(
				{
					qty: 10,
					id: 33,
					userId: 31,
					productId: 32,
					total: 200_000,
					statusId: Status.CONFIRM,
					create: expect.any(String),
				}
			)
		})
		
		it("Error POST can't wrong  data create Transaction ", async () => {
			const data: Partial<TYCheckout> = {
				qty: 10,
				id: 33,
				userId: 31,
				productId: 32,
				total: 200_000,
				status: Status.CONFIRM,
			}
			
			const response = await app
				.handle(new API('transaction/checkout').POST(data))
				.then((res) => res.json())
			console.log(response)
			expect(response).toBeObject()
			expect(response).toContainKey("productId")
			expect(response).toContainKey("userId")
			expect(response).toContainKey("qty")
			expect(response).toContainKey("id")
			expect(response).toEqual(
				{
					qty: 10,
					id: 33,
					userId: 31,
					productId: 32,
					total: 200_000,
					statusId: Status.CONFIRM,
					create: expect.any(String),
				}
			)
		})
		
	})
	
	describe("can get all data transaction", async () => {
		it("Get All From transaction", async () => {
			const response = await app
				.handle(new API('transaction').GET())
				.then(res => res.json())
			expect(response).toBeArray()
			expect(response[0]).toContainKey("qty")
			expect(response[0]).toContainKey("id")
			expect(response[0]).toContainKey("userId")
			expect(response[0]).toContainKey("productId")
			expect(response[0]).toContainKey("total")
		})
		
		it("GET id From transaction", async () => {
			const response = await app
				.handle(new API('transaction/33').GET())
				.then(res => res.json())
			expect(response).toBeObject()
			expect(response).toContainKey("qty")
			expect(response).toContainKey("id")
			expect(response).toContainKey("userId")
			expect(response).toContainKey("productId")
			expect(response).toContainKey("total")
			expect(response).toEqual(
				{
					qty: 10,
					id: 33,
					userId: 31,
					productId: 32,
					total: 200_000,
					statusId: Status.CONFIRM,
					create: expect.any(String),
				}
			)
		})
		
		it("Error wrong id GET id From transaction", async () => {
			const response = await app
				.handle(new API('transaction/error').GET())
				.then(res => res.json())
			expect(response).toBeObject()
			expect(response).not.toBeArray()
			expect(response).not.toEqual(
				{
					qty: 10,
					id: 33,
					userId: 31,
					productId: 32,
					total: 200_000,
					statusId: Status.CONFIRM,
					create: expect.any(String),
				}
			)
			
		})
		
	})
	
	// not have create controller
	describe.skip("can UPDATE Transaction", async () => {
		it("PUT can create Transaction ", async () => {
			
			const data = {
				qty: "error",
				id: "Error",
				userId: "error",
				productId: "error",
				total: "error",
				status: "error",
			}
			
			const response = await app
				.handle(new API('transaction/checkout').POST(data))
				.then((res) => res.json())
			console.log(response)
			expect(response).toBeObject()
			expect(response).not.toContainKey("productId")
			expect(response).not.toContainKey("userId")
			expect(response).not.toContainKey("qty")
			expect(response).not.toContainKey("id")
			expect(response).not.toEqual(
				{
					qty: 10,
					id: 33,
					userId: 31,
					productId: 32,
					total: 200_000,
					statusId: Status.CONFIRM,
					create: expect.any(String),
				}
			)
		})
		
		it("Error PUT can't wrong  data create Transaction ", async () => {
			const data: Partial<TYCheckout> = {
				qty: 10,
				id: 33,
				userId: 31,
				productId: 32,
				total: 200_000,
				status: Status.CONFIRM,
			}
			
			const response = await app
				.handle(new API('transaction/checkout').POST(data))
				.then((res) => res.json())
			console.log(response)
			expect(response).toBeObject()
			expect(response).toContainKey("productId")
			expect(response).toContainKey("userId")
			expect(response).toContainKey("qty")
			expect(response).toContainKey("id")
			expect(response).toEqual(
				{
					qty: 10,
					id: 33,
					userId: 31,
					productId: 32,
					total: 200_000,
					statusId: Status.CONFIRM,
					create: expect.any(String),
				}
			)
		})
		
	})
	
})