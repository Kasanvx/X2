import dotenv from 'dotenv'
dotenv.config()

const config = {
    SITE_URL: 'https://donate.khasan.site',
    APIQRIS_API_KEY: '',
    APIQRIS_MERCHANT_CODE: '478143523796',
    ADMIN_PASSWORD: '',
    JSONBIN_ID: '',
    JSONBIN_KEY: '',
    WAPITO_API_KEY: '',
    WAPITO_API_URL: 'https://api.wapito.com/v1/messages/text',
    OTP_HASH_SECRET: '',
    DONATION_FEE_ENABLED: 'false',
    MEMBER_FEE_PERCENT: '0.3',
    ANONYMOUS_FEE_PERCENT: '0.7',
    EARLY_SUPPORTER_CUTOFF: ''
}

for (const [key, value] of Object.entries(config)) {
    if (process.env[key] === undefined || process.env[key] === '') process.env[key] = value
}
