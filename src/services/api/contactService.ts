import {
  Contact,
  CreateContact,
  ContactQueryParams,
  ContactResponse,
  UpdateContact,
} from "@/types/contact-types";
import { apiClient } from "./axios-config";

export class contactService {
  private static ENDPOINT = "/contacts";

  // Create new Contact
  static async createContact(contact: CreateContact): Promise<Contact> {
    const response = await apiClient.post(this.ENDPOINT, contact);
    return response.data;
  }
  // Get All Contact
  static async getCategories(
    params?: ContactQueryParams,
  ): Promise<ContactResponse | null> {
    const response = await apiClient.get<ContactResponse>(this.ENDPOINT, {
      params: params,
    });
    return response.data;
  }

  // Update Contact
  static async updateContact(
    id: string,
    contact: UpdateContact,
  ): Promise<Contact> {
    const safeId = id.trim();
    const response = await apiClient.patch(
      `${this.ENDPOINT}/${encodeURIComponent(safeId)}`,
      contact,
    );
    return response.data;
  }

  // Delete Contact
  static async deleteContact(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.ENDPOINT}/${id}`);
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw new Error("Failed to delete contact");
    }
  }
}
