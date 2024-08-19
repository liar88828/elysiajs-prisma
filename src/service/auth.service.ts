import { prisma } from "../config/db";

import { LoginModel, RegisterModel } from "../model/auth";
import { TokenService } from "./token.service";

export class AuthService extends TokenService {
	confPass(data: RegisterModel) {
		if (data.password != data.confPass) {
			throw new Error('password not same')
		}
	}
	
	async userNotExist(data: RegisterModel) {
		const userDB = await prisma.userDB.findUnique(
			{ where: { email: data.email } })
		if (userDB) {
			throw new Error(`user ${ data.email }  already found`)
		}
	}
	
	async userExist(data: LoginModel) {
		const userDB = await prisma.userDB.findUnique(
			{ where: { email: data.email } })
		if (!userDB) {
			throw new Error(`user ${ data.email }  already found`)
		}
		return userDB
	}
	
	async registerUser(user: RegisterModel, token: string, hashPassword: string) {
		return prisma.userDB.create({
			data: {
				address: user.address,
				age: user.age,
				name: user.name,
				email: user.email,
				password: hashPassword,
				refreshTokens: 'not have token ',
			}
		})
	}
	
	async loginUser(email: string, password: string) {
		const userDB = await prisma.userDB.findUnique({ where: { email } })
		if (!userDB) {
			throw new Error(`user ${ email } not found`)
		}
		return userDB
	}
	
	async findTokenDB(email: string) {
		const refreshTokenDB = await prisma.userDB.findUnique({
			where: { email: email }
		})
		if (!refreshTokenDB) {
			throw new Error('user is not found refresh token not found')
		}
		return refreshTokenDB
	}
	
	async updateRefreshToken(email: string, hashRefreshToken: string) {
		const updateRefreshToken = await prisma.userDB.update({
			where: { email: email },
			data: { refreshTokens: hashRefreshToken }
		})
		if (!updateRefreshToken) {
			throw new Error('id user is not found refresh token not found')
		}
		return updateRefreshToken
	}
	
	async createTokenDB(idUser: number, hashRefreshToken: string,) {
		return prisma.userDB.update({
			where: { id: idUser },
			data: { refreshTokens: hashRefreshToken },
		});
	}
	
	async compareRefreshToken(emailPayload: string, tokenUser: string,) {
		const refreshTokenDB = await this.findTokenDB(emailPayload)
		await this.verifyTokenDB(tokenUser, refreshTokenDB.refreshTokens)
	}
	
	async updateToken(email: string, newRefreshToken: string) {
		const regenerateRefreshToken = await this.hashToken(newRefreshToken)
		const { password, refreshTokens, ...res } = await this.updateRefreshToken(email, regenerateRefreshToken)
		return res
	}
}



