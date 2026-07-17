-- Enforce the same incident-report limits at the data boundary. UI validation
-- improves feedback; these constraints protect every future client and API.
ALTER TABLE public.incidents
  ADD CONSTRAINT incidents_title_length_check
  CHECK (char_length(btrim(title)) BETWEEN 3 AND 120),
  ADD CONSTRAINT incidents_description_length_check
  CHECK (char_length(btrim(description)) BETWEEN 10 AND 1000);
