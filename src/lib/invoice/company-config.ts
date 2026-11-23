export type CompanyKey = "rehoboth" | "kirubai";

export type CompanyConfig = {
  label: string;
  name: string;
  addressLines: string[];
  gstin: string;
  stateCode: string;
  state: string;
  cell: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  branch: string;
  motto: string;
  signName: string;
};

export const COMPANY_CONFIG: Record<CompanyKey, CompanyConfig> = {
  rehoboth: {
    label: "Rehoboth",
    name: "REHOBOTH TIMBER AND FURNITURES",
    addressLines: [
      "121/5, St. Mary's Street, Maravankudiyiruppu, Nagercoil - 629 002. Kanyakumari District, Tamil Nadu",
    ],
    gstin: "33AMXPA0210F1ZO",
    stateCode: "33",
    state: "Tamil Nadu",
    cell: "+91 99527 32233",
    bankName: "Rehoboth Timber and Furniture",
    accountNo: "005507777777777",
    ifsc: "TMBL 0000005",
    branch: "Nagercoil",
    motto: "Karthar Nallavar",
    signName: "Rehoboth Timber and Furniture",
  },
  kirubai: {
    label: "Kirubai",
    name: "KIRUBAI TIMBERS AND FURNITURE",
    addressLines: [
      "3/127D, Ramanputhoor Salai, Keezhakattuvilai, Pallam P.O., Nagercoil, Kanyakumari District, Tamil Nadu - 629 601.",
    ],
    gstin: "33CKWPR3858K1Z7",
    stateCode: "33",
    state: "Tamil Nadu",
    cell: "",
    bankName: "Kirubai Timbers and Furniture",
    accountNo: "005531777777777",
    ifsc: "TMBL 0000005",
    branch: "Nagercoil",
    motto: "Karthar Nallavar",
    signName: "Kirubai Timber and Furniture",
  },
};
