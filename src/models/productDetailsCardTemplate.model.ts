export interface ProductDetailsCardTemplate {
  headerTitle?:any;
  headeSubtitle?:any;
  images?: any;
  idCard?:any;
  authUserId?:any;
  nameUser?:any;
  department?:any,
  municipality?:any,
  phone?: string;
  email?: string;
  productDetailsTitle?:item [ ];
  infoAdicionalTitle?:any;
  infoAdicionalData?:any;
  infoAdicionalTitleTwo?:any;
  infoAdicionalDataTwo?: any;
}

interface item {
  data: any;
}
