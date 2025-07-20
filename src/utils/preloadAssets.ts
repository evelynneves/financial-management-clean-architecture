import { Asset } from "expo-asset";

export const preloadServicesAssets = async () => {
    await Asset.loadAsync([
        require("../../assets/images/loan_icon.png"),
        require("../../assets/images/card_icon.png"),
        require("../../assets/images/donations_icon.png"),
        require("../../assets/images/pix_icon.png"),
        require("../../assets/images/insurance_icon.png"),
        require("../../assets/images/cell_phone_credit_icon.png"),
    ]);
};
