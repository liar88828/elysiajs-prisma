export class TokenService {
	async hashToken(token: string) {
		return new Bun.CryptoHasher("sha512")
			.update(token)
			.digest("hex");
	}
	
	async verifyToken(token: false) {
		const payload = token;
		if (!payload) {
			throw new Error("invalid refresh token");
		}
		return payload;
	}
	
	async verifyTokenDB(tokenUser: string, tokenDB: string) {
		const hashedToken = new Bun.CryptoHasher("sha512")
			.update(tokenUser!)
			.digest("hex");
		if (hashedToken !== tokenDB) {
			throw new Error("invalid refresh token");
		}
	}
	
	async comparePassword(userPassword: string, dbPassword: string) {
		const verify = await Bun.password.verify(
			userPassword,
			dbPassword,
			"bcrypt"
		);
		if (!verify) {
			throw new Error("password not match");
		}
	}
	
	async hashPassword(userPassword: string) {
		return Bun.password.hash(userPassword, {
			algorithm: "bcrypt",
			cost: 10,
		});
	}
	
}
