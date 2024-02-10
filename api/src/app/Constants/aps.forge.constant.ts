console.log(process.env)
const { APS_CLIENT_ID, APS_CLIENT_SECRET, DATABASE_USER } = process.env;
console.log(APS_CLIENT_ID, APS_CLIENT_SECRET, DATABASE_USER)
let { APS_BUCKET } = process.env;
if (!APS_CLIENT_ID || !APS_CLIENT_SECRET) {
    console.warn('Missing some of the environment variables.');
    process.exit(1);
}

APS_BUCKET = APS_BUCKET || `${APS_CLIENT_ID.toLowerCase()}-basic-app`;

export const APS_FORGE_CONFIG = {
    APS_CLIENT_ID,
    APS_CLIENT_SECRET,
    APS_BUCKET,
}