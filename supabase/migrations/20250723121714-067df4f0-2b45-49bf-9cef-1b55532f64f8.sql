
-- Fix RLS policies for leads table to allow public insertion
DROP POLICY IF EXISTS "Admin can view all leads" ON public.leads;

-- Allow anyone to insert leads (for quote form)
CREATE POLICY "Anyone can create leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Admin can view all leads (will be handled by service role for admin panel)
CREATE POLICY "Admin can view all leads" ON public.leads
  FOR SELECT USING (false);

-- Insert sample companies data
INSERT INTO public.companies (name, description, phone, email, address, city, state, rating, review_count, is_active) VALUES 
('Elite Movers & Packers', 'Professional moving services with 15+ years of experience. Specializing in residential and commercial relocations.', '+1-555-0101', 'info@elitemovers.com', '123 Main St', 'New York', 'NY', 4.8, 156, true),
('Swift Relocations', 'Fast and reliable moving services across the country. We handle everything from packing to unpacking.', '+1-555-0102', 'contact@swiftrelocations.com', '456 Oak Ave', 'Los Angeles', 'CA', 4.7, 142, true),
('Premier Moving Solutions', 'Your trusted moving partner for local and long-distance moves. Licensed and insured.', '+1-555-0103', 'hello@premiermoves.com', '789 Pine Rd', 'Chicago', 'IL', 4.9, 203, true),
('Secure Pack & Move', 'Secure and efficient moving services with specialized equipment for fragile items.', '+1-555-0104', 'support@securepackmove.com', '321 Elm St', 'Houston', 'TX', 4.6, 98, true),
('Express Movers Co', 'Express moving services for urgent relocations. Available 24/7 for emergency moves.', '+1-555-0105', 'info@expressmovers.com', '654 Cedar Blvd', 'Phoenix', 'AZ', 4.5, 87, true),
('Reliable Moving Services', 'Family-owned moving company providing personalized service for over 20 years.', '+1-555-0106', 'contact@reliablemoving.com', '987 Birch Lane', 'Philadelphia', 'PA', 4.7, 134, true),
('Professional Packers', 'Expert packing and moving services with eco-friendly materials and practices.', '+1-555-0107', 'info@profpackers.com', '147 Maple Dr', 'San Antonio', 'TX', 4.8, 167, true),
('Metro Moving Group', 'Comprehensive moving solutions for residential and commercial clients nationwide.', '+1-555-0108', 'hello@metromoving.com', '258 Willow St', 'San Diego', 'CA', 4.6, 112, true),
('Ace Relocations', 'Ace moving services with modern equipment and trained professionals.', '+1-555-0109', 'support@acerelocations.com', '369 Spruce Ave', 'Dallas', 'TX', 4.9, 189, true),
('City Movers Plus', 'Urban moving specialists with experience in high-rise and downtown relocations.', '+1-555-0110', 'info@citymoversplus.com', '741 Ash St', 'San Jose', 'CA', 4.4, 76, true),
('National Moving Corp', 'Coast-to-coast moving services with tracking and insurance options.', '+1-555-0111', 'contact@nationalmovingcorp.com', '852 Cherry Rd', 'Austin', 'TX', 4.7, 145, true),
('Quality Move Services', 'Quality-focused moving company with competitive pricing and excellent service.', '+1-555-0112', 'hello@qualitymove.com', '963 Walnut Blvd', 'Jacksonville', 'FL', 4.5, 91, true),
('Prime Relocation', 'Prime moving services for corporate and residential clients with white-glove service.', '+1-555-0113', 'info@primerelocation.com', '174 Hickory Lane', 'Columbus', 'OH', 4.8, 156, true),
('Best Move Solutions', 'Best-in-class moving solutions with customer satisfaction guarantee.', '+1-555-0114', 'support@bestmovesolutions.com', '285 Poplar Dr', 'Charlotte', 'NC', 4.6, 108, true),
('Superior Moving Co', 'Superior moving experience with state-of-the-art equipment and skilled teams.', '+1-555-0115', 'contact@superiormovingco.com', '396 Sycamore St', 'San Francisco', 'CA', 4.9, 198, true);

