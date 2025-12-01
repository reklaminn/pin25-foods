import { supabase } from './supabase';

export interface Address {
  id: string;
  member_id: string;
  title: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  district: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Turkish cities list
export const TURKISH_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis',
  'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Şırnak', 'Sivas',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

// Get all addresses for a member
export async function getMemberAddresses(memberId: string) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('member_id', memberId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get addresses error:', error);
      return { success: false, error: 'Adresler yüklenemedi' };
    }

    return { success: true, addresses: data as Address[] };
  } catch (error) {
    console.error('Get addresses error:', error);
    return { success: false, error: 'Adresler yüklenemedi' };
  }
}

// Add new address
export async function addAddress(
  memberId: string,
  addressData: {
    title: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    postalCode?: string;
    latitude?: number | null;
    longitude?: number | null;
    isDefault?: boolean;
  }
) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        member_id: memberId,
        title: addressData.title,
        full_name: addressData.fullName,
        phone: addressData.phone,
        address_line1: addressData.addressLine1,
        address_line2: addressData.addressLine2 || null,
        city: addressData.city,
        district: addressData.district,
        postal_code: addressData.postalCode || null,
        latitude: addressData.latitude || null,
        longitude: addressData.longitude || null,
        is_default: addressData.isDefault || false
      })
      .select()
      .single();

    if (error) {
      console.error('Add address error:', error);
      return { success: false, error: 'Adres eklenemedi' };
    }

    return { success: true, address: data };
  } catch (error) {
    console.error('Add address error:', error);
    return { success: false, error: 'Adres eklenemedi' };
  }
}

// Update address
export async function updateAddress(
  addressId: string,
  updates: {
    title?: string;
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    latitude?: number | null;
    longitude?: number | null;
    isDefault?: boolean;
  }
) {
  try {
    const updateData: any = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.fullName !== undefined) updateData.full_name = updates.fullName;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.addressLine1 !== undefined) updateData.address_line1 = updates.addressLine1;
    if (updates.addressLine2 !== undefined) updateData.address_line2 = updates.addressLine2 || null;
    if (updates.city !== undefined) updateData.city = updates.city;
    if (updates.district !== undefined) updateData.district = updates.district;
    if (updates.postalCode !== undefined) updateData.postal_code = updates.postalCode || null;
    if (updates.latitude !== undefined) updateData.latitude = updates.latitude;
    if (updates.longitude !== undefined) updateData.longitude = updates.longitude;
    if (updates.isDefault !== undefined) updateData.is_default = updates.isDefault;

    const { data, error } = await supabase
      .from('addresses')
      .update(updateData)
      .eq('id', addressId)
      .select()
      .single();

    if (error) {
      console.error('Update address error:', error);
      return { success: false, error: 'Adres güncellenemedi' };
    }

    return { success: true, address: data };
  } catch (error) {
    console.error('Update address error:', error);
    return { success: false, error: 'Adres güncellenemedi' };
  }
}

// Delete address
export async function deleteAddress(addressId: string) {
  try {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (error) {
      console.error('Delete address error:', error);
      return { success: false, error: 'Adres silinemedi' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete address error:', error);
    return { success: false, error: 'Adres silinemedi' };
  }
}

// Set default address
export async function setDefaultAddress(memberId: string, addressId: string) {
  try {
    // First, unset all default addresses for this member
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('member_id', memberId);

    // Then set the selected address as default
    const { data, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .select()
      .single();

    if (error) {
      console.error('Set default address error:', error);
      return { success: false, error: 'Varsayılan adres ayarlanamadı' };
    }

    return { success: true, address: data };
  } catch (error) {
    console.error('Set default address error:', error);
    return { success: false, error: 'Varsayılan adres ayarlanamadı' };
  }
}

// Get default address
export async function getDefaultAddress(memberId: string) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('member_id', memberId)
      .eq('is_default', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, address: null };
      }
      console.error('Get default address error:', error);
      return { success: false, error: 'Varsayılan adres alınamadı' };
    }

    return { success: true, address: data as Address };
  } catch (error) {
    console.error('Get default address error:', error);
    return { success: false, error: 'Varsayılan adres alınamadı' };
  }
}
