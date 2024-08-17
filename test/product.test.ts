// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { app } from '../src'
import { Product } from '@prisma/client'
import API from './utils/myApi'
import { prisma } from '../src/config/db'

describe.skip('can test product controller', async () => {
    it("can return a response", async () => {
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
        console.log("running test.")
    })
    afterAll(async () => {
        console.log("done with test.")
        await prisma.product.deleteMany()
    })

    describe('can test product POST controller', async () => {
        it("can create Product ", async () => {
            const data: Partial<Product> = {
                exp: new Date(),
                name: "test product",
                price: 10,
                qty: 10,
                id: 10
            }

            const response = await app
                // .handle(new Request('http://localhost:3000/api/product', {
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data),
                //     method: 'POST'
                // }))
                .handle(new API('product')
                    .POST(data))
                .then((res) => res.json())
            // console.log(response)
            expect(response).toBeObject()
            expect(response).toContainKey("price")
            expect(response).toContainKey("name")
            expect(response).toBe
            expect(response).toEqual(
                {
                    exp: expect.any(String),
                    name: "test product",
                    price: 10,
                    qty: 10,
                    id: 10
                }
            )
        })
    })

    describe('can test product GET controller', async () => {
        // const app = new Elysia().get('/hello', () => 'hi')


        it.skip("can get All Product", async () => {
            const response = await app
                .handle(new API('product').GET())
                .then((res) => res.text())
            // console.log(response)
            expect(response).toBeArray()
        })

        it("can get by id Product", async () => {
            const response = await app
                // .handle(new Request('http://localhost:3000/api/product/1', { }))
                .handle(new API('product').GET(10))
                .then((res) => res.json())
            // console.log(response)
            expect(response).toBeObject()
            expect(response).toEqual(
                {
                    exp: expect.any(String),
                    name: "test product",
                    price: 10,
                    qty: 10,
                    id: 10
                }
            )
        })


        it("can get id Product", async () => {
            const response = await app
                // .handle(new Request('http://localhost:3000/api/product/1', { }))
                .handle(new API('product').GET(123))
                .then((res) => res.json())
            // console.log(response)
            expect(response).toBeObject()
            expect(response).toContainKey("name")
            expect(response).toContainKey("message")
            expect(response).not.toEqual(
                {
                    exp: expect.any(String),
                    name: "test product",
                    price: 10,
                    qty: 10,
                    id: 10
                }
            )
        })



        it("can get id Product", async () => {
            const response = await app
                // .handle(new Request('http://localhost:3000/api/product/1', { }))
                .handle(new API('product').GET("error"))
                .then((res) => res.json())
            // console.log(response)
            expect(response).toBeObject()
            expect(response).toContainKey("type")
            expect(response).not.toEqual(
                {
                    exp: expect.any(String),
                    name: "test product",
                    price: 10,
                    qty: 10,
                    id: 10
                }
            )
        })



    })


    describe('can test product PUT controller', async () => {
        it('can update Product', async () => {
            const data: Partial<Product> = {
                exp: new Date(),
                name: "test update",
                price: 10,
                qty: 10,
                id: 10
            }
            const response = await app
                .handle(new API('product')
                    //@ts-ignore
                    .PUT(data.id, data)).then(
                        res => res.json()
                    )
            console.log(response)
            expect(response).toBeObject()
            expect(response).toEqual({
                id: 10,
                name: "test update",
                price: 10,
                qty: 10,
                exp: expect.any(String)// the actually is date
            })



        })
    })
    describe('can test product DELETE controller', async () => {
        it("can delete Product", async () => {
            const response = await app
                .handle(new API('product')
                    .DELETE(10))
                .then((res) => res.json())
            console.log(response)
            expect(response).toBeObject()
            expect(response).not.toContainKey("message")
            expect(response).toEqual({
                id: 10,
                name: "test update",
                price: 10,
                qty: 10,
                exp: expect.any(String)// the actually is date
            })

        })
        it("can't  because after delete data Product", async () => {
            const response = await app
                .handle(new API('product')
                    .DELETE(10))
                .then((res) => res.json())
            console.log(response)
            expect(response).toBeObject()
            expect(response).toContainKey("message")
        })
    })
})