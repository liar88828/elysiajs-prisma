import { Prisma } from "@prisma/client";
import { Args } from "@prisma/client/runtime/library";
import { prisma } from "../config/db";


export type ProductPrisma<T extends "create" | "update"> = Prisma.Args<
  typeof prisma.product, T
>["data"]
