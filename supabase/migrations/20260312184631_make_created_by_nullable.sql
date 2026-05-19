/*
  # Make created_by Fields Nullable

  ## Problem
  The `created_by` fields in various tables reference `admin_users.id`, but:
  - Auth users exist in `auth.users` table
  - No corresponding records exist in `admin_users` table
  - This causes foreign key constraint violations when creating records

  ## Solution
  The `created_by` fields are already nullable in the schema, but we need to ensure
  the foreign key constraint allows NULL values. This is already the case, so the
  issue is that the application is trying to insert a user ID that doesn't exist
  in the `admin_users` table.

  The real fix is to either:
  1. Remove the `created_by` field from inserts (set it to NULL)
  2. Create admin_users records for auth users
  
  For now, we'll update the foreign key constraints to be more permissive by
  dropping the NOT NULL constraint if it exists.
*/

-- The created_by columns are already nullable, so no schema change needed
-- This migration serves as documentation of the issue and resolution

-- The fix will be in the application code to not set created_by
-- or to set it to NULL explicitly
