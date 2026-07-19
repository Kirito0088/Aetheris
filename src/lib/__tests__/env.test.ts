import { describe, it, expect } from 'vitest';
import { env, serverEnvSchema } from '@/lib/env';

describe('Environment Validation', () => {
  describe('Client environment (env)', () => {
    it('exports a valid env object', () => {
      expect(env).toBeDefined();
      expect(typeof env).toBe('object');
    });

    it('has NEXT_PUBLIC_APP_URL with default value', () => {
      expect(env.NEXT_PUBLIC_APP_URL).toBeDefined();
      expect(typeof env.NEXT_PUBLIC_APP_URL).toBe('string');
    });

    it('has NEXT_PUBLIC_APP_ENV with default value', () => {
      expect(env.NEXT_PUBLIC_APP_ENV).toBeDefined();
      expect(['development', 'staging', 'production']).toContain(env.NEXT_PUBLIC_APP_ENV);
    });
  });

  describe('Server environment schema', () => {
    it('accepts valid complete configuration', () => {
      const result = serverEnvSchema.safeParse({
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
        GEMINI_API_KEY: 'test-gemini-key',
        WEATHER_API_KEY: 'test-weather-key',
        MAPS_API_KEY: 'test-maps-key',
      });
      expect(result.success).toBe(true);
    });

    it('accepts empty configuration (all fields optional)', () => {
      const result = serverEnvSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts partial configuration', () => {
      const result = serverEnvSchema.safeParse({
        GEMINI_API_KEY: 'some-key',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid NEXT_PUBLIC_SUPABASE_URL', () => {
      const result = serverEnvSchema.safeParse({
        NEXT_PUBLIC_SUPABASE_URL: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });
  });
});
