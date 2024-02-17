const { APS_CLIENT_ID, APS_CLIENT_SECRET } = process.env;
let { APS_BUCKET } = process.env;
if (!APS_CLIENT_ID || !APS_CLIENT_SECRET) {
    process.exit(1);
}

APS_BUCKET = APS_BUCKET || `${APS_CLIENT_ID.toLowerCase()}-basic-app`;

export const APS_FORGE_CONFIG = {
    APS_CLIENT_ID,
    APS_CLIENT_SECRET,
    APS_BUCKET,
}