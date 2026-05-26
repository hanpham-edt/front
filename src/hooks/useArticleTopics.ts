"use client";

import { useCallback, useState } from "react";
import type { ArticleTopic } from "@/types/article-types";
import { articleTopicService } from "@/services/api/articleTopicService";

export function useArticleTopics() {
  const [topics, setTopics] = useState<ArticleTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTopics = useCallback(async (admin = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = admin
        ? await articleTopicService.getAllAdmin()
        : await articleTopicService.getPublished();
      setTopics(data);
      return data;
    } catch (err: unknown) {
      setTopics([]);
      setError(err instanceof Error ? err.message : "Không tải được chủ đề");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { topics, isLoading, error, getTopics };
}
