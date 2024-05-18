const { APS_CLIENT_ID, APS_CLIENT_SECRET } = process.env;
let { APS_BUCKET } = process.env;
if (!APS_CLIENT_ID || !APS_CLIENT_SECRET) {
    process.exit(1);
}

APS_BUCKET = APS_BUCKET || `${APS_CLIENT_ID.toLowerCase()}-basic-app`;

const APS_VIEWER_SUPPORTED_FORMATS = ["3DM", "3DS", "A", "ASM", "AXM", "BRD", "CATPART", "CATPRODUCT", "CGR", "COLLABORATION", "DAE", "DDX", "DDZ", "DGK", "DGN", "DLV3", "DMT", "DWF", "DWFX", "DWG *", "DWT", "DXF", "EMODEL", "EXP", "F3D", "FBRD", "FBX", "FSCH", "G",  "GBXML", "GLB", "GLTF", "IAM", "IDW", "IFC", "IGE", "IGES", "IGS", "IPT", "IWM", "JT", "MAX", "MODEL", "MPF", "MSR", "NEU", "NWC", "NWD", "OBJ", "OSB", "PAR", "PMLPRJ", "PMLPRJZ", "PRT", "PSM", "PSMODEL", "RVT **", "SAB", "SAT", "SCH", "SESSION", "SKP", "SLDASM", "SLDPRT", "SMB", "SMT", "STE", "STEP", "STL", "STLA", "STLB", "STP", "STPZ", "VPB", "VUE", "WIRE", "X_B", "X_T", "XAS", "XPR"]

export const APS_FORGE_CONFIG = {
    APS_CLIENT_ID,
    APS_CLIENT_SECRET,
    APS_BUCKET,
    APS_VIEWER_SUPPORTED_FORMATS
}