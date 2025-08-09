import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AppSettings {
  brand_name?: string;
  support_email?: string;
  support_phone?: string;
  upi_id?: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("settings").select("*");
      if (!error && data) {
        const s: AppSettings = {};
        data.forEach((row: any) => {
          if (row.key && row.value !== undefined) {
            (s as any)[row.key] = row.value;
          }
        });
        setSettings(s);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  return { settings, loading };
};
