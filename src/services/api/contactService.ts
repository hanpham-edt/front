import { Contact, CreateContact } from "@/types/contact-types";
import { apiClient } from "./axios-config";

export class contactService {
  private static ENDPOINT = "/contacts";

  // Create new Contact
  static async createContact(contact: CreateContact): Promise<Contact> {
    const response = await apiClient.post(this.ENDPOINT, contact);
    return response.data;
  }
}