-- Insert sample reviews
INSERT INTO public.reviews (company_id, customer_name, customer_email, rating, review_text) VALUES 
((SELECT id FROM public.companies WHERE name = 'Elite Movers & Packers'), 'John Smith', 'john@email.com', 5, 'Excellent service! They handled our move professionally and efficiently.'),
((SELECT id FROM public.companies WHERE name = 'Elite Movers & Packers'), 'Sarah Johnson', 'sarah@email.com', 4, 'Great team, very careful with our furniture. Highly recommend!'),
((SELECT id FROM public.companies WHERE name = 'Swift Relocations'), 'Mike Brown', 'mike@email.com', 5, 'Fast and reliable service. They made our long-distance move stress-free.'),
((SELECT id FROM public.companies WHERE name = 'Premier Moving Solutions'), 'Lisa Davis', 'lisa@email.com', 5, 'Outstanding service from start to finish. Very professional team.'),
((SELECT id FROM public.companies WHERE name = 'Secure Pack & Move'), 'Robert Wilson', 'robert@email.com', 4, 'They took great care of our fragile items. Very satisfied with the service.'),
((SELECT id FROM public.companies WHERE name = 'Express Movers Co'), 'Emily Taylor', 'emily@email.com', 4, 'Quick response and efficient service. Perfect for our urgent move.'),
((SELECT id FROM public.companies WHERE name = 'Reliable Moving Services'), 'David Anderson', 'david@email.com', 5, 'Family-owned business with personal touch. Excellent experience.'),
((SELECT id FROM public.companies WHERE name = 'Professional Packers'), 'Jennifer Martinez', 'jennifer@email.com', 5, 'Eco-friendly approach and professional service. Highly recommend!'),
((SELECT id FROM public.companies WHERE name = 'Metro Moving Group'), 'Chris Garcia', 'chris@email.com', 4, 'Comprehensive service with good value for money.'),
((SELECT id FROM public.companies WHERE name = 'Ace Relocations'), 'Amanda Rodriguez', 'amanda@email.com', 5, 'Modern equipment and skilled professionals. Perfect move!'),
((SELECT id FROM public.companies WHERE name = 'City Movers Plus'), 'Kevin Lee', 'kevin@email.com', 4, 'Great for downtown moves. They know how to navigate city challenges.'),
((SELECT id FROM public.companies WHERE name = 'National Moving Corp'), 'Michelle White', 'michelle@email.com', 5, 'Excellent tracking system and insurance options. Very reliable.'),
((SELECT id FROM public.companies WHERE name = 'Quality Move Services'), 'Brian Harris', 'brian@email.com', 4, 'Good quality service at competitive prices.'),
((SELECT id FROM public.companies WHERE name = 'Prime Relocation'), 'Nicole Clark', 'nicole@email.com', 5, 'White-glove service as promised. Exceptional experience.'),
((SELECT id FROM public.companies WHERE name = 'Superior Moving Co'), 'Steven Lewis', 'steven@email.com', 5, 'Superior equipment and skilled team. Couldn\'t be happier!');

-- Fix admin authentication by updating password hash for admin@123
UPDATE public.admin_users 
SET password_hash = '$2b$10$8K1p/a0dChGBF7CRfWfO3.5XQrFNkOe6l3XWvXcZYQQsWKOZSMHga'
WHERE email = 'admin@gmail.com';

-- Create plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add plan_id column to companies table
ALTER TABLE public.companies ADD COLUMN plan_id UUID REFERENCES public.plans(id);

-- Insert default plans
INSERT INTO public.plans (id, name, description, priority, price, features) VALUES 
('071ad825-e97c-4597-a554-75c1655556be', 'Silver', 'Basic plan with essential features', 1, 99.00, ARRAY['Basic listing', 'Email support', 'Standard visibility']),
('58a35b88-5010-404a-9ec4-ffbc370c90a0', 'Gold', 'Premium plan with enhanced features', 2, 199.00, ARRAY['Enhanced listing', 'Priority support', 'Featured placement', 'Analytics dashboard']),
('5cda54bc-509a-43fd-8706-200cd6d83bdd', 'Platinum', 'Ultimate plan with all features', 3, 299.00, ARRAY['Premium listing', '24/7 support', 'Top placement', 'Advanced analytics', 'Custom branding', 'Priority leads']);

-- Enable RLS for plans table
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plans
CREATE POLICY "Anyone can view plans" ON public.plans
  FOR SELECT USING (true);
