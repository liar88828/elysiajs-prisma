import Elysia, { t } from "elysia";

export const modelProduct = new Elysia({ name: "Model.Product" })
    .model({
        "product.id": t.Object({ id: t.Number() }),
    })
    .model({
        "product.base": t.Object({
            id: t.Optional(t.Number()),
            name: t.String(),
            price: t.Number(),
            qty: t.Number(),
            exp: t.Date(),
        }),
    });