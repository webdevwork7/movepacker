import { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface CompanySignupData {
  company_name: string;
  phone: string;
  address: string;
  description?: string;
  city: string;
  state: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    userData?: CompanySignupData
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    const stored = localStorage.getItem("isAdmin");
    return stored === "true";
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      // Restore isAdmin from localStorage on auth state change
      const stored = localStorage.getItem("isAdmin");
      setIsAdmin(stored === "true");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      // Restore isAdmin from localStorage on session fetch
      const stored = localStorage.getItem("isAdmin");
      setIsAdmin(stored === "true");
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Check if this is an admin login attempt
    if (email === "admin@gmail.com") {
      const { data, error: adminCheckError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single();

      if (adminCheckError || !data) {
        return { error: { message: "Invalid admin credentials" } };
      }

      // For admin, we'll use Supabase auth but mark them as admin
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true");
      }

      return { error };
    }

    // Regular user login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    localStorage.setItem("isAdmin", "false");
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    userData?: CompanySignupData
  ) => {
    // 1. Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: userData,
      },
    });
    if (error) return { error };

    // 2. After signup, create a company record if company_name is provided
    if (
      userData?.company_name &&
      userData?.phone &&
      userData?.address &&
      userData?.city &&
      userData?.state
    ) {
      // Wait for the user to be available in auth
      let userId = data?.user?.id;
      if (!userId) {
        // Try to get the user from the current session
        const session = (await supabase.auth.getSession()).data.session;
        userId = session?.user?.id;
      }
      if (userId) {
        await supabase.from("companies").insert({
          user_id: userId,
          name: userData.company_name,
          phone: userData.phone,
          email: email,
          address: userData.address,
          description: userData.description || "",
          city: userData.city,
          state: userData.state,
          is_active: false,
        });
      }
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isAdmin, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
