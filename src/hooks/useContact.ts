import { useCallback, useState } from "react";
import {
  ContactQueryParams,
  ContactResponse,
  Contact,
} from "@/types/contact-types";
import { contactService } from "@/services/api/contactService";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Get All Contact
  const getContacts = useCallback(
    async (params?: ContactQueryParams): Promise<ContactResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await contactService.getCategories(params);
        if (response == null) {
          setError("Empty response");
          return null;
        }
        setContacts(response.data);
        setMeta(response.meta);
        return response;
      } catch (error) {
        console.error("Error getting products:", error);
        setError((error as Error).message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );
  return {
    contacts,
    isLoading,
    error,
    meta,
    getContacts,
  };
}
