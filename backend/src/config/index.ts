import 'dotenv/config'

export const dev = {
  app: {
    port: Number(process.env.PORT),
    jwtUserKey: process.env.JWT_SECRET,
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
    braintreeMerchantId: String(process.env.BRAINTREE_MERCHANT_ID),
    braintreePublicKey: String(process.env.BRAINTREE_PUBLIC_KEY),
    braintreePrivateKey: String(process.env.BRAINTREE_PRIVATE_KEY),
  },
  db: {
    url: process.env.MONGODB_URL,
  },
}
