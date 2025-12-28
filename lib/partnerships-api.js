/**
 * Partnerships API
 * Manages partner connections and requests in Supabase
 */

import { supabase, getCurrentUser } from './supabase-client.js';

/**
 * Search for users by email
 * @param {string} email - Email to search for
 * @returns {Promise<Array>} Array of matching users
 */
export async function searchUserByEmail(email) {
  try {
    if (!email || email.length < 3) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name')
      .ilike('email', `%${email}%`)
      .limit(10);

    if (error) throw error;

    // Filter out current user
    const currentUser = await getCurrentUser();
    return data.filter(u => u.id !== currentUser?.id);
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

/**
 * Search for users by name
 * @param {string} name - Name to search for
 * @returns {Promise<Array>} Array of matching users
 */
export async function searchUserByName(name) {
  try {
    if (!name || name.length < 2) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name')
      .ilike('full_name', `%${name}%`)
      .limit(10);

    if (error) throw error;

    // Filter out current user
    const currentUser = await getCurrentUser();
    return data.filter(u => u.id !== currentUser?.id);
  } catch (error) {
    console.error('Error searching users by name:', error);
    throw error;
  }
}

/**
 * Send a partnership request
 * @param {string} partnerId - The partner's user ID
 * @returns {Promise<object>} The created partnership
 */
export async function sendPartnerRequest(partnerId) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    if (currentUser.id === partnerId) {
      throw new Error('Cannot send partnership request to yourself');
    }

    // Check if partnership already exists
    const existing = await getPartnership(partnerId);
    if (existing) {
      throw new Error('Partnership already exists with this user');
    }

    // Ensure user1_id < user2_id for consistency
    const user1_id = currentUser.id < partnerId ? currentUser.id : partnerId;
    const user2_id = currentUser.id < partnerId ? partnerId : currentUser.id;

    const { data, error } = await supabase
      .from('partnerships')
      .insert({
        user1_id,
        user2_id,
        status: 'pending',
        requested_by: currentUser.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending partner request:', error);
    throw error;
  }
}

/**
 * Get all partnership requests (pending, sent and received)
 * @returns {Promise<object>} Object with sent and received requests
 */
export async function getPartnershipRequests() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    // Get all partnerships involving current user
    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
      .eq('status', 'pending');

    if (error) throw error;

    // Fetch user profiles for all partnerships
    const userIds = new Set();
    data.forEach(p => {
      userIds.add(p.user1_id);
      userIds.add(p.user2_id);
    });

    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name')
      .in('id', Array.from(userIds));

    if (profileError) throw profileError;

    // Create a map of user profiles
    const profileMap = {};
    profiles.forEach(p => profileMap[p.id] = p);

    // Split into sent and received
    const sent = [];
    const received = [];

    data.forEach(partnership => {
      const isRequester = partnership.requested_by === currentUser.id;
      const partnerId = partnership.user1_id === currentUser.id 
        ? partnership.user2_id 
        : partnership.user1_id;

      const formattedPartnership = {
        ...partnership,
        user1: profileMap[partnership.user1_id],
        user2: profileMap[partnership.user2_id],
        partner: profileMap[partnerId]
      };

      if (isRequester) {
        sent.push(formattedPartnership);
      } else {
        received.push(formattedPartnership);
      }
    });

    return { sent, received };
  } catch (error) {
    console.error('Error getting partnership requests:', error);
    throw error;
  }
}

/**
 * Get accepted partnership
 * @returns {Promise<object|null>} The accepted partnership or null
 */
export async function getAcceptedPartnership() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
      .eq('status', 'accepted')
      .maybeSingle();

    if (error) throw error;

    if (data) {
      // Fetch user profiles
      const partnerId = data.user1_id === currentUser.id ? data.user2_id : data.user1_id;
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, email, full_name')
        .in('id', [data.user1_id, data.user2_id]);

      if (profileError) throw profileError;

      const profileMap = {};
      profiles.forEach(p => profileMap[p.id] = p);

      // Add helper properties for partner info
      data.user1 = profileMap[data.user1_id];
      data.user2 = profileMap[data.user2_id];
      data.partner = profileMap[partnerId];
    }

    return data;
  } catch (error) {
    console.error('Error getting accepted partnership:', error);
    throw error;
  }
}

/**
 * Get any partnership with a specific user (regardless of status)
 * @param {string} partnerId - The partner's user ID
 * @returns {Promise<object|null>} The partnership or null
 */
export async function getPartnership(partnerId) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const user1_id = currentUser.id < partnerId ? currentUser.id : partnerId;
    const user2_id = currentUser.id < partnerId ? partnerId : currentUser.id;

    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .eq('user1_id', user1_id)
      .eq('user2_id', user2_id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting partnership:', error);
    throw error;
  }
}

/**
 * Accept a partnership request
 * @param {string} partnershipId - The partnership ID
 * @returns {Promise<object>} The updated partnership
 */
export async function acceptPartnershipRequest(partnershipId) {
  try {
    const { data, error } = await supabase
      .from('partnerships')
      .update({
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', partnershipId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error accepting partnership:', error);
    throw error;
  }
}

/**
 * Decline a partnership request
 * @param {string} partnershipId - The partnership ID
 * @returns {Promise<object>} The updated partnership
 */
export async function declinePartnershipRequest(partnershipId) {
  try {
    const { data, error } = await supabase
      .from('partnerships')
      .update({
        status: 'declined',
        updated_at: new Date().toISOString()
      })
      .eq('id', partnershipId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error declining partnership:', error);
    throw error;
  }
}

/**
 * Delete a partnership (for removing connections)
 * @param {string} partnershipId - The partnership ID
 * @returns {Promise<void>}
 */
export async function deletePartnership(partnershipId) {
  try {
    const { error } = await supabase
      .from('partnerships')
      .delete()
      .eq('id', partnershipId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting partnership:', error);
    throw error;
  }
}

/**
 * Check if current user has an accepted partnership
 * @returns {Promise<boolean>} True if user has accepted partnership
 */
export async function hasAcceptedPartnership() {
  try {
    const partnership = await getAcceptedPartnership();
    return !!partnership;
  } catch (error) {
    console.error('Error checking partnership:', error);
    return false;
  }
}

/**
 * Get partner's user ID from accepted partnership
 * @returns {Promise<string|null>} Partner's user ID or null
 */
export async function getPartnerId() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    const partnership = await getAcceptedPartnership();
    if (!partnership) return null;

    return partnership.user1_id === currentUser.id 
      ? partnership.user2_id 
      : partnership.user1_id;
  } catch (error) {
    console.error('Error getting partner ID:', error);
    return null;
  }
}

// Export for global access in browser
if (typeof window !== 'undefined') {
  window.partnershipsApi = {
    searchUserByEmail,
    searchUserByName,
    sendPartnerRequest,
    getPartnershipRequests,
    getAcceptedPartnership,
    getPartnership,
    acceptPartnershipRequest,
    declinePartnershipRequest,
    deletePartnership,
    hasAcceptedPartnership,
    getPartnerId
  };
}

