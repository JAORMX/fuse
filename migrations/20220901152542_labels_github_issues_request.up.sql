BEGIN;
ALTER TABLE public.github_issues
ADD COLUMN labels jsonb DEFAULT jsonb_build_object() NOT NULL;


ALTER TABLE public.github_pull_requests
ADD COLUMN labels jsonb DEFAULT jsonb_build_object() NOT NULL;

COMMIT;
