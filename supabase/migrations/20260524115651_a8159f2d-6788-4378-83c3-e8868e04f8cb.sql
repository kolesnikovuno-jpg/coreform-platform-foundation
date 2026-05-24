CREATE TABLE public.signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  signal_type text NOT NULL DEFAULT 'text',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own signals"
  ON public.signals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own signals"
  ON public.signals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own signals"
  ON public.signals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_signals_project_id_created_at ON public.signals(project_id, created_at DESC);