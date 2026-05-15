import { useCallback, useEffect, useState } from "react";
import client from "@/lib/api/client";

interface Agent {
  id: string;
  name: string;
  description: string | null;
  agentType: string;
  isPublic: boolean;
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/agents");
      setAgents(data.data?.agents || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return { agents, loading, refetch: fetchAgents };
}
