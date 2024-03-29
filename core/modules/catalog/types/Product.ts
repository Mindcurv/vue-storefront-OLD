import { CustomOption } from './CustomOption';

export default interface Product {
  category: Record<string, any>[],
  category_ids: string[],
  color: string,
  color_options?: number[] | string[],
  configurable_children: Record<string, any>[],
  configurable_options: Record<string, any>[],
  custom_attributes?: any,
  description: string,
  errors?: Record<string, any>,
  final_price: number,
  finalPrice: number,
  gift_message_available: string,
  has_options?: string,
  id?: number | string,
  image: string,
  info?: Record<string, any>,
  is_configured?: true,
  material?: string,
  max_price?: number,
  max_regular_price?: number,
  media_gallery: Record<string, any>[],
  minimal_price: number,
  minimal_regular_price: number,
  name: string,
  new?: string,
  options?: Record<string, any>[],
  parentSku?: string,
  pattern?: string,
  price: number,
  price_incl_tax?: number,
  priceInclTax?: number,
  price_tax?: number,
  priceTax?: number,
  product_links?: Record<string, any>[],
  product_option?: Record<string, any>,
  regular_price: number,
  required_options?: string,
  sale?: string,
  sgn?: string,
  size: string,
  size_options?: number[] | string[],
  sku: string,
  slug?: string,
  small_image?: string,
  special_price_incl_tax?: any,
  special_price_tax?: any,
  special_price?: number,
  specialPriceInclTax?: any,
  specialPriceTax?: any,
  specialPrice?: number,
  status: number,
  stock: Record<string, any>,
  style_general?: string,
  tax_class_id?: string,
  thumbnail?: string,
  tsk?: number,
  type_id: string,
  url_key: string,
  visibility: number,
  _score?: number,
  qty?: number,
  custom_options?: CustomOption
}
