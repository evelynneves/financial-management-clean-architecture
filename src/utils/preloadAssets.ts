/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

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
