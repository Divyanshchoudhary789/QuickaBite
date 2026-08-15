// src/services/supportIssue.service.js
import apiClient, { parseApiError } from "../api/apiClient";

export const getFaqOptions = async () => {
  try {
    const res = await apiClient.get("/v1/support-issues/faq-options");
    return res.data?.data || res.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Failed to load support FAQ tree"));
  }
};

export const createSupportTicket = async (formData) => {
  try {
    const res = await apiClient.post("/v1/support-issues", formData);
    return res.data?.data || res.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Failed to submit support issue ticket"));
  }
};

export const getMySupportTickets = async () => {
  try {
    const res = await apiClient.get("/v1/support-issues/my-issues");
    return res.data?.data || res.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Failed to fetch your support tickets"));
  }
};

export const getRestaurantIssues = async (restaurantId, statusFilter) => {
  try {
    const params = {};
    if (restaurantId) params.restaurantId = restaurantId;
    if (statusFilter) params.statusFilter = statusFilter;

    const res = await apiClient.get("/v1/support-issues/restaurant", { params });
    return res.data?.data || res.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Failed to fetch restaurant issue tickets"));
  }
};

export const getAllIssuesForAdmin = async (statusFilter, categoryFilter) => {
  try {
    const params = {};
    if (statusFilter) params.statusFilter = statusFilter;
    if (categoryFilter) params.categoryFilter = categoryFilter;

    const res = await apiClient.get("/v1/support-issues/admin/all", { params });
    return res.data?.data || res.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Failed to fetch global support tickets"));
  }
};

export const resolveIssueTicket = async (issueId, payload) => {
  try {
    const res = await apiClient.patch(`/v1/support-issues/${issueId}/resolve`, payload);
    return res.data?.data || res.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Failed to process issue resolution"));
  }
};

export const adminOverrideTicket = async (issueId, payload) => {
  try {
    const res = await apiClient.patch(`/v1/support-issues/${issueId}/admin-override`, payload);
    return res.data?.data || res.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Failed to execute admin override"));
  }
};

export const getUserLoyaltyScore = async (userId) => {
  try {
    const res = await apiClient.get(`/v1/support-issues/user-loyalty/${userId}`);
    return res.data?.data || res.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Failed to calculate user loyalty score"));
  }
};
