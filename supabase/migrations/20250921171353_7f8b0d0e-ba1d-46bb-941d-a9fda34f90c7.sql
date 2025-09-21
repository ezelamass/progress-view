-- Create team payment rates table
CREATE TABLE public.team_payment_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('hourly', 'fixed', 'milestone')),
  rate_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_until DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team payments table
CREATE TABLE public.team_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('salary', 'bonus', 'commission', 'milestone')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  payment_date DATE,
  due_date DATE,
  description TEXT,
  hours_worked DECIMAL(5,2),
  rate_id UUID REFERENCES public.team_payment_rates(id),
  invoice_number TEXT,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_payment_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_payment_rates
CREATE POLICY "Admins can manage all team payment rates"
ON public.team_payment_rates
FOR ALL
USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Team members can view their own rates"
ON public.team_payment_rates
FOR SELECT
USING (auth.uid() = user_id AND get_user_role(auth.uid()) = 'team');

-- RLS Policies for team_payments
CREATE POLICY "Admins can manage all team payments"
ON public.team_payments
FOR ALL
USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Team members can view their own payments"
ON public.team_payments
FOR SELECT
USING (auth.uid() = user_id AND get_user_role(auth.uid()) = 'team');

-- Create update triggers
CREATE TRIGGER update_team_payment_rates_updated_at
BEFORE UPDATE ON public.team_payment_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_payments_updated_at
BEFORE UPDATE ON public.team_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();