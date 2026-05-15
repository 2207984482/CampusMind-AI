import { useCallback, useEffect, useState } from "react";
import client from "@/lib/api/client";

interface KnowledgeBase {
  id: string;
  name: string;
  description: string | null;
  documentCount: number;
}

export function useKnowledgeBases() {
  const [bases, setBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBases = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/knowledge/bases");
      setBases(data.data?.knowledge_bases || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBases();
  }, [fetchBases]);

  return { bases, loading, refetch: fetchBases };
}
