-- Update conversations SELECT policy so the creator can immediately read the conversation they created
DROP POLICY IF EXISTS "Users can read conversations they are members of" ON conversations;
CREATE POLICY "Users can read conversations they belong to or created"
  ON conversations FOR SELECT
  USING (
    auth.uid() = created_by
    OR is_member_of(auth.uid(), id)
  );

-- Update profiles SELECT policy so authenticated users in this private group can discover each other to select members
DROP POLICY IF EXISTS "Users can read profiles of members in shared conversations" ON profiles;
CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT
  USING (
    auth.role() = 'authenticated'
  );
